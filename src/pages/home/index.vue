<template>
  <view class="make-page">
    <view class="top-band">
      <text class="top-title">拼豆图制作</text>
    </view>

    <view class="content">
      <button class="upload-card" @click="goCreate">
        <view class="plus-box">
          <text class="plus">+</text>
        </view>
        <text class="upload-title">点击上传图片</text>
        <text class="upload-subtitle">支持 JPG、PNG 格式</text>
      </button>

      <view class="pro-card">
        <view class="ai-badge">AI</view>
        <view class="pro-copy">
          <text class="pro-title">拼豆高级版</text>
          <text class="pro-text">建议先生成高级版风格图，再制作拼豆图纸</text>
        </view>
        <button class="pro-button" @click="goCreate">去生成</button>
      </view>

      <view class="quiet-note">
        <text class="note-title">当前版本</text>
        <text class="note-text">先专注图片生成拼豆图纸，更多功能后续再开放。</text>
      </view>
    </view>
  </view>
</template>

<script setup>
function goCreate() {
  uni.navigateTo({ url: '/pages/create/index' })
}
</script>

<style lang="scss" scoped>
.make-page {
  min-height: 100vh;
  background: #f7f1ef;
}

.top-band {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 132rpx;
  padding-bottom: 24rpx;
  background: #ff676c;
}

.top-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 900;
}

.content {
  padding: 18rpx 30rpx 48rpx;
}

.upload-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 360rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 34rpx rgba(28, 28, 28, 0.08);
}

.plus-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 144rpx;
  margin-bottom: 32rpx;
  border-radius: 32rpx;
  background: linear-gradient(180deg, #ff7378 0%, #ff6b72 100%);
  box-shadow: 0 12rpx 26rpx rgba(255, 103, 108, 0.32);
}

.plus {
  color: #ffffff;
  font-size: 58rpx;
  font-weight: 300;
}

.upload-title,
.upload-subtitle {
  display: block;
}

.upload-title {
  color: #171717;
  font-size: 31rpx;
  font-weight: 900;
}

.upload-subtitle {
  margin-top: 10rpx;
  color: #9a9a9a;
  font-size: 26rpx;
}

.pro-card {
  display: grid;
  grid-template-columns: 64rpx 1fr 104rpx;
  gap: 18rpx;
  align-items: center;
  margin-top: 48rpx;
  padding: 22rpx 20rpx;
  border-radius: 14rpx;
  background: linear-gradient(100deg, #513049 0%, #ff6266 62%, #ffad2d 100%);
  box-shadow: 0 10rpx 28rpx rgba(255, 103, 108, 0.22);
}

.ai-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 27rpx;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.24);
}

.pro-title,
.pro-text {
  display: block;
  color: #ffffff;
}

.pro-title {
  font-size: 29rpx;
  font-weight: 900;
}

.pro-text {
  margin-top: 4rpx;
  font-size: 21rpx;
}

.pro-button {
  height: 56rpx;
  border-radius: 28rpx;
  color: #ff676c;
  font-size: 23rpx;
  font-weight: 900;
  background: #fff4dc;
}

.quiet-note {
  margin-top: 34rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.72);
}

.note-title,
.note-text {
  display: block;
}

.note-title {
  color: #171717;
  font-size: 28rpx;
  font-weight: 900;
}

.note-text {
  margin-top: 8rpx;
  color: #8d8d8d;
  font-size: 24rpx;
}
</style>
