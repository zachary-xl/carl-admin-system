<template>
    <div class="app-container">
        <el-form ref="searchForm" :inline="true" :model="searchParams" @submit.prevent="getList">
            <el-form-item label="搜索" prop="search">
                <el-input v-model="searchParams.search" placeholder="养殖户名称，负责人" clearable />
            </el-form-item>
            <el-form-item>
                <el-button text bg icon="refreshLeft" @click="resetForm">重置</el-button>
                <el-button type="primary" bg icon="Search" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-divider class="!mt-2 !mb-4" />
        <el-row :gutter="10" class="mb-4">
            <el-col :span="1.5">
                <el-button type="primary" icon="plus" plain @click="onHandleCreate">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" icon="delete" plain :disabled="selectedRows.length === 0" @click="handleBatchDelete">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" class="w-full" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="姓名" align="center" :formatter="normalFormatter" />
            <el-table-column prop="phone" label="手机号" align="center" :formatter="normalFormatter" />
            <el-table-column prop="num" label="客户数" align="center" :formatter="normalFormatter" />
            <el-table-column prop="dwellingHouseCreateNum" label="推荐的栋舍数" align="center" :formatter="normalFormatter" />
            <el-table-column prop="dwellingHouseSuccessNum" label="成功投保的栋舍数
" align="center" :formatter="normalFormatter" />
            <el-table-column prop="yearMoney" label="本年累计投保金额" align="center" :formatter="normalFormatter" />
            <el-table-column label="操作" align="center" width="200">
                <template #default="{ row }">
                    <el-button type="primary" link @click="onHandleEdit(row)"> 编辑</el-button>
                    <el-button type="primary" link @click="onHandleLink(row)"> 业务员链接</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="relative float-right" v-model:current-page="paginationParams.currentPage"
            v-model:page-size="paginationParams.page_size" :page-sizes="[10, 30, 50, 100]" background :total="total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="(val) => (paginationParams.page_size = val)"
            @current-change="(val) => (paginationParams.currentPage = val)" @change="getList" />
        <FormComp v-model="dialogVisible" v-if="dialogVisible" :config="config" :visible="dialogVisible"
            @update:visible="(bool) => (dialogVisible = bool)" @confirm="dialogVisible = false,getList()" />
    </div>
</template>

<script setup lang="ts">
import { getEmployeeListAPI, postEmployeeDeleteAPI } from '@/api';
import FormComp from './components/FormComp.vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const total = ref(0);
const config = ref({
    title: "新增",
    id: undefined
});
const searchForm = ref();
const searchParams = reactive({
    search: ""
});
const paginationParams = reactive({
    currentPage: 1,
    page_size: 10
});
const dialogVisible = ref(false);
const tableData = ref<any[]>([]);
const selectedRows = ref<any[]>([]);
const onHandleLink = (row: any) => {
    console.log(row);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}#/salesman-main?id=${row.id}`;
    // 复制链接到剪贴板
    navigator.clipboard.writeText(shareUrl)
        .then(() => {
            ElMessage({
                message: '链接已复制，可以分享给养殖户了',
                type: 'success'
            });
        })
        .catch(err => {
            console.error('复制失败:', err);
            ElMessage({
                message: '链接复制失败',
                type: 'error'
            });
        });
}
const resetForm = () => {
    searchForm.value.resetFields();
    getList();
}
const normalFormatter = (_row: any, _column: any, cellValue: any) => {
    return cellValue ?? '-';
};
const getList = () => {
    getEmployeeListAPI({ ...paginationParams, ...searchParams }).then((res) => {
        tableData.value = res.data.list;
        total.value = res.data.total;
    });
};
const onHandleEdit = (row: any) => {
    config.value.title = "编辑";
    config.value.id = row.id;
    dialogVisible.value = true;
}
const onHandleCreate = () => {
    config.value.title = "新增";
    config.value.id = undefined;
    dialogVisible.value = true;
}

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
    selectedRows.value = selection;
};

// 批量删除处理函数
const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
        return;
    }

    ElMessageBox.confirm(
        `确认删除选中的 ${selectedRows.value.length} 条数据吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        // 这里添加批量删除的API调用
        const ids = selectedRows.value.map(row => row.id);
        postEmployeeDeleteAPI(ids).then(() => {
            ElMessage.success('删除成功');
            getList();
        });

        // 临时提示，需要替换为实际API调用
        ElMessage.success('批量删除功能需要对接后端API');
        getList();
    }).catch(() => {
        // 取消删除
    });
};

getList();
</script>
