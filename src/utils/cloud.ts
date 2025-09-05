// 声明全局 wx 对象
declare const wx: any

// 导入EMAS Serverless客户端
import emasClient from './emas'

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

// EMAS Serverless配置
const cloud = {
  // 初始化EMAS Serverless
  async init() {
    try {
      await emasClient.init();
      console.log('EMAS Serverless已准备就绪');
    } catch (error) {
      console.error('EMAS Serverless初始化失败:', error);
    }
  },

  // 调用云函数
  async callFunction<T = any>(
    name: string,
    data: any = {}
  ): Promise<CloudFunctionResult<T>> {
    try {
      const result = await emasClient.callFunction(name, data);
      return result;
    } catch (error) {
      console.error(`调用EMAS云函数 ${name} 失败:`, error);
      throw error;
    }
  },

  // 植物识别相关API
  plantAPI: {
    // 识别植物
    async identifyPlant(imageData: string): Promise<PlantResult> {
      try {
        const result = await emasClient.plantAPI.identifyPlant(imageData);
        return result;
      } catch (error) {
        console.error('植物识别失败:', error);
        throw error;
      }
    }
  }
}

export default cloud