// EMAS Serverless工具类
import { EMAS_CONFIG } from '../config/emas'

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

/**
 * EMAS Serverless客户端
 */
class EmasClient {
  private appId: string
  private spaceId: string
  private clientSecret: string
  private endpoint?: string
  private mpServerless: any
  private initialized: boolean = false

  constructor() {
    this.appId = EMAS_CONFIG.APP_ID
    this.spaceId = EMAS_CONFIG.SPACE_ID
    this.clientSecret = EMAS_CONFIG.CLIENT_SECRET
    this.endpoint = EMAS_CONFIG.ENDPOINT
  }

  /**
   * 初始化EMAS Serverless
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // 动态导入EMAS SDK
      const { default: MPServerless } = await import(
        '@alicloud/mpserverless-sdk'
      )

      const config: any = {
        appId: this.appId,
        spaceId: this.spaceId,
        clientSecret: this.clientSecret,
        endpoint: this.endpoint || 'https://api.next.bspapp.com', // 确保endpoint不为空
      }

      // 正确的初始化方式：传递wx对象作为第一个参数
      this.mpServerless = new MPServerless(wx, config)

      // 初始化
      await this.mpServerless.init()
      this.initialized = true
      console.log('EMAS Serverless初始化成功')
    } catch (error) {
      console.error('EMAS Serverless初始化失败:', error)
      throw error
    }
  }

  /**
   * 调用云函数
   */
  async callFunction<T = any>(
    name: string,
    data: any = {}
  ): Promise<CloudFunctionResult<T>> {
    try {
      if (!this.initialized) {
        await this.init()
      }

      console.log(`调用EMAS云函数 ${name}，参数:`, data)

      // EMAS Serverless调用方式
      const result = await this.mpServerless.function.invoke(name, data)

      console.log(`EMAS云函数 ${name} 返回结果:`, result)
      return result.result
    } catch (error) {
      console.error(`调用EMAS云函数 ${name} 失败:`, error)
      throw error
    }
  }

  /**
   * 植物识别相关API
   */
  plantAPI = {
    /**
     * 识别植物
     */
    identifyPlant: async (imageData: string): Promise<PlantResult> => {
      try {
        const result = await this.callFunction('identifyPlant', {
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
    },
  }
}

// 导出单例实例
const emasClient = new EmasClient()
export default emasClient
