import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem, AtIcon, AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import { UserInfo, Statistics } from '../../../types/global'
import './profile.scss'

interface State {
  userInfo: UserInfo | null;
  statistics: Statistics;
}

export default class Profile extends Component<{}, State> {
  state: State = {
    userInfo: null,
    statistics: {
      totalIdentifications: 0,
      totalFavorites: 0,
      accuracyRate: '0%'
    }
  }

  componentDidMount() {
    this.getUserInfo()
    this.loadStatistics()
  }

  getUserInfo() {
    // 获取用户信息
    Taro.getUserInfo({
      success: (res) => {
        this.setState({
          userInfo: res.userInfo
        })
      }
    })
  }

  loadStatistics() {
    // 模拟加载统计数据
    this.setState({
      statistics: {
        totalIdentifications: 25,
        totalFavorites: 8,
        accuracyRate: '92%'
      }
    })
  }

  handleLogin = () => {
    Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setState({
          userInfo: res.userInfo
        })
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  }

  handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setState({
            userInfo: null
          })
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }

  handleNavigate = (url: string) => {
    Taro.navigateTo({ url })
  }

  handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }

  handleFeedback = () => {
    Taro.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系我们：\n邮箱：feedback@plantai.com\n微信：plantai_support',
      showCancel: false
    })
  }

  handleAbout = () => {
    Taro.showModal({
      title: '关于花草识AI',
      content: '版本：1.0.0\n\n花草识AI是一款基于人工智能的植物识别小程序，帮助用户快速识别各种植物，了解植物知识。\n\n技术支持：腾讯云开发',
      showCancel: false
    })
  }

  render() {
    const { userInfo, statistics } = this.state

    return (
      <View className='profile'>
        <View className='container'>
          {/* 用户信息区域 */}
          <View className='user-section'>
            <View className='user-header'>
              {userInfo ? (
                <View className='user-info'>
                  <AtAvatar 
                    image={userInfo.avatarUrl} 
                    size='large'
                    className='user-avatar'
                  />
                  <View className='user-details'>
                    <Text className='user-name'>{userInfo.nickName}</Text>
                    <Text className='user-desc'>植物识别爱好者</Text>
                  </View>
                </View>
              ) : (
                <View className='user-info'>
                  <AtAvatar 
                    size='large'
                    className='user-avatar'
                  >
                    <AtIcon value='user' size='30' color='#07c160' />
                  </AtAvatar>
                  <View className='user-details'>
                    <Text className='user-name'>未登录</Text>
                    <Text className='user-desc'>点击登录获取更多功能</Text>
                  </View>
                </View>
              )}
            </View>

            {/* 统计数据 */}
            <View className='statistics'>
              <View className='stat-item'>
                <Text className='stat-number'>{statistics.totalIdentifications}</Text>
                <Text className='stat-label'>识别次数</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-number'>{statistics.totalFavorites}</Text>
                <Text className='stat-label'>收藏数量</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-number'>{statistics.accuracyRate}</Text>
                <Text className='stat-label'>准确率</Text>
              </View>
            </View>

            {/* 登录/退出按钮 */}
            <View className='auth-section'>
              {userInfo ? (
                <AtButton 
                  type='secondary' 
                  size='normal'
                  onClick={this.handleLogout}
                >
                  退出登录
                </AtButton>
              ) : (
                <AtButton 
                  type='primary' 
                  size='normal'
                  onClick={this.handleLogin}
                >
                  立即登录
                </AtButton>
              )}
            </View>
          </View>

          {/* 功能菜单 */}
          <View className='menu-section'>
            <AtList>
              <AtListItem
                title='使用帮助'
                arrow='right'
                iconInfo={{
                  value: 'help',
                  color: '#07c160'
                }}
                onClick={() => this.handleNavigate('/pages/help/help')}
              />
              <AtListItem
                title='分享给朋友'
                arrow='right'
                iconInfo={{
                  value: 'share',
                  color: '#07c160'
                }}
                onClick={this.handleShare}
              />
              <AtListItem
                title='意见反馈'
                arrow='right'
                iconInfo={{
                  value: 'message',
                  color: '#07c160'
                }}
                onClick={this.handleFeedback}
              />
              <AtListItem
                title='关于我们'
                arrow='right'
                iconInfo={{
                  value: 'info',
                  color: '#07c160'
                }}
                onClick={this.handleAbout}
              />
            </AtList>
          </View>

          {/* 版本信息 */}
          <View className='version-section'>
            <Text className='version-text'>版本 1.0.0</Text>
            <Text className='copyright-text'>© 2024 花草识AI. All rights reserved.</Text>
          </View>
        </View>
      </View>
    )
  }
} 