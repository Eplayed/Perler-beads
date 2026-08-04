export function formatDate(timestamp) {
  const date = new Date(timestamp)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function toast(title, icon = 'none') {
  uni.showToast({
    title,
    icon,
    duration: 1800
  })
}
