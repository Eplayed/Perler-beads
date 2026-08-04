const HISTORY_KEY = 'perler_gallery_history_v1'
const MAX_HISTORY = 30

function readHistory() {
  try {
    const history = uni.getStorageSync(HISTORY_KEY)
    return Array.isArray(history) ? history : []
  } catch (error) {
    console.error('读取图纸浏览记录失败', error)
    return []
  }
}

function writeHistory(history) {
  uni.setStorageSync(HISTORY_KEY, history.slice(0, MAX_HISTORY))
}

export function listGalleryHistory() {
  return readHistory().sort((left, right) => right.viewedAt - left.viewedAt)
}

export function addGalleryHistory(pattern) {
  const history = readHistory().filter((item) => item.id !== pattern.id)
  history.unshift({
    id: pattern.id,
    title: pattern.title,
    size: pattern.size,
    colors: pattern.colors,
    effectImage: pattern.effectImage,
    patternImage: pattern.patternImage,
    viewedAt: Date.now()
  })
  writeHistory(history)
}

export function clearGalleryHistory() {
  uni.removeStorageSync(HISTORY_KEY)
}
