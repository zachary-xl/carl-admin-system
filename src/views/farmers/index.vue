<template>
    <div class="app-container">
        <el-form :inline="true" :model="queryParams">
            <el-form-item label="养殖户名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入养殖户名称" clearable />
            </el-form-item>
            <el-form-item label="负责人" prop="contactPeople">
                <el-input v-model="queryParams.contactPeople" placeholder="请输入负责人" clearable />
            </el-form-item>
            <el-form-item label="业务员" prop="employeeId">
                <el-select v-model="queryParams.employeeId" placeholder="请选择业务员" clearable filterable>
                    <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="分享状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                    <el-option label="待邀请" :value="0" />
                    <el-option label="未打开" :value="1" />
                    <el-option label="已打开" :value="2" />
                    <el-option label="已填写" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="保险状态" prop="insure_status">
                <el-select v-model="queryParams.insure_status" placeholder="请选择保险状态" clearable>
                    <el-option label="计划投保" :value="0" />
                    <el-option label="投保到期" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="选择日期" prop="date">
                <el-date-picker v-model="queryParams.date" type="month" placeholder="选择月份" format="YYYY/MM"
                    value-format="x" clearable />
            </el-form-item>
            <el-form-item>
                <el-button text bg icon="refreshLeft" @click="resetQuery">重置</el-button>
                <el-button type="primary" bg icon="Search" @click="handleQuery">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-divider class="!mt-2 !mb-4" />
        <el-row :gutter="10" class="mb-4">
            <el-col :span="1.5">
                <el-button type="primary" icon="plus" plain @click="onHandleCreate">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" icon="user" plain @click="handleBatchAssign"
                    :disabled="selectedRows.length === 0">批量分配业务员</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" class="w-full" header-cell-class-name="table-header"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="养殖户名称" align="center" :formatter="normalFormatter" />
            <el-table-column prop="contactPeople" label="负责人" align="center" :formatter="normalFormatter" />
            <el-table-column prop="contactPhone" label="手机号" align="center" :formatter="normalFormatter" />
            <el-table-column prop="dwellingHouseNum" label="栋舍现存栏数" align="center" :formatter="normalFormatter" />
            <el-table-column label="经纬度" align="center">
                <template #default="{ row }">
                    {{ row.longitude && row.latitude ? `${row.longitude}, ${row.latitude}` : '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="employeeName" label="业务员" align="center" :formatter="normalFormatter" />
            <el-table-column label="状态" align="center">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template #default="{ row }">
                    <el-button type="primary" link @click="handleDetail(row)"> 详情</el-button>
                    <el-button type="primary" link @click="handleEdit(row)"> 编辑</el-button>
                    <el-button type="primary" link @click="handleDelete(row)"> 删除</el-button>
                    <el-button type="primary" link @click="handleAssign(row)"> 分配业务员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="relative float-right" v-model:current-page="paginationParams.page"
            v-model:page-size="paginationParams.page_size" :page-sizes="[10, 30, 50, 100]" background :total="total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="(val) => (paginationParams.page_size = val)"
            @current-change="(val) => (paginationParams.page = val)" @change="getList" />
        <el-dialog v-model="assignDialogVisible" title="分配业务员" width="30%"
            :before-close="() => (assignDialogVisible = false)">
            <el-form :model="assignForm" label-width="100px">
                <el-form-item label="业务员">
                    <el-select v-model="assignForm.employeeId" placeholder="请选择业务员" filterable style="width: 100%">
                        <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="assignDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAssign" :loading="submitLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <FormComp v-model="dialogVisible" v-if="dialogVisible" :config="config" :visible="dialogVisible"
            @update:visible="(bool) => (dialogVisible = bool)" @confirm="dialogVisible = false,getList()" />
    </div>
</template>

<script setup lang="ts">
import { getLivestockFarmListAPI, getEmployeeListAPI, putLivestockFarmUpdateEmployeeAPI, postLivestockFarmDeleteAPI } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import FormComp from './components/FormComp.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const total = ref(0);
const config = reactive({
    title: '新增养殖户',
    id: undefined
});
const paginationParams = reactive({
    page: 1,
    page_size: 10
});
const queryParams = reactive({
    name: '',
    contactPeople: '',
    employeeId: undefined,
    status: undefined,
    insure_status: undefined,
    date: ""
});
const dialogVisible = ref(false);
const tableData = ref<any[]>([]);

const assignDialogVisible = ref(false);
const currentRow = ref<any>(null);
const submitLoading = ref(false);
const assignForm = reactive({
    employeeId: undefined
});

const employeeOptions = ref<any[]>([]);

const selectedRows = ref<any[]>([]);

const normalFormatter = (_row: any, _column: any, cellValue: any) => {
    return cellValue ?? '-';
};

const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
        0: '待邀请',
        1: '未打开',
        2: '已打开',
        3: '已填写'
    };
    return statusMap[status] || '-';
};

const getStatusType = (status: number): any => {
    const typeMap: Record<number, string> = {
        0: 'info',
        1: 'warning',
        2: 'success',
        3: 'primary'
    };
    return typeMap[status] || '';
};

const getList = () => {
    const params = {
        ...paginationParams,
        name: queryParams.name,
        contactPeople: queryParams.contactPeople,
        employeeId: queryParams.employeeId,
        status: queryParams.status,
        insure_status: queryParams.insure_status,
        date: queryParams.date
    };
    getLivestockFarmListAPI(params).then((res) => {
        tableData.value = res.data.list;
        total.value = res.data.total;
    });
};

const handleQuery = () => {
    paginationParams.page = 1;
    getList();
};

const resetQuery = () => {
    queryParams.name = '';
    queryParams.contactPeople = '';
    queryParams.employeeId = undefined;
    queryParams.status = undefined;
    queryParams.insure_status = undefined;
    queryParams.date = "";
    handleQuery();
};

const onHandleCreate = () => {
    config.title = '新增养殖户';
    config.id = undefined;
    dialogVisible.value = true;
    // 这里可以添加创建逻辑
};

const handleDetail = (row: any) => {
    router.push({
        path: '/farmers/detail',
        query: {
            id: row.id
        }
    });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `确认删除选中的数据吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        postLivestockFarmDeleteAPI(row.id).then(() => {
            ElMessage.success('删除成功');
            getList();
        });
    })
};

const handleEdit = (row: any) => {
    config.title = '编辑养殖户';
    config.id = row.id;
    dialogVisible.value = true;
    // 实现编辑逻辑
};

const handleAssign = (row: any) => {
    currentRow.value = row;
    assignForm.employeeId = row.employeeId;
    assignDialogVisible.value = true;
};

const handleBatchAssign = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请至少选择一条记录');
        return;
    }
    currentRow.value = null; // 批量操作时不需要当前行
    assignForm.employeeId = undefined;
    assignDialogVisible.value = true;
};

const submitAssign = () => {
    if (!assignForm.employeeId) {
        ElMessage.warning('请选择业务员');
        return;
    }

    submitLoading.value = true;

    // 获取要更新的ID列表
    const idList = currentRow.value
        ? [currentRow.value.id]
        : selectedRows.value.map(row => row.id);

    putLivestockFarmUpdateEmployeeAPI({
        idList: idList,
        employeeId: assignForm.employeeId
    }).then(() => {
        ElMessage.success('分配业务员成功');
        assignDialogVisible.value = false;
        getList(); // 刷新列表
    }).catch(() => {
        ElMessage.error('分配业务员失败');
    }).finally(() => {
        submitLoading.value = false;
    });
};

const handleSelectionChange = (selection: any[]) => {
    selectedRows.value = selection;
};

// 初始化时获取业务员列表
const initEmployeeOptions = () => {
    getEmployeeListAPI({ noPage: true }).then(res => {
        employeeOptions.value = res.data.list.map(i => ({
            ...i,
            label: i.name,
            value: i.id
        }));
    })
};

// 初始加载数据
getList();
initEmployeeOptions();
</script>
