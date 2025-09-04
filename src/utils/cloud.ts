// 声明全局 wx 对象
declare const wx: any

// 导入云开发配置
import { CLOUD_CONFIG } from '../config/cloud'

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
  envId: CLOUD_CONFIG.ENV_ID,

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

  // 植物识别相关API
  plantAPI: {
    // 识别植物
    async identifyPlant(imageData: string): Promise<PlantResult> {
      try {
        const result = await cloud.callFunction('identifyPlant', {
          imageData,
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