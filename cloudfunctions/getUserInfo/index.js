const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 查询用户信息
    const userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    if (userResult.data.length > 0) {
      return {
        success: true,
        data: userResult.data[0]
      }
    } else {
      // 用户不存在，返回默认信息
      return {
        success: true,
        data: {
          openid: wxContext.OPENID,
          nickName: '微信用户',
          avatarUrl: '',
          createTime: new Date(),
          updateTime: new Date()
        }
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '获取用户信息失败'
    }
  }
} 