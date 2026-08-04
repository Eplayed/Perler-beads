import { getPalette } from '@/data/palettes.js'

export const SIZE_PRESETS = [
  { label: '挂件 24x24', width: 24, height: 24 },
  { label: '头像 32x32', width: 32, height: 32 },
  { label: '杯垫 40x40', width: 40, height: 40 },
  { label: '摆件 48x48', width: 48, height: 48 },
  { label: '大图 64x64', width: 64, height: 64 }
]

export const COLOR_LIMITS = [8, 12, 16, 24, 32, 48]

export function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  }
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

function colorDistance(left, right) {
  const redMean = (left.r + right.r) / 2
  const r = left.r - right.r
  const g = left.g - right.g
  const b = left.b - right.b
  return Math.sqrt((2 + redMean / 256) * r * r + 4 * g * g + (2 + (255 - redMean) / 256) * b * b)
}

function preparePalette(colors) {
  return colors.map((color) => ({
    ...color,
    rgb: hexToRgb(color.hex)
  }))
}

export function nearestColorId(pixel, colors) {
  let selected = colors[0]
  let minDistance = Number.MAX_SAFE_INTEGER
  colors.forEach((color) => {
    const distance = colorDistance(pixel, color.rgb)
    if (distance < minDistance) {
      minDistance = distance
      selected = color
    }
  })
  return selected.id
}

export function buildPatternFromImageData(imageData, options) {
  const palette = getPalette(options.paletteId)
  const preparedColors = preparePalette(palette.colors)
  const firstPass = []
  const frequency = {}
  const pixels = imageData.data

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3]
    const pixel = alpha < 12
      ? { r: 248, g: 247, b: 242 }
      : { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] }
    const colorId = nearestColorId(pixel, preparedColors)
    firstPass.push(pixel)
    frequency[colorId] = (frequency[colorId] || 0) + 1
  }

  const selectedIds = Object.entries(frequency)
    .sort((left, right) => right[1] - left[1])
    .slice(0, Math.min(options.colorLimit, preparedColors.length))
    .map(([colorId]) => colorId)

  const selectedColors = preparedColors.filter((color) => selectedIds.includes(color.id))
  const grid = firstPass.map((pixel) => nearestColorId(pixel, selectedColors))
  const stats = calculateStats(grid, palette.id)

  return {
    width: imageData.width,
    height: imageData.height,
    paletteId: palette.id,
    colorLimit: options.colorLimit,
    grid,
    stats
  }
}

export function calculateStats(grid, paletteId) {
  const palette = getPalette(paletteId)
  const colorMap = palette.colors.reduce((map, color) => {
    map[color.id] = color
    return map
  }, {})

  return Object.entries(
    grid.reduce((map, colorId) => {
      map[colorId] = (map[colorId] || 0) + 1
      return map
    }, {})
  )
    .map(([colorId, count]) => ({
      ...colorMap[colorId],
      count
    }))
    .filter((item) => item.id)
    .sort((left, right) => right.count - left.count)
}

export function createBlankPattern(width = 32, height = 32, paletteId = 'classic-48') {
  const palette = getPalette(paletteId)
  const white = palette.colors[0].id
  return {
    width,
    height,
    paletteId,
    colorLimit: palette.colors.length,
    grid: Array.from({ length: width * height }, () => white),
    stats: calculateStats(Array.from({ length: width * height }, () => white), paletteId)
  }
}

export function createProject(pattern, extras = {}) {
  const now = Date.now()
  return {
    id: extras.id || `bead_${now}_${Math.random().toString(16).slice(2, 8)}`,
    title: extras.title || `拼豆图纸 ${new Date(now).toLocaleDateString()}`,
    createdAt: extras.createdAt || now,
    updatedAt: now,
    sourceImage: extras.sourceImage || '',
    thumbnail: extras.thumbnail || '',
    completedCells: extras.completedCells || [],
    ...pattern
  }
}

export function replaceColorInGrid(grid, fromColorId, toColorId) {
  return grid.map((colorId) => (colorId === fromColorId ? toColorId : colorId))
}
