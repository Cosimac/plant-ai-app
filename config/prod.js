module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {
    webpackChain(chain) {
      // 启用代码分割
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'all'
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true
          }
        }
      })
      
      // 设置性能预算
      chain.performance
        .maxAssetSize(500000) // 500KB
        .maxEntrypointSize(500000) // 500KB
    }
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考文档：https://taro-docs.jd.com/docs/optimize
     */
    webpackChain(chain) {
      /**
       * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
       * 参考文档：https://taro-docs.jd.com/docs/optimize
       */
    }
  }
} 