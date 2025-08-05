const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { record } = event
  
  if (!record) {
    return {
      success: false,
      message: '缺少记录数据'
    }
  }
  
  try {
    const result = await db.collection('identifications').add({
      data: {
        ...record,
        openid: wxContext.OPENID,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('保存记录失败:', error)
    return {
      success: false,
      message: '保存记录失败'
    }
  }
} 