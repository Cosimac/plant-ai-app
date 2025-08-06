const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 百度AI配置
const BAIDU_API_KEY = 'Dt6l1NcsT8Djr8q5RUnMU7U4' // 请替换为你的百度API Key
const BAIDU_SECRET_KEY = 'mu2ROERA3DPMhIIOpl7vqOxVeIEkGSMm' // 请替换为你的百度Secret Key
const BAIDU_PLANT_API_URL = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant'

// 获取百度AI访问令牌
async function getBaiduAccessToken () {
  try {
    const response = await axios.get(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`
    )
    return response.data.access_token
  } catch (error) {
    console.error('获取百度访问令牌失败:', error)
    throw error
  }
}

// 获取图片的base64编码
async function getImageBase64 (imageUrl) {
  try {
    let imageBuffer;

    // 检查是否是云存储路径
    if (imageUrl.startsWith('cloud://')) {
      console.log('检测到云存储路径，使用云开发API下载文件')
      // 使用云开发API下载文件
      const result = await cloud.downloadFile({
        fileID: imageUrl
      })
      imageBuffer = result.fileContent
    } else if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
      console.log('检测到HTTP URL，使用axios下载文件')
      // 普通HTTP URL，使用axios下载
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      })
      imageBuffer = imageResponse.data
    } else {
      throw new Error('不支持的图片URL格式')
    }

    // 转换为base64
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    return base64Image
  } catch (error) {
    console.error('获取图片失败:', error)
    throw new Error(`图片获取失败: ${error.message}`)
  }
}

// 植物识别
async function identifyPlant (imageUrl) {
  try {
    console.log('开始植物识别，图片URL:', imageUrl)

    // 获取访问令牌
    const accessToken = await getBaiduAccessToken()
    console.log('成功获取百度访问令牌')

    // 获取图片并转换为base64
    const base64Image = await getImageBase64(imageUrl)
    console.log('成功获取图片base64编码')

    // 调用百度植物识别API
    const response = await axios.post(
      `${BAIDU_PLANT_API_URL}?access_token=${accessToken}`,
      `image=${encodeURIComponent(base64Image)}&baike_num=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const result = response.data
    console.log('百度API响应:', result)

    if (result.error_code) {
      throw new Error(`百度API错误: ${result.error_msg}`)
    }

    // 处理识别结果
    const plants = result.result || []
    if (plants.length === 0) {
      return {
        success: false,
        message: '未能识别出植物，请尝试拍摄更清晰的图片'
      }
    }

    const bestMatch = plants[0]
    const accuracy = Math.round(bestMatch.score * 100)

    return {
      success: true,
      data: {
        name: bestMatch.name,
        scientificName: bestMatch.baike_info?.description || '未知',
        family: bestMatch.baike_info?.description || '未知',
        accuracy: `${accuracy}%`,
        description: bestMatch.baike_info?.description || '暂无描述',
        characteristics: [
          `置信度: ${accuracy}%`,
          `植物名称: ${bestMatch.name}`,
          bestMatch.baike_info?.description ? `描述: ${bestMatch.baike_info.description}` : ''
        ].filter(item => item),
        careTips: [
          '建议在光线充足的环境下拍摄',
          '确保植物在画面中清晰可见',
          '识别结果仅供参考，请以实际情况为准'
        ],
        baikeInfo: bestMatch.baike_info || null,
        allResults: plants.slice(0, 5) // 返回前5个结果
      }
    }
  } catch (error) {
    console.error('植物识别失败:', error)
    return {
      success: false,
      message: error.message || '识别失败，请稍后重试'
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { imageUrl } = event

  console.log('云函数被调用，参数:', { imageUrl })

  if (!imageUrl) {
    return {
      success: false,
      message: '缺少图片URL参数'
    }
  }

  try {
    const result = await identifyPlant(imageUrl)
    console.log('识别结果:', result)
    return result
  } catch (error) {
    console.error('云函数执行失败:', error)
    return {
      success: false,
      message: '服务器错误，请稍后重试'
    }
  }
} 