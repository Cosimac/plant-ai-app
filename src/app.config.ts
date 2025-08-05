interface TabBarItem {
  pagePath: string;
  text: string;
  iconPath: string;
  selectedIconPath: string;
}

interface AppConfig {
  pages: string[];
  window: {
    backgroundTextStyle: string;
    navigationBarBackgroundColor: string;
    navigationBarTitleText: string;
    navigationBarTextStyle: string;
  };
  tabBar: {
    color: string;
    selectedColor: string;
    backgroundColor: string;
    borderStyle: string;
    list: TabBarItem[];
  };
  style: string;
  sitemapLocation: string;
}

const config: AppConfig = {
  pages: [
    'pages/index/index',
    'pages/identify/identify',
    'pages/history/history',
    'pages/profile/profile'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '花草识AI',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#07c160',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/identify/identify',
        text: '识别',
        iconPath: 'assets/icons/camera.png',
        selectedIconPath: 'assets/icons/camera-active.png'
      },
      {
        pagePath: 'pages/history/history',
        text: '历史',
        iconPath: 'assets/icons/history.png',
        selectedIconPath: 'assets/icons/history-active.png'
      },
      {
        pagePath: 'pages/profile/profile',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json'
}

export default config 