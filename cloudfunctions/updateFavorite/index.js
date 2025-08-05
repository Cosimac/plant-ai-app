const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id, isFavorite } = event
  
  if (!id) {
    return {
      success: false,
      message: '缺少记录ID'
    }
  }
  
  try {
    const result = await db.collection('identifications')
      .where({
        _id: id,
        openid: wxContext.OPENID
      })
      .update({
        data: {
          isFavorite: isFavorite,
          updateTime: new Date()
        }
      })
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('更新收藏状态失败:', error)
    return {
      success: false,
      message: '更新收藏状态失败'
    }
  }
} 