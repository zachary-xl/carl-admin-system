<template>
    <div class="salesman-detail-container">
        <!-- 顶部导航栏 -->
        <div class="header-nav flex items-center p-4 bg-gradient-to-r">
            <div class="text-center flex-1 text-lg font-medium">场区卫星云图栏舍信息</div>
        </div>

        <!-- 基础信息区域 -->
        <div class="info-section mt-4 mx-4 bg-white rounded-md">
            <div class="section-title p-3 text-blue-500 font-medium border-b border-gray-100">
                基础信息
            </div>
            <div class="info-content p-4">
                <div class="info-item flex justify-between py-2">
                    <span class="label">养殖户名称</span>
                    <span class="value">{{ farmerInfo.name || '' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">负责人</span>
                    <span class="value">{{ farmerInfo.contactPeople || '-' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">手机号</span>
                    <span class="value">{{ farmerInfo.contactPhone || '-' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">栋舍数</span>
                    <span class="value">{{ farmerInfo.dwellingHouseNum || 0 }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">业务员</span>
                    <span class="value">{{ farmerInfo.employeeName || '-' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">区域协赔员</span>
                    <span class="value">{{ farmerInfo.assistantUserName || '-' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">手机号</span>
                    <span class="value">{{ farmerInfo.assistantUserPhone || '-' }}</span>
                </div>
                <div class="info-item flex justify-between py-2">
                    <span class="label">定位经纬度</span>
                    <span class="value">{{ `${farmerInfo.latitude},${farmerInfo.longitude}` }}</span>
                </div>
            </div>
        </div>

        <!-- 栏舍投保信息区域 -->
        <div class="info-section mt-4 mx-4 bg-white rounded-md">
            <div class="section-title p-3 text-blue-500 font-medium border-b border-gray-100">
                栏舍投保信息
            </div>

            <!-- 未投保栏舍 -->
            <div v-for="(pen, index) in penList" :key="`uninsured-${index}`"
                class="pen-item p-4 border-b border-gray-100">
                <div class="flex justify-between items-start">
                    <div class="pen-title font-medium">{{ pen.name || '栏舍' }}</div>
                    <el-tag :type="getPenStatusType(pen.status)" size="small" class="rounded-full px-3">
                        {{ getPenStatusText(pen.status) }}
                    </el-tag>
                </div>
                <div class="flex mt-3">
                    <div class="pen-image w-24 h-24 mr-4">
                        <el-image @click="handlePreview(pen.satelliteMapUrl)" :src="pen.satelliteMapUrl" fit="cover"
                            class="w-full h-full rounded-md"></el-image>
                    </div>
                    <div class="pen-info flex-1">
                        <div class="info-row py-1">今日日龄：{{ calculateDaysFromTimestamp(pen.date) || 15 }}</div>
                        <div class="info-row py-1">栏舍存栏数量：{{ pen.num }}</div>
                        <template v-if="pen.status === 0">
                            <div class="info-row py-1">投保方案：</div>
                            <div class="info-row py-1">{{ pen.content }}</div>
                        </template>
                        <template v-else>
                            <div class="info-row py-1">最终投保金额{{ pen.money }}</div>
                            <div class="info-row py-1">投保方案：</div>
                            <div class="info-row py-1">{{ pen.content }}</div>
                            <div class="info-row py-1">投保到期日期：{{ dayjs(pen.dueDate).format('YYYY-MM-DD') }}</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <el-image-viewer v-if="showPreview" :url-list="srcList" @close="showPreview = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { postFarmersDetailAPI, postFarmersHouseListAPI } from '@/api/farmers'
import dayjs from 'dayjs'
import { getFileDownloadAPI } from '@/api'

const route = useRoute()
const id = route.query.id
// 养殖户基本信息
const farmerInfo = ref<any>({})

const penList = ref<any>([])
const showPreview = ref(false)
const srcList = ref<string[]>([])

const handlePreview = (url: string)=>{
    srcList.value = [url]
showPreview.value = true;
}
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Blob 转 Base64 失败'));
        reader.readAsDataURL(blob);
    });
};
// 获取栏舍详情数据
const fetchPenDetails = async () => {
    try {
        // 这里可以调用API获取数据
        const res = await postFarmersDetailAPI(id)
        farmerInfo.value = res.data
        const { data } = await postFarmersHouseListAPI({ livestockFarmId: id, noPage: true })
        console.log(data)
        penList.value = data.list
        penList.value.forEach(async (pen: any) => {
            const file = await getFileDownloadAPI(pen.fileId);
            const url = await blobToBase64(file);
            pen.satelliteMapUrl = url;
        })
        // insuredPens.value = res.insuredPens

        // 模拟数据
        console.log('获取栏舍详情数据')
    } catch (error) {
        console.error('获取栏舍详情失败', error)
    }
}

// 根据状态获取标签类型
const getPenStatusType = (status: string | number) => {
    if (status === '0' || status === 0) return 'warning' // 未到达
    if (status === '1' || status === 1) return 'success' // 已投保
    return 'info' // 默认
}

// 根据状态获取显示文本
const getPenStatusText = (status: string | number) => {
    if (status === '0' || status === 0) return '未到达'
    if (status === '1' || status === 1) return '已投保'
    return status || '未知状态'
}

// 计算从时间戳到现在的天数
const calculateDaysFromTimestamp = (timestamp: number | string) => {
    if (!timestamp) return 0;

    // 将时间戳转换为毫秒（如果是秒级时间戳）
    const timestampMs = String(timestamp).length === 10
        ? Number(timestamp) * 1000
        : Number(timestamp);

    // 使用dayjs计算天数差
    const days = dayjs().diff(dayjs(timestampMs), 'day');

    return days >= 0 ? days : 0;
}

onMounted(() => {
    fetchPenDetails()
})
</script>

<style scoped>
.salesman-detail-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding-bottom: 20px;
}

.info-section {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-item {
    border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
    border-bottom: none;
}

.pen-item:last-child {
    border-bottom: none;
}
</style>