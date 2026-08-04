<template>
  <view class="page-shell create-page">
    <view class="upload-zone soft-card" @click="chooseImage">
      <image v-if="sourceImage" class="preview-image" :src="sourceImage" mode="aspectFill" />
      <view v-else class="upload-empty">
        <text class="upload-title">选择一张照片</text>
        <text class="upload-text">头像、宠物、表情包、动漫截图都可以。</text>
      </view>
    </view>

    <view class="section-title">
      <text>图纸设置</text>
    </view>

    <view class="setting-panel soft-card">
      <view class="setting-group">
        <text class="setting-label">板子尺寸</text>
        <view class="chip-grid">
          <button
            v-for="size in SIZE_PRESETS"
            :key="size.label"
            class="chip"
            :class="{ active: selectedSize.label === size.label }"
            @click="selectedSize = size"
          >
            {{ size.label }}
          </button>
        </view>
      </view>

      <view class="setting-group">
        <text class="setting-label">颜色上限</text>
        <view class="chip-row">
          <button
            v-for="limit in COLOR_LIMITS"
            :key="limit"
            class="chip small"
            :class="{ active: colorLimit === limit }"
            @click="colorLimit = limit"
          >
            {{ limit }} 色
          </button>
        </view>
      </view>

      <view class="setting-group">
        <text class="setting-label">色板</text>
        <view class="palette-list">
          <button
            v-for="palette in PALETTES"
            :key="palette.id"
            class="palette-option"
            :class="{ active: paletteId === palette.id }"
            @click="paletteId = palette.id"
          >
            <view class="palette-dots">
              <text
                v-for="color in palette.colors.slice(0, 8)"
                :key="color.id"
                class="palette-dot"
                :style="{ backgroundColor: color.hex }"
              />
            </view>
            <view>
              <text class="palette-name">{{ palette.name }}</text>
              <text class="palette-desc">{{ palette.description }}</text>
            </view>
          </button>
        </view>
      </view>
    </view>

    <view class="tips soft-card">
      <text class="tips-title">成图建议</text>
      <text class="tips-text">小尺寸适合轮廓清楚的照片。颜色越少越省豆，颜色越多越像原图。</text>
    </view>

    <button class="primary-button" :disabled="isGenerating" @click="generatePattern">
      {{ isGenerating ? '正在生成...' : '生成拼豆图纸' }}
    </button>
    <button class="secondary-button blank-button" @click="createBlank">创建空白画板</button>

    <canvas canvas-id="sourceCanvas" id="sourceCanvas" class="hidden-canvas" :style="canvasStyle" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { COLOR_LIMITS, SIZE_PRESETS, buildPatternFromImageData, createBlankPattern, createProject } from '@/utils/beadPattern.js'
import { saveProject } from '@/utils/projects.js'
import { PALETTES } from '@/data/palettes.js'
import { toast } from '@/utils/share.js'

const sourceImage = ref('')
const imageInfo = ref(null)
const selectedSize = ref(SIZE_PRESETS[1])
const colorLimit = ref(16)
const paletteId = ref(PALETTES[0].id)
const isGenerating = ref(false)

const canvasStyle = computed(() => {
  return `position:absolute;left:-9999px;top:-9999px;width:${selectedSize.value.width}px;height:${selectedSize.value.height}px;`
})

function chooseImage() {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    sizeType: ['compressed'],
    success: (result) => {
      const file = result.tempFiles && result.tempFiles[0]
      sourceImage.value = file?.tempFilePath || ''
      if (sourceImage.value) {
        uni.getImageInfo({
          src: sourceImage.value,
          success: (info) => {
            imageInfo.value = info
          },
          fail: () => toast('读取图片失败')
        })
      }
    }
  })
}

async function generatePattern() {
  if (!sourceImage.value || !imageInfo.value) {
    toast('请先选择图片')
    return
  }

  isGenerating.value = true
  uni.showLoading({ title: '生成中' })
  try {
    const imageData = await getResizedImageData()
    const pattern = buildPatternFromImageData(imageData, {
      paletteId: paletteId.value,
      colorLimit: colorLimit.value
    })
    const project = saveProject(createProject(pattern, {
      title: `${selectedSize.value.label} 图纸`,
      sourceImage: sourceImage.value
    }))
    uni.hideLoading()
    uni.navigateTo({ url: `/pages/editor/index?id=${project.id}` })
  } catch (error) {
    console.error(error)
    uni.hideLoading()
    toast('生成失败，请换张图片')
  } finally {
    isGenerating.value = false
  }
}

function createBlank() {
  const project = saveProject(createProject(createBlankPattern(selectedSize.value.width, selectedSize.value.height, paletteId.value), {
    title: `空白 ${selectedSize.value.width}x${selectedSize.value.height} 图纸`
  }))
  uni.navigateTo({ url: `/pages/editor/index?id=${project.id}` })
}

function getResizedImageData() {
  const width = selectedSize.value.width
  const height = selectedSize.value.height
  const info = imageInfo.value
  const targetRatio = width / height
  const imageRatio = info.width / info.height
  let sx = 0
  let sy = 0
  let sw = info.width
  let sh = info.height

  if (imageRatio > targetRatio) {
    sw = Math.round(info.height * targetRatio)
    sx = Math.round((info.width - sw) / 2)
  } else {
    sh = Math.round(info.width / targetRatio)
    sy = Math.round((info.height - sh) / 2)
  }

  return new Promise((resolve, reject) => {
    const context = uni.createCanvasContext('sourceCanvas')
    context.clearRect(0, 0, width, height)
    context.drawImage(sourceImage.value, sx, sy, sw, sh, 0, 0, width, height)
    context.draw(false, () => {
      setTimeout(() => {
        uni.canvasGetImageData({
          canvasId: 'sourceCanvas',
          x: 0,
          y: 0,
          width,
          height,
          success: resolve,
          fail: reject
        })
      }, 120)
    })
  })
}
</script>

<style lang="scss" scoped>
.upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 420rpx;
  overflow: hidden;
  background:
    linear-gradient(45deg, rgba(255, 255, 255, 0.35) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.35) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.35) 75%),
    #e9f0ec;
  background-position: 0 0, 0 18rpx, 18rpx -18rpx, -18rpx 0;
  background-size: 36rpx 36rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.upload-title {
  color: #25302f;
  font-size: 34rpx;
  font-weight: 900;
}

.upload-text {
  color: #71817a;
  font-size: 25rpx;
}

.setting-panel {
  padding: 26rpx;
}

.setting-group + .setting-group {
  margin-top: 30rpx;
}

.setting-label {
  display: block;
  margin-bottom: 16rpx;
  color: #25302f;
  font-size: 27rpx;
  font-weight: 800;
}

.chip-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  height: 70rpx;
  border: 1rpx solid rgba(55, 83, 76, 0.16);
  border-radius: 8rpx;
  color: #445751;
  font-size: 24rpx;
  font-weight: 700;
  background: #ffffff;
}

.chip.small {
  width: 104rpx;
}

.chip.active {
  border-color: rgba(233, 92, 68, 0.7);
  color: #e95c44;
  background: rgba(233, 92, 68, 0.08);
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.palette-option {
  display: grid;
  grid-template-columns: 140rpx 1fr;
  gap: 18rpx;
  align-items: center;
  padding: 18rpx;
  border: 1rpx solid rgba(55, 83, 76, 0.14);
  border-radius: 8rpx;
  text-align: left;
  background: #ffffff;
}

.palette-option.active {
  border-color: rgba(233, 92, 68, 0.66);
  background: rgba(233, 92, 68, 0.07);
}

.palette-dots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
}

.palette-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  box-shadow: inset -2rpx -2rpx 0 rgba(0, 0, 0, 0.1);
}

.palette-name,
.palette-desc {
  display: block;
}

.palette-name {
  color: #25302f;
  font-size: 26rpx;
  font-weight: 800;
}

.palette-desc {
  margin-top: 4rpx;
  color: #7a8983;
  font-size: 22rpx;
}

.tips {
  margin: 24rpx 0;
  padding: 22rpx;
}

.tips-title,
.tips-text {
  display: block;
}

.tips-title {
  color: #2f5f55;
  font-size: 26rpx;
  font-weight: 800;
}

.tips-text {
  margin-top: 8rpx;
  color: #75847e;
  font-size: 24rpx;
}

.blank-button {
  margin-top: 18rpx;
}

.hidden-canvas {
  opacity: 0;
  pointer-events: none;
}
</style>
