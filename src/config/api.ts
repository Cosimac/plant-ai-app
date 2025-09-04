// API配置文件

// 百度AI配置
// 注意：API密钥和Secret密钥在云函数中管理，这里只配置公开信息
export const BAIDU_CONFIG = {
  PLANT_API_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant'
}

// 应用配置
export const APP_CONFIG = {
  NAME: '花草识AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI智能识别，让植物知识触手可及'
} 