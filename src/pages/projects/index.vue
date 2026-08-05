<template>
  <view class="gallery-page">
    <view class="gallery-body">
      <view class="pattern-grid">
        <button
          v-for="item in patterns"
          :key="item.id"
          class="pattern-card"
          @click="openPattern(item)"
        >
          <image class="pattern-image" :src="item.effectImage" mode="aspectFit" />
        </button>
      </view>
    </view>

    <view v-if="selectedPattern" class="modal-mask" @click="closeModal">
      <view class="preview-modal" @click.stop>
        <view class="modal-head">
          <text class="modal-title">效果图与图纸</text>
          <button class="close-button" @click="closeModal">×</button>
        </view>

        <view class="preview-row">
          <button class="preview-card" @click="previewImage(selectedPattern.effectImage)">
            <image class="preview-image" :src="selectedPattern.effectImage" mode="aspectFit" />
            <text class="preview-label">效果图 · 查看大图</text>
          </button>
          <button class="preview-card" @click="previewImage(selectedPattern.patternImage)">
            <image class="preview-image" :src="selectedPattern.patternImage" mode="aspectFit" />
            <text class="preview-label">图纸 · 查看大图</text>
          </button>
        </view>

        <view class="modal-tip">
          <text class="tip-title">点击图片可查看大图</text>
          <text class="tip-text">图纸会自动记录到“我的”页面，方便下次继续查看。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { GALLERY_PATTERNS } from '@/data/gallery.js'
import { addGalleryHistory } from '@/utils/galleryHistory.js'

const patterns = GALLERY_PATTERNS
const selectedPattern = ref(null)

function openPattern(pattern) {
  selectedPattern.value = pattern
  addGalleryHistory(pattern)
}

function closeModal() {
  selectedPattern.value = null
}

function previewImage(current) {
  if (!selectedPattern.value) return
  addGalleryHistory(selectedPattern.value)
  uni.previewImage({
    current,
    urls: [selectedPattern.value.effectImage, selectedPattern.value.patternImage]
  })
}

</script>

<style lang="scss" scoped>
.gallery-page {
  min-height: 100vh;
  background: #f6efec;
}

.gallery-body {
  padding: 28rpx;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26rpx;
}

.pattern-card {
  height: 224rpx;
  overflow: hidden;
  border-radius: 4rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.04);
}

.pattern-image {
  width: 100%;
  height: 100%;
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56rpx;
  background: rgba(0, 0, 0, 0.62);
}

.preview-modal {
  width: 100%;
  padding: 30rpx 28rpx 28rpx;
  border-radius: 8rpx;
  background: #ffffff;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.modal-title {
  color: #252525;
  font-size: 32rpx;
  font-weight: 900;
}

.close-button {
  width: 66rpx;
  height: 66rpx;
  border-radius: 50%;
  color: #666;
  font-size: 46rpx;
  line-height: 60rpx;
  background: #f0f1f2;
}

.preview-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.preview-card {
  overflow: hidden;
  border: 1rpx solid #e3e5e8;
  border-radius: 4rpx;
  background: #ffffff;
}

.preview-image {
  width: 100%;
  height: 250rpx;
}

.preview-label {
  display: block;
  height: 56rpx;
  color: #171717;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 56rpx;
  text-align: center;
}

.modal-tip {
  margin-top: 24rpx;
  padding: 18rpx 20rpx;
  border-radius: 4rpx;
  background: #f4f5f6;
}

.tip-title,
.tip-text {
  display: block;
}

.tip-title {
  color: #333333;
  font-size: 24rpx;
  font-weight: 900;
}

.tip-text {
  margin-top: 6rpx;
  color: #777777;
  font-size: 22rpx;
}
</style>
