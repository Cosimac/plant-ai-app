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
  pages: ['pages/index/index', 'pages/identify/identify'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4CAF50',
    navigationBarTitleText: '小植识',
    navigationBarTextStyle: 'white',
    navigationStyle: 'custom',
    backgroundColor: '#f5f5f5',
    // enablePullDownRefresh: true,
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
}

export default config
