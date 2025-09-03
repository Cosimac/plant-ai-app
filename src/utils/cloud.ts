// 声明全局 wx 对象
declare const wx: any

// 类型定义
interface PlantResult {
  name: string
  scientificName: string
  family: string
  accuracy: string
  description: string
  characteristics: string[]
  careTips: string[]
  baikeInfo?: any
  allResults?: any[]
}

interface CloudFunctionResult<T = any> {
  success: boolean
  data?: T
  message?: string
}

// 腾讯云开发配置
const cloud = {
  // 云开发环境ID
  envId: 'cloud1-7gkups8e633f1074',

  // 初始化云开发
  init() {
    if (typeof wx !== 'undefined') {
      wx.cloud.init({
        env: this.envId,
        traceUser: true,
      })
    }
  },

  // 调用云函数
  async callFunction<T = any>(
    name: string,
    data: any = {}
  ): Promise<CloudFunctionResult<T>> {
    try {
      const result = await wx.cloud.callFunction({
        name,
        data,
      })
      return result.result
    } catch (error) {
      console.error(`调用云函数 ${name} 失败:`, error)
      throw error
    }
  },

  // 上传文件
  async uploadFile(filePath: string, cloudPath: string): Promise<any> {
    try {
      const result = await wx.cloud.uploadFile({
        cloudPath,
        filePath,
      })
      return result
    } catch (error) {
      console.error('上传文件失败:', error)
      throw error
    }
  },

  // 植物识别相关API
  plantAPI: {
    // 识别植物
    async identifyPlant(imageData: string): Promise<PlantResult> {
      try {
        const result = await cloud.callFunction('identifyPlant', {
          imageUrl: imageData,
        })
        if (!result.success) {
          throw new Error(result.message || '识别失败')
        }

        return result.data
      } catch (error) {
        console.error('植物识别失败:', error)
        throw error
      }
    }
  }
}

export default cloud