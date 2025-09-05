// EMAS Serverless配置
export interface EmasConfig {
  APP_ID: string
  SPACE_ID: string
  CLIENT_SECRET: string
  ENDPOINT?: string
}

// 从本地配置文件获取配置
function getEmasConfig(): EmasConfig {
  let localConfig: any = null
  try {
    const cloudLocalModule = require('./cloud.local.js')
    localConfig = cloudLocalModule.CLOUD_CONFIG
  } catch (error) {
    console.warn('未找到 cloud.local.js 配置文件，使用默认配置')
  }

  return {
    APP_ID: localConfig?.APP_ID || 'your_emas_app_id_here',
    SPACE_ID: localConfig?.SPACE_ID || 'your_emas_space_id_here',
    CLIENT_SECRET: localConfig?.CLIENT_SECRET || 'your_emas_client_secret_here',
    ENDPOINT: localConfig?.ENDPOINT || 'https://api.next.bspapp.com',
  }
}

export const EMAS_CONFIG = getEmasConfig()
