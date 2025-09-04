// 云开发配置文件
// 注意：此文件包含敏感信息，请勿提交到版本控制

// 检查是否存在本地配置文件
let cloudConfig: any = null

try {
  // 尝试导入本地配置文件（如果存在）
  const cloudLocalModule = require('./cloud.local.js')
  cloudConfig = cloudLocalModule.CLOUD_CONFIG
} catch (error) {
  // 如果本地配置文件不存在，使用默认配置
  console.warn('未找到 cloud.local.js 配置文件，使用默认配置。请创建该文件并配置你的云环境ID')
}

export const CLOUD_CONFIG = {
  // 云开发环境ID
  ENV_ID: cloudConfig?.ENV_ID || 'your_cloud_env_id_here'
}
