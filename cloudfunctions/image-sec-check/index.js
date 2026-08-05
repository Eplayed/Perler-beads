const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function getContentType(filePath = '') {
  const lower = filePath.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

exports.main = async (event = {}) => {
  const { fileID, cloudPath } = event

  if (!fileID) {
    return {
      safe: false,
      reason: '缺少待检测图片'
    }
  }

  try {
    const file = await cloud.downloadFile({ fileID })
    const result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: getContentType(cloudPath || fileID),
        value: file.fileContent
      }
    })

    const suggest = result?.result?.suggest
    const errCode = result?.errCode
    const isRisky = errCode === 87014 || suggest === 'risky'

    if (isRisky) {
      return {
        safe: false,
        reason: '图片包含不适合发布的内容，请更换图片',
        raw: result
      }
    }

    if (errCode === 0 || suggest === 'pass') {
      return {
        safe: true,
        raw: result
      }
    }

    return {
      safe: false,
      reason: '图片内容安全检测未通过，请更换图片',
      raw: result
    }
  } catch (error) {
    console.error('image sec check failed', error)
    return {
      safe: false,
      reason: '图片内容安全检测失败，请稍后重试',
      error: error.message
    }
  }
}
