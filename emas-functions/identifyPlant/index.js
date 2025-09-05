// EMAS Serverless 植物识别云函数
const axios = require('axios');

/**
 * 百度AI配置
 * 推荐方案：直接在云函数中配置，避免网络传输安全风险
 * 
 * 配置步骤：
 * 1. 访问 https://ai.baidu.com/ 获取API密钥
 * 2. 将下面的占位符替换为您的真实密钥
 * 3. 重新打包上传云函数
 */
const BAIDU_CONFIG = {
  // 开发环境配置
  development: {
    API_KEY: 'Dt6l1NcsT8Djr8q5RUnMU7U4',
    SECRET_KEY: 'mu2ROERA3DPMhIIOpl7vqOxVeIEkGSMm',
    PLANT_API_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant'
  },
  
  // 生产环境配置
  production: {
    API_KEY: 'Dt6l1NcsT8Djr8q5RUnMU7U4',
    SECRET_KEY: 'mu2ROERA3DPMhIIOpl7vqOxVeIEkGSMm', 
    PLANT_API_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant'
  }
};

/**
 * 根据EMAS环境参数自动选择配置
 */
function getEnvironmentConfig (ctx) {
  // 默认使用开发环境
  let env = 'development';

  // 根据EMAS环境参数判断环境
  if (ctx && ctx.env) {
    const spaceId = ctx.env.MP_SPACE_ID || '';
    // 如果SpaceId包含prod，使用生产环境配置
    if (spaceId.toLowerCase().includes('prod')) {
      env = 'production';
    }
  }

  const config = BAIDU_CONFIG[env];

  // 验证配置
  if (!config.API_KEY || config.API_KEY.includes('your_')) {
    throw new Error(`请在云函数代码中配置 ${env} 环境的百度API Key`);
  }

  if (!config.SECRET_KEY || config.SECRET_KEY.includes('your_')) {
    throw new Error(`请在云函数代码中配置 ${env} 环境的百度Secret Key`);
  }

  return config;
}

/**
 * 获取百度AI访问令牌
 */
async function getBaiduAccessToken (config) {
  try {
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.API_KEY}&client_secret=${config.SECRET_KEY}`;
    const response = await axios.get(tokenUrl);
    
    if (!response.data.access_token) {
      throw new Error(`百度API返回错误: ${JSON.stringify(response.data)}`);
    }
    
    return response.data.access_token;
  } catch (error) {
    console.error('获取百度访问令牌失败:', error.message);
    if (error.response) {
      console.error('百度API错误响应:', error.response.data);
      throw new Error(`获取访问令牌失败: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`获取访问令牌失败: ${error.message}`);
  }
}

/**
 * 处理图片数据，提取base64编码
 */
function getImageBase64 (imageData) {
  try {
    let base64Image;

    // 直接使用base64数据
    if (imageData.startsWith('data:image/')) {
      base64Image = imageData.split(',')[1];
    } else {
      base64Image = imageData;
    }

    return base64Image;
  } catch (error) {
    console.error('处理图片数据失败:', error);
    throw new Error(`图片数据处理失败: ${error.message}`);
  }
}

/**
 * 植物识别核心函数
 */
async function identifyPlant (imageData, config) {
  try {
    // 获取访问令牌
    const accessToken = await getBaiduAccessToken(config);

    // 处理图片数据
    const base64Image = getImageBase64(imageData);

    // 调用百度植物识别API
    const response = await axios.post(
      `${config.PLANT_API_URL}?access_token=${accessToken}`,
      `image=${encodeURIComponent(base64Image)}&baike_num=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const result = response.data;

    if (result.error_code) {
      throw new Error(`百度API错误: ${result.error_msg}`);
    }

    // 处理识别结果
    const plants = result.result || [];
    if (plants.length === 0) {
      return {
        success: false,
        message: '未能识别出植物，请尝试拍摄更清晰的图片'
      };
    }

    const bestMatch = plants[0];
    const accuracy = Math.round(bestMatch.score * 100);

    return {
      success: true,
      data: {
        name: bestMatch.name,
        scientificName: bestMatch.baike_info?.description || '未知',
        family: bestMatch.baike_info?.description || '未知',
        accuracy: `${accuracy}%`,
        description: bestMatch.baike_info?.description || '暂无描述',
        characteristics: [
          `置信度: ${accuracy}%`,
          `植物名称: ${bestMatch.name}`,
          bestMatch.baike_info?.description ? `描述: ${bestMatch.baike_info.description}` : ''
        ].filter(item => item),
        careTips: [
          '建议在光线充足的环境下拍摄',
          '确保植物在画面中清晰可见',
          '识别结果仅供参考，请以实际情况为准'
        ],
        baikeInfo: bestMatch.baike_info || null,
        allResults: plants.slice(0, 5) // 返回前5个结果
      }
    };
  } catch (error) {
    console.error('植物识别失败:', error);
    return {
      success: false,
      message: error.message || '识别失败，请稍后重试'
    };
  }
}

/**
 * EMAS Serverless 云函数入口
 * 推荐方案：直接在云函数中配置百度API密钥，避免网络传输安全风险
 */
module.exports = async (ctx) => {
  try {
    // 根据EMAS环境参数自动获取配置
    const config = getEnvironmentConfig(ctx);
    
    // EMAS Serverless参数获取方式
    const args = ctx.args || ctx;
    const { imageUrl, imageData, image } = args;
    const imageInput = imageData || imageUrl || image;

    if (!imageInput) {
      return {
        success: false,
        message: '缺少图片数据参数'
      };
    }
    
    // 执行植物识别
    const result = await identifyPlant(imageInput, config);
    return result;
  } catch (error) {
    console.error('云函数执行失败:', error.message);
    return {
      success: false,
      message: '服务器内部错误，请稍后重试'
    };
  }
};
