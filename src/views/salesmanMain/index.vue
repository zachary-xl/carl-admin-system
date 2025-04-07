<template>
  <div class="salesman-main">
    <div class="header">
      <h2>家禽动物保健</h2>
      <div class="user-info">
        <span>你好，{{ userName }}</span>
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </div>

    <div class="section-title">数据总览</div>

    <div class="data-overview">
      <div class="data-card">
        <div class="data-label">年推荐成功</div>
        <div class="data-value">{{ yearSuccess }}</div>
      </div>
      <div class="data-card">
        <div class="data-label">月推荐成功</div>
        <div class="data-value">{{ monthSuccess }}</div>
      </div>
    </div>

    <div class="section-title">场户管理</div>

    <div class="farm-list">
      <div
        v-for="(farm, index) in farmList"
        :key="index"
        class="farm-item"
      >
        <div class="farm-info">
          <div class="farm-name">{{ farm.name }}</div>
          <div class="farm-contact">负责人姓名: {{ farm.contactPerson }}</div>
          <div class="farm-location" v-if="farm.location">
            标签: {{ farm.tag }}
            <div>位置: {{ farm.location }}</div>
          </div>
        </div>
        <div class="farm-actions">
          <div class="status-tag" :class="getStatusClass(farm.status)">
            {{ getStatusText(farm.status) }}
          </div>
          <div class="share-btn" @click="shareFarm(farm)">
            <i class="icon-share"></i> 分享渠道
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesmanMain',
  data() {
    return {
      userName: 'xxx', // 用户名，可以从登录信息或vuex中获取
      yearSuccess: 500,
      monthSuccess: 20,
      farmList: [
        {
          name: 'XXX养殖场',
          contactPerson: '13616697844',
          status: 'pending' // 待渠道
        },
        {
          name: 'XXX养殖场',
          contactPerson: '13616697844',
          status: 'unopened' // 未开
        },
        {
          name: 'XXX养殖场',
          contactPerson: '13616697844',
          status: 'opened' // 已开
        },
        {
          name: 'XXX养殖场',
          contactPerson: '13616697844',
          status: 'visited', // 已考察
          tag: '标签5',
          location: '32.29938,34.89932'
        }
      ]
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        pending: 'status-pending',
        unopened: 'status-unopened',
        opened: 'status-opened',
        visited: 'status-visited'
      }
      return statusMap[status] || ''
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待渠道',
        unopened: '未开',
        opened: '已开',
        visited: '已考察'
      }
      return statusMap[status] || ''
    },
    shareFarm(farm) {
      // 分享渠道的逻辑
      console.log('分享渠道:', farm)
    },
    handleLogout() {
      // 退出登录的逻辑
      console.log('用户退出登录')
      // 清除登录信息
      // localStorage.removeItem('token')
      // 跳转到登录页
      this.$router.push('/salesman-login')
    }
  }
}
</script>

<style scoped>
.salesman-main {
  padding: 16px;
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
  position: absolute;
  top: 0;
  right: 0;
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
  padding: 15px;
  margin: 0 5px;
  text-align: center;
}

.data-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
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
</style>