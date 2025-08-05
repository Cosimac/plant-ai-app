import { CloudUtils, UserInfo, IdentificationRecord, IdentificationResult, DatabaseResult, CloudFunctionResult } from '../../types/global'

// 腾讯云开发配置
const cloud: CloudUtils = {
  // 云开发环境ID
  envId: 'your-env-id',
  
  // 初始化云开发
  init() {
    if (typeof wx !== 'undefined') {
      wx.cloud.init({
        env: this.envId,
        traceUser: true
      })
    }
  },

  // 调用云函数
  callFunction<T = any>(name: string, data: any = {}): Promise<CloudFunctionResult<T>> {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name,
        data,
        success: resolve,
        fail: reject
      })
    })
  },

  // 上传文件
  uploadFile(filePath: string, cloudPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: resolve,
        fail: reject
      })
    })
  },

  // 获取数据库引用
  database() {
    return wx.cloud.database()
  },

  // 植物识别相关API
  plantAPI: {
    // 识别植物
    async identifyPlant(imageUrl: string): Promise<IdentificationResult> {
      try {
        const result = await cloud.callFunction('identifyPlant', {
          imageUrl
        })
        return result.result
      } catch (error) {
        console.error('植物识别失败:', error)
        throw error
      }
    },

    // 保存识别记录
    async saveRecord(record: Partial<IdentificationRecord>): Promise<DatabaseResult> {
      try {
        const db = cloud.database()
        const result = await db.collection('identifications').add({
          data: {
            ...record,
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        return result
      } catch (error) {
        console.error('保存记录失败:', error)
        throw error
      }
    },

    // 获取识别历史
    async getHistory(limit: number = 20, offset: number = 0): Promise<IdentificationRecord[]> {
      try {
        const db = cloud.database()
        const result = await db.collection('identifications')
          .orderBy('createTime', 'desc')
          .skip(offset)
          .limit(limit)
          .get()
        return result.data
      } catch (error) {
        console.error('获取历史记录失败:', error)
        throw error
      }
    },

    // 更新收藏状态
    async updateFavorite(id: string, isFavorite: boolean): Promise<any> {
      try {
        const db = cloud.database()
        const result = await db.collection('identifications')
          .doc(id)
          .update({
            data: {
              isFavorite,
              updateTime: new Date()
            }
          })
        return result
      } catch (error) {
        console.error('更新收藏状态失败:', error)
        throw error
      }
    },

    // 删除记录
    async deleteRecord(id: string): Promise<any> {
      try {
        const db = cloud.database()
        const result = await db.collection('identifications')
          .doc(id)
          .remove()
        return result
      } catch (error) {
        console.error('删除记录失败:', error)
        throw error
      }
    }
  },

  // 用户相关API
  userAPI: {
    // 获取用户信息
    async getUserInfo(): Promise<UserInfo> {
      try {
        const result = await cloud.callFunction('getUserInfo')
        return result.result
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo: UserInfo): Promise<DatabaseResult> {
      try {
        const db = cloud.database()
        const result = await db.collection('users').add({
          data: {
            ...userInfo,
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        return result
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    }
  }
}

export default cloud 