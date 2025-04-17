<template>
  <div class="farm-form-container p-4">
    <h1 class="text-center text-xl font-bold mb-6">养殖场基本信息填写</h1>

    <div class="bg-white rounded-lg p-4 mb-4">
      <div class="form-item mb-4">
        <div class="flex items-center mb-2">
          <span class="text-red-500 mr-1">*</span>
          <span>养殖场名称</span>
        </div>
        <el-input v-model="formData.name" placeholder="请输入养殖场名称"></el-input>
      </div>

      <div class="form-item mb-4">
        <div class="flex items-center mb-2">
          <span class="text-red-500 mr-1">*</span>
          <span>养殖场负责人</span>
        </div>
        <el-input v-model="formData.contactPeople" placeholder="请填写"></el-input>
      </div>

      <div class="form-item mb-4">
        <div class="flex items-center mb-2">
          <span class="text-red-500 mr-1">*</span>
          <span>联系方式</span>
        </div>
        <el-input v-model="formData.contactPhone" placeholder="请填写"></el-input>
      </div>

      <div class="form-item mb-4">
        <div class="flex items-center mb-2">
          <span class="text-red-500 mr-1">*</span>
          <span>场地位置定位</span>
        </div>
        <div class="w-full text-center text-[#409eff] cursor-pointer border rounded p-2 border-[#a0cfff] border-solid"
          @click="handleLocation">
          {{ locationText || '请选取' }}
        </div>
      </div>

      <div class="form-item">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <span class="text-red-500 mr-1">*</span>
            <span>栋舍信息</span>
          </div>
          <el-button type="primary" text @click="addHouse" class="text-blue-500">新增栋舍</el-button>
        </div>

        <div v-for="(house, index) in formData.list" :key="index" class="relative border rounded mb-2">
          <div class="mb-3 mt-4">
            <div class="mb-1">栋舍名称</div>
            <el-input v-model="house.name" placeholder="请输入栋舍名称" />
          </div>
          <div class="mb-3 mt-4">
            <div class="mb-1">栋舍现存栏数</div>
            <el-input-number v-model="house.num" :min="1" placeholder="请输入栋舍现存栏数" />
          </div>

          <div class="mb-2">
            <div class="mb-1">引种日期</div>
            <el-date-picker v-model="house.date" type="date" placeholder="选择日期" class="w-full" value-format="x" />
          </div>

          <el-button type="danger" size="small" class="absolute bottom-0 right-2" @click="removeHouse(index)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <el-button type="primary" class="w-full py-3 text-sm" @click="submitForm">提交设计保险方案</el-button>
  </div>

  <!-- 地图选择对话框 -->
  <el-dialog title="选择位置" v-model="showMapDialog" width="100vw" height="600px" append-to-body destroy-on-close>
    <div class="map-container">
      <div id="map" style="height: 100%; width: 100%;"></div>
    </div>
    <div class="selected-location" v-if="formData.latitude && formData.longitude">
      已选位置: 经度 {{ formData.longitude }}, 纬度 {{ formData.latitude }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showMapDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmLocation">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 全屏加载 -->
  <div v-if="loading" class="loading-overlay">
    <el-loading background="rgba(0, 0, 0, 0.7)" :fullscreen="true" text="加载中..." />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { postFarmersDetailAPI, postFarmersUpdateAPI, postFarmersHouseListAPI, postFarmersHouseShareLinkAPI } from '@/api/farmers'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.query.id
const loading = ref(false)
const mapData = ref({
  latitude: '',
  longitude: ''
})
const formData = reactive({
  id,
  name: '',
  contactPeople: '',
  contactPhone: '',
  latitude: '',
  longitude: '',
  list: [
    {
      num: 1,
      date: ''
    }
  ]
})

const addHouse = () => {
  formData.list.push({ name: '', num: '', date: '' })
}

const removeHouse = (index) => {
  if (formData.list.length <= 1) {
    ElMessage.warning('至少保留一个栋舍信息')
    return
  }
  formData.list.splice(index, 1)
}

// 地图相关
const showMapDialog = ref(false);
let markersArray = [];
let map = null;

// 计算属性：位置文本
const locationText = computed(() => {
  if (formData.latitude && formData.longitude) {
    return `经度: ${formData.longitude},\n 纬度: ${formData.latitude}`;
  }
  return '';
});

const handleLocation = () => {
  showMapDialog.value = true;
  // 等待DOM更新后初始化地图
  setTimeout(() => {
    initMap();
  }, 300);
}

const initMap = () => {
  if (!window.qq || !window.qq.maps) {
    ElMessage.error('地图SDK未加载，请检查网络连接');
    return;
  }
  console.log(mapData.value.latitude, formData.latitude,'---')
  const center = new qq.maps.LatLng(
    mapData.value.latitude || formData.latitude || 29.86032438064803,
    mapData.value.longitude || formData.longitude || 121.62466049194336
  );
  map = new qq.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 16
  });
  // 如果已有位置，添加标记
  if (formData.latitude && formData.longitude) {
    const position = new qq.maps.LatLng(formData.latitude, formData.longitude);
    const marker = new qq.maps.Marker({
      map: map,
      position: position
    });
    markersArray.push(marker);
  }

  // 添加点击事件
  qq.maps.event.addListener(map, "click", function (event) {
    formData.longitude = event.latLng.getLng(); // 经度
    formData.latitude = event.latLng.getLat(); // 纬度

    // 清除之前的标记
    if (markersArray.length > 0) {
      for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }
      markersArray = [];
    }

    // 添加新标记
    const marker = new qq.maps.Marker({
      map: map,
      position: event.latLng
    });
    markersArray.push(marker);
  });
}

const getLocation = () => {
  console.log(navigator.geolocation)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        const latitude = position.coords.latitude; // 纬度
        const longitude = position.coords.longitude; // 经度
        mapData.value.latitude = latitude;
        mapData.value.longitude = longitude;
      },
      (error) => {
        console.error('获取位置失败:', error);
      }
    );
  } else {
    console.log('浏览器不支持 Geolocation API');
  }
}
const confirmLocation = () => {
  if (!formData.latitude || !formData.longitude) {
    ElMessage.warning('请先在地图上选择位置');
    return;
  }
  showMapDialog.value = false;
}

const submitForm = () => {
  // 表单验证
  if (!formData.name) {
    ElMessage.error('请输入养殖场名称')
    return
  }
  if (!formData.contactPeople) {
    ElMessage.error('请输入养殖场负责人')
    return
  }
  if (!formData.contactPhone) {
    ElMessage.error('请输入联系方式')
    return
  }
  if (!formData.latitude || !formData.longitude) {
    ElMessage.error('请选择场地位置')
    return
  }

  const invalidHouse = formData.list.some(house => !house.num || !house.date)
  if (invalidHouse) {
    ElMessage.error('请完善栋舍信息')
    return
  }

  // 显示全屏加载
  loading.value = true

  postFarmersUpdateAPI(formData).then(res => {
    ElMessage.success('提交成功')
    // 提交成功后跳转到养殖场列表页
    router.push(`/farmers-detail?id=${id}`)
  }).catch(err => {
    ElMessage.error('提交失败')
  }).finally(() => {
    loading.value = false
  })
}
onMounted(async () => {
  loading.value = true

  const { data: detailData } = await postFarmersDetailAPI(id)
  if (detailData.status !== 3) {
    if (detailData.status <= 1) {
      postFarmersHouseShareLinkAPI({ id })
    }
    formData.name = detailData.name
    formData.id = detailData.id
    formData.contactPeople = detailData.contactPeople
    formData.contactPhone = detailData.contactPhone
    if (detailData.latitude && detailData.longitude) {
      formData.latitude = detailData.latitude
      formData.longitude = detailData.longitude
    }
  } else {
    router.push(`/farmers-detail?id=${id}`)
  }
  loading.value = false
})
getLocation()
</script>

<style scoped>
.farm-form-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.map-container {
  width: 100%;
  height: 500px;
}

.selected-location {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f9eb;
  border-radius: 4px;
  color: #67c23a;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
