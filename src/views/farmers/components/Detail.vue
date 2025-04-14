<template>
    <div class="farmer-detail px-[20px] pb-[20px]">
        <!-- 基础信息区域 -->
        <div class="flex items-center justify-end mt-4">
            <el-button type="primary" plain icon="ArrowLeft" @click="goBack">返回上一级</el-button>
        </div>
        <div class="info-section">
            <div class="section-header">
                <el-divider content-position="left">
                    <span class="section-title">基础信息</span>
                </el-divider>
            </div>
            <el-descriptions :column="2" border>
                <el-descriptions-item label="养殖户名称">{{ farmerInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="负责人">{{ farmerInfo.contactPeople }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{ farmerInfo.contactPhone }}</el-descriptions-item>
                <el-descriptions-item label="栋舍数">{{ farmerInfo.dwellingHouseNum }}</el-descriptions-item>
                <el-descriptions-item label="业务员">{{ farmerInfo.employeeName }}</el-descriptions-item>
                <el-descriptions-item label="区域协赔员">{{ farmerInfo.assistantUserName }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ farmerInfo.assistantUserPhone }}</el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- 栋舍投保信息区域 -->
        <div class="insurance-section">
            <div class="section-header">
                <el-divider content-position="left">
                    <span class="section-title">栋舍投保信息</span>
                </el-divider>
                <el-button type="primary" class="add-btn" @click="handleAddInsurance">新增</el-button>
            </div>

            <el-table :data="insuranceData" class="w-full" header-cell-class-name="table-header">
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column label="卫星云图" align="center">
                    <template #default="scope">
                        <img v-if="scope.row.satelliteMapUrl" :src="scope.row.satelliteMapUrl" class="w-[100px]" />
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="今日日龄" align="center">
                    <template #default="scope">
                        <el-tag type="success">{{ calculateDays(scope.row.date) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="栋舍存栏数量" align="center" />
                <el-table-column prop="content" label="投保方案" align="center" />
                <el-table-column prop="planDate" label="计划投保时间" align="center">
                    <template #default="scope">
                        <el-tag type="success">{{ dayjs(scope.row.planDate).format('YYYY-MM-DD') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="dueDate" label="投保到期日期" align="center">
                    <template #default="scope">
                        <el-tag type="success">{{ dayjs(scope.row.dueDate).format('YYYY-MM-DD') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="最终投保金额" align="center" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            {{ getStatusText(scope.row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template #default="scope">
                        <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="map-container">
            <div style="width: 100%; height: 100%;" id="map" ref="mapRef"></div>
        </div>
        <DetailFormComp ref="detailFormRef" :config="detailConfig" v-if="detailFormVisible" :visible="detailFormVisible"
            @submit="handleSubmit" @close="detailFormVisible = false" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    getLivestockFarmDetailAPI,
    getLivestockFarmDwellingHouseListAPI,
    getFileDownloadAPI,
    postLivestockFarmDwellingHouseDeleteAPI
} from '@/api';
import DetailFormComp from './DetailFormComp.vue';
import dayjs from 'dayjs';
import { ElMessageBox, ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const id = +route.query.id;
const farmerInfo = ref({});
const mapRef = ref(null);

const initMap = () => {
    var center = new qq.maps.LatLng(farmerInfo.value.latitude || 22.3193292, farmerInfo.value.longitude || 114.1694229);
    var map = new qq.maps.Map(mapRef.value, {
        center: center,
        zoom: 18
    });
    new qq.maps.Marker({
        map: map,
        position: center
    });
}
// 栋舍投保信息
const insuranceData = ref([]);
const detailFormVisible = ref(false);
const detailConfig = ref({
    title: '',
    id: null,
    livestockFarmId: id
});
const detailFormRef = ref();
const handleSubmit = () => {
    detailFormVisible.value = false;
    getLivestockFarmDetail();
    getLivestockFarmDwellingHouseList();
};
// 获取状态标签类型
const getStatusType = (status) => {
    // 将状态转换为数字以确保比较正确
    const statusNum = Number(status);
    switch (statusNum) {
        case 1:  // 已投保
            return 'success';
        case 0:  // 未到达
            return 'warning';
        default:
            return 'info';
    }
};

// 获取状态显示文本
const getStatusText = (status) => {
    // 将状态转换为数字以确保比较正确
    const statusNum = Number(status);
    switch (statusNum) {
        case 1:
            return '已投保';
        case 0:
            return '未到达';
        default:
            return '未知状态';
    }
};

// 处理新增投保信息
const handleAddInsurance = () => {
    detailConfig.value = {
        title: '新增投保信息',
        id: null,
        livestockFarmId: id
    };
    detailFormVisible.value = true;
};

// 处理编辑
const handleEdit = (row) => {
    detailConfig.value = {
        title: '编辑投保信息',
        id: row.id,
        livestockFarmId: id
    };
    detailFormVisible.value = true;
};

// 处理删除
const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确定要删除栋舍 "${row.name}" 的投保信息吗？`,
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            // 调用删除API
            postLivestockFarmDwellingHouseDeleteAPI(row.id)
                .then(() => {
                    ElMessage({
                        type: 'success',
                        message: '删除成功',
                    });
                    // 重新加载列表数据
                    getLivestockFarmDwellingHouseList();
                })
                .catch((error) => {
                    console.error('删除失败:', error);
                    ElMessage({
                        type: 'error',
                        message: '删除失败，请稍后重试',
                    });
                });
        })
        .catch(() => {
            // 用户取消删除
            ElMessage({
                type: 'info',
                message: '已取消删除',
            });
        });
};
const getLivestockFarmDetail = () => {
    getLivestockFarmDetailAPI(id).then(({ data }) => {
        farmerInfo.value = data;
        if (data.longitude && data.latitude) {
            initMap();
        }
    });
}
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Blob 转 Base64 失败'));
        reader.readAsDataURL(blob);
    });
};
const getLivestockFarmDwellingHouseList = () => {
    getLivestockFarmDwellingHouseListAPI({
        livestockFarmId: id
    }).then((res) => {
        insuranceData.value = res.data.list;
        insuranceData.value.map(async (item) => {
            if (item.fileId) {
                const file = await getFileDownloadAPI(item.fileId);
                const url = await blobToBase64(file);
                item.satelliteMapUrl = url;
            }
        });
    });
}

// 计算日龄（从给定日期到今天的天数）
const calculateDays = (dateString) => {
    if (!dateString) return 0;

    const today = dayjs();
    const startDate = dayjs(dateString);

    // 使用dayjs计算日期差
    return today.diff(startDate, 'day');
};

// 返回上一级
const goBack = () => {
    router.push('/farmers');
};

onMounted(() => {
    getLivestockFarmDetail();
    getLivestockFarmDwellingHouseList();
});
</script>

<style scoped>
.farmer-detail {
    margin: 20px;
    background-color: #fff;
}

.info-section,
.insurance-section {
    margin-bottom: 30px;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
    color: #409EFF;
}

.add-btn {
    position: absolute;
    right: 0;
    top: -5px;
}

.map-container {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
}

.location-map {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>