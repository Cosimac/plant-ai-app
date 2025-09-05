// EMAS Serverless配置文件

// 检查是否存在本地配置文件
let cloudConfig: any = null

try {
  // 尝试导入本地配置文件（如果存在）
  const cloudLocalModule = require('./cloud.local.js')
  cloudConfig = cloudLocalModule.CLOUD_CONFIG
} catch (error) {
  // 如果本地配置文件不存在，使用默认配置
  console.warn(
    '未找到 cloud.local.js 配置文件，使用默认配置。请创建该文件并配置你的EMAS信息'
  )
}

export const CLOUD_CONFIG = {
  // EMAS Serverless配置
  APP_ID: cloudConfig?.APP_ID || 'your_app_id_here',
  SPACE_ID: cloudConfig?.SPACE_ID || 'your_space_id_here',
  CLIENT_SECRET: cloudConfig?.CLIENT_SECRET || 'your_client_secret_here',
  ENDPOINT: cloudConfig?.ENDPOINT || 'https://api.next.bspapp.com',
  NODE_ENV: cloudConfig?.NODE_ENV || 'development',
}
