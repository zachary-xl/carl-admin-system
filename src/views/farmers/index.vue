<template>
    <div class="app-container">
        <el-form :inline="true">
            <el-form-item label="搜索" prop="search">
                <el-input placeholder="养殖户名称，负责人" clearable />
            </el-form-item>
            <el-form-item>
                <el-button text bg icon="refreshLeft">重置</el-button>
                <el-button type="primary" bg icon="Search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-divider class="!mt-2 !mb-4" />
        <el-row :gutter="10" class="mb-4">
            <el-col :span="1.5">
                <el-button type="primary" icon="plus" plain @click="onHandleCreate">新增</el-button>
            </el-col>
        </el-row>
        <el-table :data="userList" class="w-full" header-cell-class-name="table-header">
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column prop="nickname" label="昵称" align="center" :formatter="normalFormatter" />
            <el-table-column prop="name" label="姓名" align="center" :formatter="normalFormatter" />
            <el-table-column prop="educational_str" label="学历" align="center" :formatter="normalFormatter" />
            <el-table-column prop="profession" label="行业" align="center" :formatter="normalFormatter" />
            <el-table-column label="操作" align="center" width="200">
                <template #default="{ row }">
                    <el-button type="primary" link> 详情</el-button>
                    <el-button type="primary" link> 编辑</el-button>
                    <el-button type="primary" link> 分配业务员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="relative float-right" v-model:current-page="paginationParams.page"
            v-model:page-size="paginationParams.page_size" :page-sizes="[10, 30, 50, 100]" background :total="total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="(val) => (paginationParams.page_size = val)"
            @current-change="(val) => (paginationParams.page = val)" @change="getList" />
        <el-dialog v-model="dialogVisible" title="个人信息" width="60%" :before-close="() => (dialogVisible = false)">

        </el-dialog>
    </div>
</template>

<script setup lang="ts">
const total = ref(0);
const paginationParams = reactive({
    page: 1,
    page_size: 10
});
const dialogVisible = ref(false);
const userList = ref<any[]>([]);
const normalFormatter = (_row: any, _column: any, cellValue: any) => {
    return cellValue ?? '-';
};
const getList = () => {

};
const onHandleCreate = () => {

}
getList();
</script>

<style scoped lang="scss">
:deep(.el-button) {
    height: 30px;
    font-size: 12px;
}

:deep(.el-select) {
    width: 100px !important;
}

:deep(.el-input) {
    .el-input__wrapper {
        box-shadow: none;
        background-color: rgba(247, 248, 250, 1);
        color: rgba(136, 136, 136, 1);
        font-size: 12px;
    }
}

:deep(.el-date-editor) {
    background-color: rgba(247, 248, 250, 1);
    color: rgba(136, 136, 136, 1);
    width: 220px;
    height: 30px;
    box-shadow: none;
}

:deep(.el-form-item__label) {
    font-weight: 600;
}

:deep(.table-header) {
    .cell {
        font-weight: bolder !important;
        white-space: nowrap !important;
    }
}

:deep(.el-select) {
    width: 220px !important;

    .el-select__wrapper {
        box-shadow: none;
        background-color: rgba(247, 248, 250, 1);
        color: rgba(136, 136, 136, 1);
        font-size: 12px;
    }
}
</style>
