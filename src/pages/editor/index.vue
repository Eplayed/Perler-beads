<template>
  <view v-if="project" class="page-shell editor-page">
    <view class="editor-header soft-card">
      <view>
        <text class="title">{{ project.title }}</text>
        <text class="meta">{{ project.width }}x{{ project.height }} · {{ project.stats.length }} 色 · {{ totalBeads }} 颗</text>
      </view>
      <button class="save-button" @click="saveCurrent">保存</button>
    </view>

    <view class="mode-tabs">
      <button class="mode-tab" :class="{ active: mode === 'edit' }" @click="mode = 'edit'">编辑</button>
      <button class="mode-tab" :class="{ active: mode === 'make' }" @click="mode = 'make'">制作</button>
      <button class="mode-tab" :class="{ active: mode === 'stats' }" @click="mode = 'stats'">清单</button>
    </view>

    <view v-if="mode !== 'stats'" class="board-wrap">
      <view class="board-toolbar soft-card">
        <button class="tool-chip" :class="{ active: tool === 'pen' }" @click="tool = 'pen'">画笔</button>
        <button class="tool-chip" :class="{ active: tool === 'eraser' }" @click="tool = 'eraser'">橡皮</button>
        <button class="tool-chip" :class="{ active: tool === 'picker' }" @click="tool = 'picker'">取色</button>
        <button class="tool-chip" :disabled="!undoStack.length" @click="undo">撤销</button>
      </view>

      <view class="pattern-board soft-card">
        <view class="pattern-grid" :style="gridStyle">
          <view
            v-for="(colorId, index) in project.grid"
            :key="index"
            class="bead-cell"
            :class="{ done: completedSet.has(index) }"
            :style="{ backgroundColor: getColor(colorId) }"
            @click="handleCellTap(index)"
          >
            <text v-if="mode === 'make' && completedSet.has(index)" class="done-mark">✓</text>
          </view>
        </view>
      </view>

      <view v-if="mode === 'make'" class="progress-card soft-card">
        <view class="progress-text">
          <text>制作进度</text>
          <text>{{ progress.done }}/{{ progress.total }} · {{ progress.percent }}%</text>
        </view>
        <view class="progress-track">
          <view class="progress-fill" :style="{ width: `${progress.percent}%` }" />
        </view>
      </view>

      <scroll-view v-if="mode === 'edit'" scroll-x class="color-strip">
        <button
          v-for="color in paletteColors"
          :key="color.id"
          class="color-button"
          :class="{ active: selectedColor === color.id }"
          @click="selectedColor = color.id"
        >
          <text class="color-dot" :style="{ backgroundColor: color.hex }" />
          <text class="color-code">{{ color.id }}</text>
        </button>
      </scroll-view>
    </view>

    <view v-else class="stats-panel">
      <view class="summary soft-card">
        <view>
          <text class="summary-number">{{ totalBeads }}</text>
          <text class="summary-label">总颗数</text>
        </view>
        <view>
          <text class="summary-number">{{ project.stats.length }}</text>
          <text class="summary-label">颜色数</text>
        </view>
        <view>
          <text class="summary-number">{{ progress.percent }}%</text>
          <text class="summary-label">进度</text>
        </view>
      </view>

      <view class="stats-list">
        <view v-for="item in project.stats" :key="item.id" class="stat-row soft-card">
          <text class="stat-color" :style="{ backgroundColor: item.hex }" />
          <view class="stat-main">
            <text class="stat-name">{{ item.id }} · {{ item.name }}</text>
            <text class="stat-count">{{ item.count }} 颗</text>
          </view>
          <button class="stat-action" @click="selectedColor = item.id; mode = 'edit'">画笔</button>
          <button class="stat-action danger" @click="replaceColor(item.id)">替换</button>
        </view>
      </view>
    </view>

    <view class="bottom-actions">
      <button class="secondary-button" @click="rename">重命名</button>
      <button class="primary-button" @click="exportPattern">导出图纸</button>
    </view>

    <canvas canvas-id="exportCanvas" id="exportCanvas" class="export-canvas" :style="exportCanvasStyle" />
  </view>

  <view v-else class="page-shell">
    <view class="empty soft-card">
      <text class="empty-title">作品不存在</text>
      <button class="primary-button" @click="goCreate">新建图纸</button>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getColorMap, getPalette } from '@/data/palettes.js'
import { calculateStats, replaceColorInGrid } from '@/utils/beadPattern.js'
import { getProject, getProjectProgress, saveProject } from '@/utils/projects.js'
import { formatDate, toast } from '@/utils/share.js'

const project = ref(null)
const mode = ref('edit')
const tool = ref('pen')
const selectedColor = ref('C08')
const undoStack = ref([])
const exportCanvasWidth = ref(720)
const exportCanvasHeight = ref(960)

const colorMap = computed(() => project.value ? getColorMap(project.value.paletteId) : {})
const paletteColors = computed(() => project.value ? getPalette(project.value.paletteId).colors : [])
const totalBeads = computed(() => project.value ? project.value.width * project.value.height : 0)
const completedSet = computed(() => new Set(project.value?.completedCells || []))
const progress = computed(() => project.value ? getProjectProgress(project.value) : { done: 0, total: 0, percent: 0 })
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${project.value.width}, 1fr)`
}))
const exportCanvasStyle = computed(() => {
  return `position:absolute;left:-9999px;top:-9999px;width:${exportCanvasWidth.value}px;height:${exportCanvasHeight.value}px;`
})

onLoad((query) => {
  const loadedProject = getProject(query.id)
  if (!loadedProject) return
  project.value = loadedProject
  selectedColor.value = loadedProject.stats[0]?.id || getPalette(loadedProject.paletteId).colors[0].id
})

onUnload(() => {
  if (project.value) saveProject(project.value)
})

function getColor(colorId) {
  return colorMap.value[colorId]?.hex || '#FFFFFF'
}

function pushHistory() {
  undoStack.value.push(project.value.grid.slice())
  if (undoStack.value.length > 24) undoStack.value.shift()
}

function handleCellTap(index) {
  if (!project.value) return
  if (mode.value === 'make') {
    const set = new Set(project.value.completedCells || [])
    if (set.has(index)) set.delete(index)
    else set.add(index)
    project.value.completedCells = Array.from(set)
    saveProject(project.value)
    return
  }

  if (tool.value === 'picker') {
    selectedColor.value = project.value.grid[index]
    tool.value = 'pen'
    return
  }

  const nextColor = tool.value === 'eraser' ? getPalette(project.value.paletteId).colors[0].id : selectedColor.value
  if (project.value.grid[index] === nextColor) return
  pushHistory()
  project.value.grid.splice(index, 1, nextColor)
  project.value.stats = calculateStats(project.value.grid, project.value.paletteId)
}

function undo() {
  const previous = undoStack.value.pop()
  if (!previous) return
  project.value.grid = previous
  project.value.stats = calculateStats(project.value.grid, project.value.paletteId)
  saveProject(project.value)
}

function saveCurrent() {
  project.value = saveProject(project.value)
  toast('已保存', 'success')
}

function replaceColor(fromColorId) {
  if (!project.value || fromColorId === selectedColor.value) {
    toast('先选择一个不同的画笔色')
    return
  }

  uni.showModal({
    title: '替换颜色',
    content: `把 ${fromColorId} 全部替换为 ${selectedColor.value}？`,
    success: (result) => {
      if (!result.confirm) return
      pushHistory()
      project.value.grid = replaceColorInGrid(project.value.grid, fromColorId, selectedColor.value)
      project.value.stats = calculateStats(project.value.grid, project.value.paletteId)
      saveCurrent()
    }
  })
}

function rename() {
  uni.showModal({
    title: '作品名称',
    editable: true,
    placeholderText: '输入新名称',
    content: project.value.title,
    success: (result) => {
      if (!result.confirm || !result.content) return
      project.value.title = result.content.trim()
      saveCurrent()
    }
  })
}

async function exportPattern() {
  if (!project.value) return
  uni.showLoading({ title: '导出中' })
  try {
    await drawExportCanvas()
    uni.canvasToTempFilePath({
      canvasId: 'exportCanvas',
      fileType: 'png',
      quality: 1,
      success: (result) => {
        uni.saveImageToPhotosAlbum({
          filePath: result.tempFilePath,
          success: () => {
            uni.hideLoading()
            toast('已保存到相册', 'success')
          },
          fail: () => {
            uni.hideLoading()
            toast('保存失败，请检查相册权限')
          }
        })
      },
      fail: () => {
        uni.hideLoading()
        toast('导出失败')
      }
    })
  } catch (error) {
    console.error(error)
    uni.hideLoading()
    toast('导出失败')
  }
}

function drawExportCanvas() {
  const cell = Math.max(8, Math.floor(680 / project.value.width))
  const margin = 28
  const gridWidth = project.value.width * cell
  const gridHeight = project.value.height * cell
  const legendRows = Math.ceil(project.value.stats.length / 2)
  exportCanvasWidth.value = gridWidth + margin * 2
  exportCanvasHeight.value = gridHeight + margin * 2 + 126 + legendRows * 30

  return new Promise((resolve) => {
    nextTick(() => {
      const context = uni.createCanvasContext('exportCanvas')
      context.setFillStyle('#fffaf2')
      context.fillRect(0, 0, exportCanvasWidth.value, exportCanvasHeight.value)
      context.setFillStyle('#25302f')
      context.setFontSize(22)
      context.fillText(project.value.title, margin, 34)
      context.setFontSize(14)
      context.setFillStyle('#6d7d76')
      context.fillText(`${project.value.width}x${project.value.height} · ${totalBeads.value} 颗 · ${formatDate(project.value.updatedAt)}`, margin, 58)

      const top = 80
      project.value.grid.forEach((colorId, index) => {
        const x = margin + (index % project.value.width) * cell
        const y = top + Math.floor(index / project.value.width) * cell
        context.setFillStyle(getColor(colorId))
        context.fillRect(x, y, cell, cell)
      })

      drawGridLines(context, {
        left: margin,
        top,
        width: project.value.width,
        height: project.value.height,
        cell,
        gridWidth,
        gridHeight
      })

      const legendTop = top + gridHeight + 36
      context.setFillStyle('#25302f')
      context.setFontSize(16)
      context.fillText('用豆清单', margin, legendTop)
      const columnGap = 28
      const columnWidth = Math.floor((gridWidth - columnGap) / 2)
      const legendLeft = margin
      project.value.stats.forEach((item, index) => {
        const column = index % 2
        const row = Math.floor(index / 2)
        const x = legendLeft + column * (columnWidth + columnGap)
        const y = legendTop + 30 + row * 30
        context.setFillStyle(item.hex)
        context.fillRect(x, y - 15, 18, 18)
        context.setFillStyle('#25302f')
        context.setFontSize(13)
        context.fillText(`${item.id} ${item.name} · ${item.count} 颗`, x + 28, y)
      })

      context.draw(false, () => {
        setTimeout(resolve, 160)
      })
    })
  })
}

function drawGridLines(context, options) {
  const { left, top, width, height, cell, gridWidth, gridHeight } = options

  context.beginPath()
  context.setStrokeStyle('rgba(37,48,47,0.12)')
  context.setLineWidth(1)
  for (let column = 0; column <= width; column += 1) {
    const x = left + column * cell
    context.moveTo(x, top)
    context.lineTo(x, top + gridHeight)
  }
  for (let row = 0; row <= height; row += 1) {
    const y = top + row * cell
    context.moveTo(left, y)
    context.lineTo(left + gridWidth, y)
  }
  context.stroke()

  context.beginPath()
  context.setStrokeStyle('rgba(37,48,47,0.32)')
  context.setLineWidth(1)
  for (let column = 0; column <= width; column += 1) {
    if (column % 5 === 0 || column === width) {
      const x = left + column * cell
      context.moveTo(x, top)
      context.lineTo(x, top + gridHeight)
    }
  }
  for (let row = 0; row <= height; row += 1) {
    if (row % 5 === 0 || row === height) {
      const y = top + row * cell
      context.moveTo(left, y)
      context.lineTo(left + gridWidth, y)
    }
  }
  context.stroke()

  context.beginPath()
  context.setStrokeStyle('rgba(37,48,47,0.44)')
  context.setLineWidth(2)
  context.rect(left, top, gridWidth, gridHeight)
  context.stroke()
}

function goCreate() {
  uni.navigateTo({ url: '/pages/create/index' })
}
</script>

<style lang="scss" scoped>
.editor-page {
  padding-bottom: 160rpx;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 20rpx 22rpx;
}

.title {
  display: block;
  color: #25302f;
  font-size: 31rpx;
  font-weight: 900;
}

.meta {
  display: block;
  margin-top: 6rpx;
  color: #7a8983;
  font-size: 23rpx;
}

.save-button {
  width: 116rpx;
  height: 62rpx;
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 800;
  background: #2f7568;
}

.mode-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
  margin: 22rpx 0;
  padding: 8rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.72);
}

.mode-tab {
  height: 64rpx;
  border-radius: 8rpx;
  color: #65746f;
  font-size: 25rpx;
  font-weight: 800;
}

.mode-tab.active {
  color: #ffffff;
  background: #e95c44;
}

.board-toolbar {
  display: flex;
  gap: 12rpx;
  padding: 12rpx;
  margin-bottom: 16rpx;
}

.tool-chip {
  flex: 1;
  height: 58rpx;
  border-radius: 8rpx;
  color: #445751;
  font-size: 23rpx;
  font-weight: 800;
  background: #ffffff;
}

.tool-chip.active {
  color: #ffffff;
  background: #2f7568;
}

.pattern-board {
  padding: 14rpx;
  overflow: auto;
}

.pattern-grid {
  display: grid;
  width: 100%;
  border-top: 1rpx solid rgba(37, 48, 47, 0.26);
  border-left: 1rpx solid rgba(37, 48, 47, 0.26);
  background: #ffffff;
}

.bead-cell {
  position: relative;
  aspect-ratio: 1 / 1;
  min-width: 0;
  min-height: 0;
  border-right: 1rpx solid rgba(37, 48, 47, 0.16);
  border-bottom: 1rpx solid rgba(37, 48, 47, 0.16);
}

.bead-cell.done::after {
  content: '';
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.62);
}

.done-mark {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #25302f;
  font-size: 20rpx;
  font-weight: 900;
}

.progress-card {
  margin-top: 18rpx;
  padding: 18rpx;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  color: #42534d;
  font-size: 24rpx;
  font-weight: 800;
}

.progress-track {
  height: 16rpx;
  margin-top: 14rpx;
  overflow: hidden;
  border-radius: 8rpx;
  background: #dce6df;
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #2f7568, #f0a03a);
}

.color-strip {
  width: 100%;
  margin-top: 18rpx;
  white-space: nowrap;
}

.color-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  width: 86rpx;
  height: 92rpx;
  margin-right: 10rpx;
  border: 1rpx solid rgba(37, 48, 47, 0.12);
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.82);
}

.color-button.active {
  border-color: #e95c44;
  background: rgba(233, 92, 68, 0.1);
}

.color-dot {
  width: 34rpx;
  height: 34rpx;
  margin-top: 10rpx;
  border-radius: 50%;
  box-shadow: inset -3rpx -3rpx 0 rgba(0, 0, 0, 0.12);
}

.color-code {
  color: #65746f;
  font-size: 20rpx;
  font-weight: 800;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 24rpx;
  text-align: center;
}

.summary-number,
.summary-label {
  display: block;
}

.summary-number {
  color: #e95c44;
  font-size: 36rpx;
  font-weight: 900;
}

.summary-label {
  color: #72817b;
  font-size: 22rpx;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  margin-top: 18rpx;
}

.stat-row {
  display: grid;
  grid-template-columns: 42rpx 1fr 82rpx 82rpx;
  gap: 14rpx;
  align-items: center;
  padding: 16rpx;
}

.stat-color {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  box-shadow: inset -3rpx -3rpx 0 rgba(0, 0, 0, 0.12);
}

.stat-name,
.stat-count {
  display: block;
}

.stat-name {
  color: #25302f;
  font-size: 25rpx;
  font-weight: 800;
}

.stat-count {
  color: #7a8983;
  font-size: 22rpx;
}

.stat-action {
  height: 52rpx;
  border-radius: 8rpx;
  color: #2f7568;
  font-size: 22rpx;
  font-weight: 800;
  background: rgba(47, 117, 104, 0.1);
}

.stat-action.danger {
  color: #e95c44;
  background: rgba(233, 92, 68, 0.1);
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 220rpx 1fr;
  gap: 16rpx;
  padding: 18rpx 28rpx 34rpx;
  background: rgba(255, 250, 242, 0.96);
  box-shadow: 0 -12rpx 28rpx rgba(66, 83, 77, 0.08);
}

.export-canvas {
  opacity: 0;
  pointer-events: none;
}

.empty {
  padding: 42rpx 28rpx;
}

.empty-title {
  display: block;
  margin-bottom: 24rpx;
  color: #25302f;
  font-size: 30rpx;
  font-weight: 900;
}
</style>
