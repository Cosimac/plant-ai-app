interface AppConfig {
  pages: string[]
  window: {
    backgroundTextStyle: 'light' | 'dark'
    navigationBarBackgroundColor: string
    navigationBarTitleText: string
    navigationBarTextStyle: 'black' | 'white'
    navigationStyle?: string
    backgroundColor?: string
    enablePullDownRefresh?: boolean
  }
  style: string
  sitemapLocation: string
}

const config: AppConfig = {
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#000',
    navigationBarTitleText: '花草识',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
    backgroundColor: '#f5f5f5',
    // enablePullDownRefresh: true,
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
}

export default config
