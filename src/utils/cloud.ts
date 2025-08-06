import Taro from '@tarojs/taro'

// 声明全局 wx 对象
declare const wx: any

// 类型定义
interface UserInfo {
  openid: string
  nickName: string
  avatarUrl: string
  createTime: Date
  updateTime: Date
}

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

interface IdentificationRecord {
  _id: string
  openid: string
  name: string
  scientificName: string
  image: string
  date: string
  accuracy: string
  isFavorite: boolean
  result: PlantResult
  createTime: Date
  updateTime: Date
}

interface CloudFunctionResult<T = any> {
  success: boolean
  data?: T
  message?: string
}

interface DatabaseResult {
  _id: string
  errMsg: string
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

  // 获取数据库引用
  database() {
    return wx.cloud.database()
  },

  // 植物识别相关API
  plantAPI: {
    // 识别植物
    async identifyPlant(imageUrl: string): Promise<PlantResult> {
      try {
        const result = await cloud.callFunction('identifyPlant', {
          imageUrl,
        })
        console.log('result :', result)
        if (!result.success) {
          throw new Error(result.message || '识别失败')
        }

        return result.data
      } catch (error) {
        console.error('植物识别失败:', error)
        throw error
      }
    },

    // 保存识别记录
    async saveRecord(
      record: Partial<IdentificationRecord>
    ): Promise<DatabaseResult> {
      try {
        const result = await cloud.callFunction('saveRecord', {
          record,
        })

        if (!result.success) {
          throw new Error(result.message || '保存失败')
        }

        return result.data
      } catch (error) {
        console.error('保存记录失败:', error)
        throw error
      }
    },

    // 获取识别历史
    async getHistory(
      limit: number = 20,
      offset: number = 0,
      type: 'all' | 'favorites' = 'all'
    ): Promise<IdentificationRecord[]> {
      try {
        const result = await cloud.callFunction('getHistory', {
          limit,
          offset,
          type,
        })

        if (!result.success) {
          throw new Error(result.message || '获取历史记录失败')
        }

        return result.data
      } catch (error) {
        console.error('获取历史记录失败:', error)
        throw error
      }
    },

    // 更新收藏状态
    async updateFavorite(id: string, isFavorite: boolean): Promise<any> {
      try {
        const result = await cloud.callFunction('updateFavorite', {
          id,
          isFavorite,
        })

        if (!result.success) {
          throw new Error(result.message || '更新收藏状态失败')
        }

        return result.data
      } catch (error) {
        console.error('更新收藏状态失败:', error)
        throw error
      }
    },

    // 删除记录
    async deleteRecord(id: string): Promise<any> {
      try {
        const result = await cloud.callFunction('deleteRecord', {
          id,
        })

        if (!result.success) {
          throw new Error(result.message || '删除记录失败')
        }

        return result.data
      } catch (error) {
        console.error('删除记录失败:', error)
        throw error
      }
    },
  },

  // 用户相关API
  userAPI: {
    // 获取用户信息
    async getUserInfo(): Promise<UserInfo> {
      try {
        const result = await cloud.callFunction('getUserInfo')
        console.log('result :', result)

        if (!result.success) {
          throw new Error(result.message || '获取用户信息失败')
        }

        return result.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo: Partial<UserInfo>): Promise<DatabaseResult> {
      try {
        const db = cloud.database()
        const result = await db.collection('users').add({
          data: {
            ...userInfo,
            createTime: new Date(),
            updateTime: new Date(),
          },
        })
        return result
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    },
  },
}

export default cloud
