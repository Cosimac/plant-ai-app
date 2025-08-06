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
      // const userInfo = await cloud.userAPI.getUserInfo()
      // this.setState({ userInfo })
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
      // const recentData = await cloud.plantAPI.getHistory(5, 0, 'all')

      // this.setState({
      //   recentIdentifications: recentData,
      //   loading: false
      // })
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
    const { recentIdentifications, loading } = this.state

    return (
      <View className='index'>
        <View className='container'>
          {/* Hero区域 */}
          <View className='hero-section'>
            <View className='hero-content'>
              <View className='hero-decoration'>
                <Text className='decoration-emoji big'>🌺</Text>
                <Text className='decoration-emoji small left'>🌿</Text>
                <Text className='decoration-emoji small right'>🍃</Text>
              </View>
              <Text className='hero-title'>发现植物之美</Text>
              <Text className='hero-subtitle'>AI识别 · 一拍即知 · 学习自然</Text>
              
              {/* 主要操作按钮 */}
              <View className='main-action'>
                <View className='identify-btn' onClick={this.handleStartIdentify}>
                  <View className='btn-icon'>📷</View>
                  <Text className='btn-text'>开始识别</Text>
                  <View className='btn-shine'></View>
                </View>
              </View>
            </View>
          </View>

          {/* 快捷功能卡片 */}
          <View className='feature-cards'>
            <View className='card-row'>
              <View className='feature-card primary' onClick={this.handleStartIdentify}>
                <View className='card-icon'>📸</View>
                <Text className='card-title'>拍照识别</Text>
                <Text className='card-desc'>对准植物一键识别</Text>
              </View>
              <View className='feature-card secondary' onClick={this.handleViewHistory}>
                <View className='card-icon'>📚</View>
                <Text className='card-title'>识别历史</Text>
                <Text className='card-desc'>查看识别记录</Text>
              </View>
            </View>
            <View className='card-row'>
              <View className='feature-card tertiary'>
                <View className='card-icon'>⭐</View>
                <Text className='card-title'>我的收藏</Text>
                <Text className='card-desc'>收藏喜欢的植物</Text>
              </View>
              <View className='feature-card quaternary'>
                <View className='card-icon'>🎓</View>
                <Text className='card-title'>植物百科</Text>
                <Text className='card-desc'>学习植物知识</Text>
              </View>
            </View>
          </View>

          {/* 最近识别 */}
          <View className='recent-section'>
            <View className='section-header'>
              <View className='header-left'>
                <Text className='section-emoji'>🕐</Text>
                <Text className='section-title'>最近识别</Text>
              </View>
              <Text className='section-more' onClick={this.handleViewHistory}>查看全部</Text>
            </View>

            {loading ? (
              <View className='loading-state'>
                <View className='loading-icon'>🌱</View>
                <Text className='loading-text'>加载中...</Text>
              </View>
            ) : recentIdentifications.length > 0 ? (
              <View className='recent-list'>
                {recentIdentifications.map(item => (
                  <View key={item._id} className='recent-item'>
                    <View className='item-image'>
                      <Image src={item.image || 'https://via.placeholder.com/80x80'} className='plant-image' />
                    </View>
                    <View className='item-content'>
                      <Text className='plant-name'>{item.name}</Text>
                      <Text className='plant-accuracy'>准确率: {item.accuracy}</Text>
                      <Text className='plant-date'>{item.date}</Text>
                    </View>
                    <View className='item-action'>
                      <Text className='action-emoji'>➡️</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className='empty-state'>
                <View className='empty-illustration'>
                  <Text className='empty-emoji'>🌱</Text>
                  <View className='empty-dots'>
                    <View className='dot'></View>
                    <View className='dot'></View>
                    <View className='dot'></View>
                  </View>
                </View>
                <Text className='empty-title'>还没有识别记录</Text>
                <Text className='empty-subtitle'>快来识别你的第一株植物吧！</Text>
                <View className='empty-action' onClick={this.handleStartIdentify}>
                  <Text className='empty-btn-text'>立即开始 🚀</Text>
                </View>
              </View>
            )}
          </View>

          {/* 底部装饰 */}
          <View className='bottom-decoration'>
            <Text className='decoration-text'>让AI带你走进植物世界 🌍</Text>
          </View>
        </View>
      </View>
    )
  }
} 