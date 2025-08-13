import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '../../utils/cloud'
import './index.scss'

interface State {
  loading: boolean;
}

export default class Index extends Component<{}, State> {
  state: State = {
    loading: false
  }

  componentDidMount(): void {
    // 初始化云开发
    cloud.init()
  }

  handleStartIdentify = (): void => {
    Taro.navigateTo({
      url: '/pages/identify/identify'
    })
  }

  handleAlbumSelect = (): void => {
    Taro.navigateTo({
      url: '/pages/identify/identify'
    })
  }

  handleCategory = (): void => {
    Taro.showToast({
      title: '分类功能开发中',
      icon: 'none'
    })
  }

  render(): React.ReactNode {
    return (
      <View className='index'>
        {/* 顶部导航栏 */}
        <View className='top-nav'>
          <View className='nav-left'>
            <View className='logo'>
              <View className='logo-icon'>
                <Text className='logo-text'>Q</Text>
              </View>
            </View>
          </View>
          <View className='nav-center'>
            <Text className='app-title'>小植识</Text>
          </View>
          <View className='nav-right'>
            <View className='nav-separator'></View>
            <View className='history-btn'>
              <AtIcon value='clock' size='20' color='#666' />
              <Text className='history-text'>历史</Text>
            </View>
          </View>
        </View>

        {/* 主内容区域 */}
        <View className='main-content'>
          <View className='content-card'>
            {/* 装饰性叶子图片 */}
            <View className='leaf-decoration'>
              <View className='leaf large'>
                <Image 
                  src='https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=100&h=100&fit=crop&crop=center' 
                  className='leaf-image large'
                  mode='aspectFit'
                />
              </View>
              <View className='leaf small'>
                <Image 
                  src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop&crop=center' 
                  className='leaf-image small'
                  mode='aspectFit'
                />
              </View>
            </View>
            
            {/* 提示文字 */}
            <View className='instruction-text'>
              <Text>点击底部按钮拍植物~</Text>
            </View>
          </View>
        </View>

        {/* 底部操作按钮 */}
        <View className='bottom-actions'>
          <AtButton 
            className='action-btn album-btn'
            onClick={this.handleAlbumSelect}
          >
            相册
          </AtButton>
          
          <View 
            className='main-action-btn' 
            onClick={this.handleStartIdentify}
          >
            <AtIcon value='camera' size='30' color='white' />
          </View>
          
          <AtButton 
            className='action-btn category-btn'
            onClick={this.handleCategory}
          >
            分类
          </AtButton>
        </View>

        {/* 底部装饰 */}
        <View className='footer-decoration'>
          <View className='grass-pattern'></View>
          <View className='person-silhouette'></View>
          <Text className='ai-credit'>豆包AI生成</Text>
        </View>
      </View>
    )
  }
} 