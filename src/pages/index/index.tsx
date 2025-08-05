import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtCard, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import './index.scss'

interface UserInfo {
  avatarUrl: string;
  nickName: string;
}

interface IdentificationItem {
  id: string;
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
}

export default class Index extends Component<{}, State> {
  state: State = {
    userInfo: null,
    recentIdentifications: []
  }

  componentDidMount(): void {
    this.getUserInfo()
    this.loadRecentIdentifications()
  }

  getUserInfo(): void {
    // 获取用户信息
    Taro.getUserInfo({
      success: (res) => {
        this.setState({
          userInfo: res.userInfo
        })
      }
    })
  }

  loadRecentIdentifications(): void {
    // 模拟加载最近的识别记录
    const mockData: IdentificationItem[] = [
      {
        id: '1',
        name: '月季花',
        scientificName: 'Rosa chinensis',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-15',
        accuracy: '95%',
        isFavorite: false
      },
      {
        id: '2',
        name: '向日葵',
        scientificName: 'Helianthus annuus',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-14',
        accuracy: '92%',
        isFavorite: false
      }
    ]
    this.setState({
      recentIdentifications: mockData
    })
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
    const { userInfo, recentIdentifications } = this.state

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
                  <Image src={userInfo.avatarUrl} className='avatar' />
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
              size='large'
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

            {recentIdentifications.length > 0 ? (
              <View className='recent-list'>
                {recentIdentifications.map(item => (
                  <AtCard
                    key={item.id}
                    className='recent-item'
                    title={item.name}
                    extra={`准确率: ${item.accuracy}`}
                  >
                    <View className='recent-content'>
                      <Image src={item.image} className='recent-image' />
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