const path = require('path')
const config = {
  projectName: 'plant-ai-app',
  date: '2024-1-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,        // 启用px自动转换
        config: {
          selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
          mediaQuery: false,  // 是否转换媒体查询中的px
          minPixelValue: 1    // 最小转换数值
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static'
  },
  typescript: {
    enableTypeChecking: true
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
} 