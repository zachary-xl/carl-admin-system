<template>
  <div class="salesman-main px-[16px]">
    <div class="header">
      <h2>家禽动物保健</h2>
      <div class="user-info">
        <span>你好，{{ name }}</span>
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>

    <div class="section-title">数据总览</div>

    <div class="data-overview">
      <div class="data-card">
        <div class="data-label">我推荐的栋舍数</div>
        <div class="data-value">{{ userInfo.num }}</div>
      </div>
      <div class="data-card">
        <div class="data-label">成功投保的栋舍数</div>
        <div class="data-value">{{ userInfo.successNum }}</div>
      </div>
    </div>
    <div class="data-card flex justify-between items-center">
      <div class="data-label !mb-0">本年累计投保金额</div>
      <div class="data-value">￥{{ userInfo.yearMoney }}</div>
    </div>

    <div class="section-title">场户管理</div>

    <div class="filter-section">
      <div class="filter-item mb-2">
        <span class="filter-label w-[100px] flex-shrink-0">保险状态</span>
        <el-select v-model="searchParams.insure_status" placeholder="全部" clearable class="filter-select">
          <el-option label="全部" value=""></el-option>
          <el-option label="未到达" :value="0"></el-option>
          <el-option label="已投保" :value="1"></el-option>
        </el-select>
      </div>
      <div class="filter-item my-2">
        <span class="filter-label w-[100px] flex-shrink-0">选择日期</span>
        <el-date-picker v-model="searchParams.date" type="month" placeholder="选择月份" format="YYYY/MM" value-format="x" clearable
          class="filter-date-picker" />
      </div>
      <div class="filter-item my-2">
        <span class="filter-label w-[100px] flex-shrink-0">养殖户名称</span>
        <el-input v-model="searchParams.name" placeholder="请输入养殖户名称" class="search-input" clearable />
      </div>
      <div class="flex justify-end">
        <el-button type="primary" plain @click="handleSearch">新增</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="farm-list">
      <div @click.stop="handleFarmClick(farm)" v-for="(farm, index) in farmList" :key="index" class="farm-item">
        <div class="farm-info">
          <div class="farm-name">{{ farm.name }}</div>
          <div class="farm-contact">负责人姓名: {{ farm.contactPeople }}</div>
        </div>
        <div class="farm-actions">
          <div class="status-tag" :class="getStatusClass(farm.status)">
            {{ getStatusText(farm.status) }}
          </div>
          <div class="share-btn" @click.stop="shareFarm(farm)">
            <i class="icon-share"></i> 分享邀请投保
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSalesmanMainAPI, getSalesShareLinkAPI } from '@/api/sales'
import { getLivestockFarmListAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { setStorage } from '@/utils/storage'

// 路由实例
const router = useRouter()
const route = useRoute()
const id = route.query.id
const name = route.query.name

const userInfo = ref({})
// 筛选条件
const searchParams = ref({
  insure_status: null,
  date: dayjs().valueOf(),
  name: ''
})

// 养殖场列表数据
const farmList = ref([])
const handleFarmClick = (farm) => {
  console.log('点击养殖场:', farm)
  router.push({
    path: '/salesman-detail',
    query: {
      id: farm.id
    }
  })
}
const handleSearch = () => {
  console.log('搜索条件:', searchParams.value)
  fetchFarmList()
}
// 获取状态对应的样式类
const getStatusClass = (status) => {
  const statusMap = {
    0: 'status-pending',    // 待邀请
    1: 'status-unopened',   // 未打开
    2: 'status-opened',     // 已打开
    3: 'status-visited'     // 已填写
  }
  return statusMap[status] || ''
}

// 获取状态对应的文本
const getStatusText = (status) => {
  const statusMap = {
    0: '待邀请',
    1: '未打开',
    2: '已打开',
    3: '已填写'
  }
  return statusMap[status] || ''
}

// 分享养殖场
const shareFarm = async (farm) => {
  try {
    // 构建分享链接 - 使用 hash 路由模式
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}#/farmers-form?id=${farm.id}`;

    // 如果状态是 0（待邀请），则调用 API 记录分享行为
    if (farm.status === 0) {
      // 调用 API 记录分享，但不等待结果
      getSalesShareLinkAPI(String(farm.id)).then(() => {
        fetchFarmList()
        fetchUserInfo()
      }).catch(err => {
        console.error('记录分享行为失败:', err);
      });
    }

    // 尝试使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          ElMessage({
            message: '链接已复制，可以分享给养殖户了',
            type: 'success'
          });
          fetchFarmList();
        })
        .catch(err => {
          console.error('现代复制API失败，尝试备用方法:', err);
          fallbackCopyTextToClipboard(shareUrl, fetchFarmList);
        });
    } else {
      // 对于不支持 Clipboard API 的浏览器，使用备用方法
      fallbackCopyTextToClipboard(shareUrl, fetchFarmList);
    }

    console.log('分享邀请投保:', farm);
  } catch (error) {
    console.error('分享过程出错:', error);
    ElMessage({
      message: '分享过程出错',
      type: 'error'
    });
  }
}

// 备用复制方法
const fallbackCopyTextToClipboard = (text, callback = null) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 设置样式使元素不可见
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      ElMessage({
        message: '链接已复制，可以分享给养殖户了',
        type: 'success'
      });
      if (callback) callback();
    } else {
      ElMessage({
        message: '链接复制失败，请手动复制',
        type: 'warning'
      });
      // 显示链接供用户手动复制
      showLinkForManualCopy(text);
    }
  } catch (err) {
    console.error('备用复制方法失败:', err);
    ElMessage({
      message: '链接复制失败，请手动复制',
      type: 'error'
    });
    // 显示链接供用户手动复制
    showLinkForManualCopy(text);
  }
}

// 显示链接供用户手动复制
const showLinkForManualCopy = (link) => {
  ElMessageBox.alert(link, '请手动复制以下链接', {
    confirmButtonText: '确定',
    callback: () => {}
  });
}

// 退出登录
const handleLogout = () => {
  console.log('用户退出登录')
  // 清除登录信息
  setStorage('salesmanToken', '')
  // 跳转到登录页
  router.push('/salesman-login')
}

// 搜索养殖户
const searchFarms = () => {
  console.log('搜索养殖户:', searchFarmName.value)
  console.log('选择的日期时间戳:', dateRange.value)
  // 可以在这里调用API获取数据
}

// 生命周期钩子
onMounted(() => {
  // 可以在这里获取初始数据
  fetchFarmList()
  fetchUserInfo()
})

const fetchUserInfo = async () => {
  const { data } = await getSalesmanMainAPI(id)
  userInfo.value = data
}
// 可以添加其他方法，如获取数据的API调用
const fetchFarmList = async () => {
  try {
    const response = await getLivestockFarmListAPI({ noPage: true, employeeId: id });
    farmList.value = response.data.list
  } catch (error) {
    console.error('获取养殖场列表失败:', error)
  }
}
</script>

<style scoped>
.salesman-main {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  position: relative; /* 添加相对定位 */
}

.header h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
  padding: 10px 0;
}

.user-info {
  text-align: right;
  font-size: 14px;
  color: #333;
}

.logout {
  margin-left: 10px;
  color: #409EFF;
  cursor: pointer;
}

.logout:hover {
  text-decoration: underline;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 15px 0 10px;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: #409EFF;
}

.data-overview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.data-card {
  flex: 1;
  background-color: #e6f7ff;
  border-radius: 8px;
  padding: 6px 20px;
  margin: 0 5px;
  text-align: center;
}

.data-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.data-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.farm-list {
  margin-top: 10px;
}

.farm-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.farm-info {
  flex: 1;
}

.farm-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.farm-contact {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.farm-location {
  font-size: 14px;
  color: #666;
}

.farm-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  color: #fff;
}

.status-pending {
  background-color: #409EFF;
}

.status-unopened {
  background-color: #909399;
}

.status-opened {
  background-color: #67C23A;
}

.status-visited {
  background-color: #E6A23C;
}

.share-btn {
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-share {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23409EFF"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>');
  margin-right: 4px;
}

.filter-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.filter-item {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;
}

.filter-item:last-child {
  margin-right: 0;
}

.filter-label {
  font-size: 14px;
  color: #333;
  margin-right: 8px;
  white-space: nowrap;
}

.filter-select {
  flex: 1;
}

.filter-date-picker {
  flex: 1;
}

.search-row {
  display: flex;
}

.search-input {
  width: 100%;
}

.search-btn {
  height: 36px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #66b1ff;
}
</style>