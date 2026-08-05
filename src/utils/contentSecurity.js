function getFileExtension(filePath = '') {
  const match = /\.([a-zA-Z0-9]+)(?:\?|$)/.exec(filePath)
  const ext = match ? match[1].toLowerCase() : 'jpg'
  return ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
}

function callWx(run) {
  return new Promise((resolve, reject) => {
    run(resolve, reject)
  })
}

export async function checkImageContent(filePath) {
  if (!filePath) {
    throw new Error('缺少待检测图片')
  }

  if (typeof wx === 'undefined' || !wx.cloud) {
    throw new Error('当前环境不支持图片内容安全检测')
  }

  const ext = getFileExtension(filePath)
  const cloudPath = `sec-check/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  let fileID = ''

  try {
    const uploadResult = await callWx((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: resolve,
        fail: reject
      })
    })
    fileID = uploadResult.fileID

    const checkResult = await callWx((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'image-sec-check',
        data: {
          fileID,
          cloudPath
        },
        success: resolve,
        fail: reject
      })
    })

    const result = checkResult.result || {}
    if (!result.safe) {
      throw new Error(result.reason || '图片内容安全检测未通过')
    }

    return true
  } finally {
    if (fileID) {
      wx.cloud.deleteFile({
        fileList: [fileID],
        fail: (error) => console.warn('delete sec-check image failed', error)
      })
    }
  }
}
