const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id } = event
  
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
      .remove()
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('删除记录失败:', error)
    return {
      success: false,
      message: '删除记录失败'
    }
  }
} 