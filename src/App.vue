<script>
export default {
  onLaunch() {
    console.log('拼豆图纸工坊启动')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

page {
  min-height: 100%;
  color: #25302f;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  background: #f7f2e8;
  box-sizing: border-box;
}

view,
text,
button,
input,
scroll-view,
canvas,
image {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  line-height: normal;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: inherit;
}

button::after {
  border: 0;
}

.page-shell {
  min-height: 100vh;
  padding: 28rpx 28rpx 48rpx;
  background:
    linear-gradient(180deg, rgba(255, 239, 202, 0.95) 0%, rgba(247, 242, 232, 0.98) 36%, #eef4ef 100%);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 36rpx 0 18rpx;
  color: #263331;
  font-size: 32rpx;
  font-weight: 800;
}

.soft-card {
  border: 1rpx solid rgba(84, 108, 97, 0.14);
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16rpx 34rpx rgba(72, 88, 80, 0.08);
}

.primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 92rpx;
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #e95c44 0%, #f0a03a 100%);
  box-shadow: 0 18rpx 28rpx rgba(224, 105, 52, 0.22);
}

.secondary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 78rpx;
  border: 1rpx solid rgba(50, 87, 78, 0.22);
  border-radius: 8rpx;
  color: #2f5f55;
  font-size: 26rpx;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.7);
}

.muted {
  color: #7d8a85;
}

.tiny-label {
  color: #73827b;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
