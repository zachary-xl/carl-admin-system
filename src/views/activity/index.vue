<template>
  <div class="activity-container">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>图片上传</span>
        </div>
      </template>

      <div class="upload-container">
        <input type="file" ref="fileInput" accept="image/*" class="file-input" @change="handleFileChange" />
        <el-button type="primary" @click="triggerFileInput">选择图片</el-button>

        <div class="preview-container" v-if="imageUrl">
          <img :src="imageUrl" class="preview-image" alt="预览图片" />
        </div>
      </div>

      <div class="canvas-container" v-if="imageUrl">
        <h3>Canvas 预览</h3>
        <div class="canvas-wrapper">
          <canvas ref="canvasRef" width="500" height="500" @click="handleCanvasClick"></canvas>

          <div v-for="(marker, index) in markers" :key="index" class="marker-box" :style="{
              left: `${marker.x}px`,
              top: `${marker.y}px`,
              display: marker.isEditing ? 'none' : 'block'
            }" @click.stop="editMarker(index)">
            <div class="marker-content">
              <div v-if="marker.title" class="marker-title">{{ marker.title }}</div>
              <div v-if="marker.description" class="marker-description">{{ marker.description }}</div>
              <div v-if="marker.remarks" class="marker-remarks">{{ marker.remarks }}</div>
            </div>
          </div>

          <div class="text-input-panel" v-if="activeMarkerIndex !== null" :style="textPanelStyle">
            <div class="panel-header">
              <span>文本框</span>
              <div>
                <el-button type="text" @click="deleteMarker">
                  <el-icon>
                    <delete />
                  </el-icon>
                </el-button>
                <el-button type="text" @click="closeTextPanel">
                  <el-icon>
                    <close />
                  </el-icon>
                </el-button>
              </div>
            </div>
            <div class="panel-body">
              <el-form label-position="top">
                <el-form-item label="今日巡视">
                  <el-input v-model="currentMarker.title" placeholder="输入标题"></el-input>
                </el-form-item>
                <el-form-item label="产品描述">
                  <el-input v-model="currentMarker.description" placeholder="输入描述"></el-input>
                </el-form-item>
                <el-form-item label="通用入口">
                  <el-input v-model="currentMarker.remarks" placeholder="输入备注"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" size="small" @click="applyText">应用文本</el-button>
            </div>
          </div>
        </div>

        <div class="controls-container mt-3">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-slider v-model="scale" :min="0.1" :max="2" :step="0.1" @change="drawImageOnCanvas" />
              <div class="slider-label">缩放比例: {{ scale.toFixed(1) }}</div>
            </el-col>
            <el-col :span="12">
              <el-button-group>
                <el-button type="primary" @click="resetCanvas">重置</el-button>
                <el-button type="success" @click="saveCanvas">保存图片</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Delete } from '@element-plus/icons-vue'

interface Marker {
  x: number
  y: number
  title: string
  description: string
  remarks: string
  isEditing: boolean
}

const imageUrl = ref('')
const image = ref<HTMLImageElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const scale = ref(1.0)
const markers = ref<Marker[]>([])
const activeMarkerIndex = ref<number | null>(null)

const currentMarker = reactive({
  title: '',
  description: '',
  remarks: ''
})

const textPanelStyle = computed(() => {
  if (activeMarkerIndex.value === null) return {}

  const marker = markers.value[activeMarkerIndex.value]
  return {
    left: `${marker.x}px`,
    top: `${marker.y}px`,
  }
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!')
    return
  }

  // 创建本地临时URL
  imageUrl.value = URL.createObjectURL(file)

  // 重置标记和面板
  markers.value = []
  activeMarkerIndex.value = null

  // 重置file input，以便可以选择同一文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }

  // 加载图片到image对象中
  loadImage(imageUrl.value)
}

const loadImage = (url: string) => {
  const img = new Image()
  img.onload = () => {
    image.value = img
    drawImageOnCanvas()
  }
  img.onerror = () => {
    ElMessage.error('图片加载失败')
  }
  img.src = url
}

const drawImageOnCanvas = () => {
  if (!canvasRef.value || !image.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 计算等比例缩放后的尺寸
  const canvasRatio = canvas.width / canvas.height
  const imageRatio = image.value.width / image.value.height

  let drawWidth, drawHeight, x, y

  if (imageRatio > canvasRatio) {
    // 图片更宽，以宽度为基准
    drawWidth = canvas.width * scale.value
    drawHeight = (drawWidth / image.value.width) * image.value.height
    x = 0
    y = (canvas.height - drawHeight) / 2
  } else {
    // 图片更高，以高度为基准
    drawHeight = canvas.height * scale.value
    drawWidth = (drawHeight / image.value.height) * image.value.width
    x = (canvas.width - drawWidth) / 2
    y = 0
  }

  // 绘制图片
  ctx.drawImage(image.value, x, y, drawWidth, drawHeight)
}

const resetCanvas = () => {
  scale.value = 1.0
  markers.value = []
  activeMarkerIndex.value = null
  drawImageOnCanvas()
}

const saveCanvas = () => {
  if (!canvasRef.value) return

  // 临时隐藏所有标记
  const tempMarkers = [...markers.value]
  markers.value = []

  // 重新绘制canvas以便保存
  drawImageOnCanvas()

  // 在Canvas上绘制所有标记
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      tempMarkers.forEach(marker => {
        drawMarkerOnCanvas(ctx, marker)
      })
    }
  }

  try {
    // 将canvas转为图片并下载
    const link = document.createElement('a')
    link.download = `canvas-image-${new Date().getTime()}.png`
    link.href = canvasRef.value.toDataURL('image/png')
    link.click()
    ElMessage.success('图片保存成功')
  } catch (e) {
    ElMessage.error('图片保存失败')
    console.error(e)
  }

  // 恢复标记
  markers.value = tempMarkers
}

const drawMarkerOnCanvas = (ctx: CanvasRenderingContext2D, marker: Marker) => {
  // 绘制蓝色背景框
  ctx.fillStyle = 'rgba(24, 144, 255, 0.8)'

  // 计算需要的高度
  let height = 0
  if (marker.title) height += 22
  if (marker.description) height += 22
  if (marker.remarks) height += 22
  height = Math.max(height, 30) // 最小高度

  // 计算需要的宽度
  let width = 200 // 默认宽度

  // 绘制圆角矩形
  roundRect(ctx, marker.x, marker.y, width, height, 4)

  // 绘制文本
  ctx.fillStyle = 'white'
  let textY = marker.y + 16

  if (marker.title) {
    ctx.font = 'bold 12px Arial'
    ctx.fillText(marker.title, marker.x + 10, textY)
    textY += 22
  }

  if (marker.description) {
    ctx.font = '12px Arial'
    ctx.fillText(marker.description, marker.x + 10, textY)
    textY += 22
  }

  if (marker.remarks) {
    ctx.font = '12px Arial'
    ctx.fillText(marker.remarks, marker.x + 10, textY)
  }
}

// 绘制圆角矩形的辅助函数
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

const handleCanvasClick = (event: MouseEvent) => {
  if (!canvasRef.value || activeMarkerIndex.value !== null) return

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 创建新标记
  markers.value.push({
    x: x,
    y: y,
    title: '',
    description: '',
    remarks: '',
    isEditing: true
  })

  // 设置当前活动标记
  activeMarkerIndex.value = markers.value.length - 1

  // 重置当前标记内容
  currentMarker.title = ''
  currentMarker.description = ''
  currentMarker.remarks = ''
}

const editMarker = (index: number) => {
  activeMarkerIndex.value = index
  const marker = markers.value[index]

  // 复制标记内容到当前编辑对象
  currentMarker.title = marker.title
  currentMarker.description = marker.description
  currentMarker.remarks = marker.remarks

  // 设置标记为编辑状态
  marker.isEditing = true
}

const closeTextPanel = () => {
  if (activeMarkerIndex.value !== null) {
    const marker = markers.value[activeMarkerIndex.value]

    // 如果是新创建的空标记并且没有填写内容，则删除
    if (!marker.title && !marker.description && !marker.remarks) {
      markers.value.splice(activeMarkerIndex.value, 1)
    } else {
      marker.isEditing = false
    }
  }

  activeMarkerIndex.value = null
}

const applyText = () => {
  if (activeMarkerIndex.value !== null) {
    const marker = markers.value[activeMarkerIndex.value]

    // 更新标记内容
    marker.title = currentMarker.title
    marker.description = currentMarker.description
    marker.remarks = currentMarker.remarks
    marker.isEditing = false

    ElMessage.success('文本已应用')
  }

  activeMarkerIndex.value = null
}

const deleteMarker = () => {
  if (activeMarkerIndex.value !== null) {
    markers.value.splice(activeMarkerIndex.value, 1)
    activeMarkerIndex.value = null
    ElMessage.success('标记已删除')
  }
}

// 监听图片URL变化
watch(imageUrl, (newUrl) => {
  if (newUrl) {
    loadImage(newUrl)
  }
})

// 监听组件挂载
onMounted(() => {
  // 确保canvas元素已创建
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // 绘制初始的空白画布背景
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 添加提示文本
      ctx.fillStyle = '#999'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('上传图片后将显示在此处', canvas.width / 2, canvas.height / 2)
    }
  }
})
</script>

<style scoped>
.activity-container {
  padding: 20px;
}

.upload-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-container {
  text-align: center;
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.preview-container {
  margin-top: 15px;
}

.preview-image {
  max-width: 300px;
  max-height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.canvas-container {
  margin-top: 20px;
  text-align: center;
}

.canvas-wrapper {
  position: relative;
  display: inline-block;
  margin: 0 auto;
}

.canvas-container canvas {
  border: 1px solid #ebeef5;
  margin: 10px auto;
  display: block;
  background-color: #fff;
}

.marker-box {
  position: absolute;
  background-color: rgba(24, 144, 255, 0.8);
  border-radius: 4px;
  padding: 10px;
  min-width: 200px;
  max-width: 250px;
  cursor: pointer;
  color: white;
  z-index: 8;
}

.marker-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.marker-title {
  font-weight: bold;
  font-size: 13px;
}

.marker-description {
  font-size: 12px;
}

.marker-remarks {
  font-size: 12px;
}

.text-input-panel {
  position: absolute;
  width: 250px;
  background: #e6f1fc;
  border: 1px solid #a3d0fd;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #d1e9ff;
  color: #409eff;
  font-weight: bold;
  border-bottom: 1px solid #a3d0fd;
}

.panel-body {
  padding: 10px;
}

.controls-container {
  margin: 20px auto;
  max-width: 500px;
}

.slider-label {
  text-align: center;
  margin-top: 5px;
  color: #606266;
}

.mt-3 {
  margin-top: 15px;
}
</style>