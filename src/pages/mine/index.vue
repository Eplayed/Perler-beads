<template>
  <view class="mine-page">
    <view class="mine-head">
      <text class="head-title">我的</text>
    </view>

    <view class="mine-body">
      <view class="app-card">
        <view class="logo-box">PD</view>
        <view>
          <text class="app-title">拼豆图纸一键生成器</text>
          <text class="app-subtitle">记录保存在本机，不上传服务器</text>
        </view>
      </view>

      <view class="record-title-row">
        <text class="record-title">图纸记录</text>
        <button v-if="history.length" class="clear-button" @click="clearRecords">清空</button>
      </view>

      <view v-if="history.length" class="record-list">
        <button
          v-for="item in history"
          :key="item.id"
          class="record-card"
          @click="previewRecord(item)"
        >
          <image class="record-image" :src="item.effectImage" mode="aspectFit" />
          <view class="record-info">
            <text class="record-name">{{ item.title }}</text>
            <text class="record-meta">{{ item.size }} · {{ item.colors }} 色 · {{ formatRecordTime(item.viewedAt) }}</text>
          </view>
          <text class="record-arrow">›</text>
        </button>
      </view>

      <view v-else class="empty-record">
        <text class="empty-title">暂无图纸记录</text>
        <text class="empty-text">查看拼豆图后会自动保存在这里</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { clearGalleryHistory, listGalleryHistory } from '@/utils/galleryHistory.js'
import { toast } from '@/utils/share.js'

const history = ref([])

onShow(() => {
  history.value = listGalleryHistory()
})

function previewRecord(item) {
  uni.previewImage({
    current: item.patternImage,
    urls: [item.effectImage, item.patternImage]
  })
}

function clearRecords() {
  uni.showModal({
    title: '清空记录',
    content: '浏览记录只保存在本地，清空后无法恢复。',
    success: (result) => {
      if (!result.confirm) return
      clearGalleryHistory()
      history.value = []
      toast('已清空')
    }
  })
}

function formatRecordTime(timestamp) {
  const date = new Date(timestamp)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f6efec;
}

.mine-head {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 154rpx;
  padding-bottom: 32rpx;
  background: #fffaf7;
}

.head-title {
  color: #202020;
  font-size: 34rpx;
  font-weight: 900;
}

.mine-body {
  padding: 30rpx 28rpx 56rpx;
}

.app-card {
  display: grid;
  grid-template-columns: 88rpx 1fr;
  gap: 20rpx;
  align-items: center;
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 18rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  background: linear-gradient(145deg, #ff805e, #ff686b);
}

.app-title,
.app-subtitle {
  display: block;
}

.app-title {
  color: #202020;
  font-size: 30rpx;
  font-weight: 900;
}

.app-subtitle {
  margin-top: 6rpx;
  color: #8e8e8e;
  font-size: 24rpx;
}

.record-arrow {
  color: #b1a49d;
  font-size: 42rpx;
}

.record-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 28rpx 0 18rpx;
}

.record-title {
  color: #171717;
  font-size: 30rpx;
  font-weight: 900;
}

.clear-button {
  color: #ff8a00;
  font-size: 24rpx;
  font-weight: 800;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.record-card {
  display: grid;
  grid-template-columns: 94rpx 1fr 28rpx;
  gap: 18rpx;
  align-items: center;
  width: 100%;
  padding: 18rpx;
  border-radius: 14rpx;
  text-align: left;
  background: #ffffff;
}

.record-image {
  width: 94rpx;
  height: 94rpx;
  border-radius: 8rpx;
  background: #f4f4f4;
}

.record-name,
.record-meta {
  display: block;
}

.record-name {
  color: #202020;
  font-size: 28rpx;
  font-weight: 900;
}

.record-meta {
  margin-top: 8rpx;
  color: #9a9a9a;
  font-size: 22rpx;
}

.empty-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.empty-title,
.empty-text {
  display: block;
}

.empty-title {
  color: #202020;
  font-size: 30rpx;
  font-weight: 900;
}

.empty-text {
  margin-top: 10rpx;
  color: #a08f86;
  font-size: 24rpx;
}
</style>
