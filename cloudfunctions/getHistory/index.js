const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { limit = 20, offset = 0, type = 'all' } = event
  
  try {
    let query = db.collection('identifications')
      .where({
        openid: wxContext.OPENID
      })
    
    // 根据类型筛选
    if (type === 'favorites') {
      query = query.where({
        isFavorite: true
      })
    }
    
    const result = await query
      .orderBy('createTime', 'desc')
      .skip(offset)
      .limit(limit)
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return {
      success: false,
      message: '获取历史记录失败'
    }
  }
} 