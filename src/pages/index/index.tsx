import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtCard, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '../../utils/cloud'
import './index.scss'

interface UserInfo {
  openid: string;
  nickName: string;
  avatarUrl: string;
  createTime: Date;
  updateTime: Date;
}

interface IdentificationItem {
  _id: string;
  name: string;
  scientificName: string;
  image: string;
  date: string;
  accuracy: string;
  isFavorite: boolean;
}

interface State {
  userInfo: UserInfo | null;
  recentIdentifications: IdentificationItem[];
  loading: boolean;
}

export default class Index extends Component<{}, State> {
  state: State = {
    userInfo: null,
    recentIdentifications: [],
    loading: false
  }

  componentDidMount(): void {
    // 初始化云开发
    cloud.init()
    this.getUserInfo()
    this.loadRecentIdentifications()
  }

  getUserInfo = async (): Promise<void> => {
    try {
      const userInfo = await cloud.userAPI.getUserInfo()
      this.setState({ userInfo })
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取失败，使用默认用户信息
      this.setState({
        userInfo: {
          openid: '',
          nickName: '微信用户',
          avatarUrl: '',
          createTime: new Date(),
          updateTime: new Date()
        }
      })
    }
  }

  loadRecentIdentifications = async (): Promise<void> => {
    this.setState({ loading: true })
    
    try {
      // 获取最近的识别记录
      const recentData = await cloud.plantAPI.getHistory(5, 0, 'all')
      
      this.setState({
        recentIdentifications: recentData,
        loading: false
      })
    } catch (error) {
      console.error('加载最近识别记录失败:', error)
      this.setState({ loading: false })
    }
  }

  handleStartIdentify = (): void => {
    Taro.navigateTo({
      url: '/pages/identify/identify'
    })
  }

  handleViewHistory = (): void => {
    Taro.switchTab({
      url: '/pages/history/history'
    })
  }

  render(): React.ReactNode {
    const { userInfo, recentIdentifications, loading } = this.state

    return (
      <View className='index'>
        <View className='container'>
          {/* 欢迎区域 */}
          <View className='welcome-section'>
            <View className='welcome-header'>
              <Text className='welcome-title'>欢迎使用花草识AI</Text>
              <Text className='welcome-subtitle'>AI智能识别，让植物知识触手可及</Text>
            </View>
            <View className='user-info'>
              {userInfo ? (
                <View className='user-avatar'>
                  <Image src={userInfo.avatarUrl || 'https://via.placeholder.com/60x60'} className='avatar' />
                  <Text className='username'>{userInfo.nickName}</Text>
                </View>
              ) : (
                <View className='user-avatar'>
                  <AtIcon value='user' size='30' color='#07c160' />
                  <Text className='username'>未登录</Text>
                </View>
              )}
            </View>
          </View>

          {/* 功能区域 */}
          <View className='feature-section'>
            <AtButton 
              type='primary' 
              size='normal'
              className='identify-btn'
              onClick={this.handleStartIdentify}
            >
              <AtIcon value='camera' size='20' />
              开始识别
            </AtButton>
            
            <View className='feature-grid'>
              <View className='feature-item' onClick={this.handleStartIdentify}>
                <AtIcon value='camera' size='30' color='#07c160' />
                <Text className='feature-text'>拍照识别</Text>
              </View>
              <View className='feature-item' onClick={this.handleViewHistory}>
                <AtIcon value='list' size='30' color='#07c160' />
                <Text className='feature-text'>识别历史</Text>
              </View>
              <View className='feature-item'>
                <AtIcon value='star' size='30' color='#07c160' />
                <Text className='feature-text'>收藏夹</Text>
              </View>
              <View className='feature-item'>
                <AtIcon value='help' size='30' color='#07c160' />
                <Text className='feature-text'>使用帮助</Text>
              </View>
            </View>
          </View>

          {/* 最近识别 */}
          <View className='recent-section'>
            <View className='section-header'>
              <Text className='section-title'>最近识别</Text>
              <Text className='section-more' onClick={this.handleViewHistory}>查看更多</Text>
            </View>
            
            {loading ? (
              <View className='loading-state'>
                <AtIcon value='loading' size='30' color='#07c160' />
                <Text className='loading-text'>加载中...</Text>
              </View>
            ) : recentIdentifications.length > 0 ? (
              <View className='recent-list'>
                {recentIdentifications.map(item => (
                  <AtCard
                    key={item._id}
                    className='recent-item'
                    title={item.name}
                    extra={`准确率: ${item.accuracy}`}
                  >
                    <View className='recent-content'>
                      <Image src={item.image || 'https://via.placeholder.com/80x80'} className='recent-image' />
                      <View className='recent-info'>
                        <Text className='recent-name'>{item.name}</Text>
                        <Text className='recent-date'>{item.date}</Text>
                      </View>
                    </View>
                  </AtCard>
                ))}
              </View>
            ) : (
              <View className='empty-state'>
                <AtIcon value='camera' size='50' color='#ccc' />
                <Text className='empty-text'>暂无识别记录</Text>
                <Text className='empty-subtext'>开始您的第一次植物识别吧</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
} 