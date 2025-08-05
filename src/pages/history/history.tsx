import { Component } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtCard, AtIcon, AtButton, AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '../../utils/cloud'
import './history.scss'

interface HistoryItem {
  _id: string;
  name: string;
  scientificName: string;
  image: string;
  date: string;
  accuracy: string;
  isFavorite: boolean;
  result: any;
  createTime: Date;
  updateTime: Date;
}

interface State {
  searchValue: string;
  currentTab: number;
  historyList: HistoryItem[];
  favoritesList: HistoryItem[];
  loading: boolean;
}

export default class History extends Component<{}, State> {
  state: State = {
    searchValue: '',
    currentTab: 0,
    historyList: [],
    favoritesList: [],
    loading: false
  }

  componentDidMount(): void {
    // 初始化云开发
    cloud.init()
    this.loadHistoryData()
  }

  loadHistoryData = async (): Promise<void> => {
    this.setState({ loading: true })
    
    try {
      // 获取所有历史记录
      const allHistory = await cloud.plantAPI.getHistory(50, 0, 'all')
      
      // 获取收藏记录
      const favorites = await cloud.plantAPI.getHistory(50, 0, 'favorites')
      
      this.setState({
        historyList: allHistory,
        favoritesList: favorites,
        loading: false
      })
    } catch (error) {
      console.error('加载历史数据失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setState({ loading: false })
    }
  }

  handleSearchChange = (value: string): void => {
    this.setState({ searchValue: value })
  }

  handleTabChange = (value: number): void => {
    this.setState({ currentTab: value })
  }

  handleToggleFavorite = async (itemId: string): Promise<void> => {
    const { historyList, favoritesList } = this.state
    const item = historyList.find(item => item._id === itemId)
    
    if (!item) return
    
    try {
      await cloud.plantAPI.updateFavorite(itemId, !item.isFavorite)
      
      // 更新本地状态
      const updatedHistory = historyList.map(item => {
        if (item._id === itemId) {
          return { ...item, isFavorite: !item.isFavorite }
        }
        return item
      })

      const updatedFavorites = updatedHistory.filter(item => item.isFavorite)

      this.setState({
        historyList: updatedHistory,
        favoritesList: updatedFavorites
      })

      Taro.showToast({
        title: '收藏状态已更新',
        icon: 'success'
      })
    } catch (error) {
      console.error('更新收藏状态失败:', error)
      Taro.showToast({
        title: '更新失败',
        icon: 'none'
      })
    }
  }

  handleViewDetail = (item: HistoryItem): void => {
    Taro.navigateTo({
      url: `/pages/detail/detail?id=${item._id}`
    })
  }

  handleDeleteItem = async (itemId: string): Promise<void> => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条识别记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cloud.plantAPI.deleteRecord(itemId)
            
            const { historyList, favoritesList } = this.state
            const updatedHistory = historyList.filter(item => item._id !== itemId)
            const updatedFavorites = favoritesList.filter(item => item._id !== itemId)

            this.setState({
              historyList: updatedHistory,
              favoritesList: updatedFavorites
            })

            Taro.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } catch (error) {
            console.error('删除记录失败:', error)
            Taro.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  renderHistoryItem = (item: HistoryItem): React.ReactNode => {
    return (
      <AtCard
        key={item._id}
        className='history-item'
        title={item.name}
        extra={`准确率: ${item.accuracy}`}
      >
        <View className='history-content'>
          <Image src={item.image || 'https://via.placeholder.com/80x80'} className='history-image' />
          <View className='history-info'>
            <Text className='history-scientific'>{item.scientificName}</Text>
            <Text className='history-date'>{item.date}</Text>
          </View>
          <View className='history-actions'>
            <AtButton 
              size='small' 
              className='action-btn'
              onClick={() => this.handleViewDetail(item)}
            >
              详情
            </AtButton>
            <AtButton 
              size='small' 
              type={item.isFavorite ? 'primary' : 'secondary'}
              className='action-btn'
              onClick={() => this.handleToggleFavorite(item._id)}
            >
              {item.isFavorite ? '取消收藏' : '收藏'}
            </AtButton>
            <AtButton 
              size='small' 
              type='secondary'
              className='action-btn delete-btn'
              onClick={() => this.handleDeleteItem(item._id)}
            >
              删除
            </AtButton>
          </View>
        </View>
      </AtCard>
    )
  }

  render(): React.ReactNode {
    const { searchValue, currentTab, historyList, favoritesList, loading } = this.state

    const filteredHistory = historyList.filter(item => 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchValue.toLowerCase())
    )

    const filteredFavorites = favoritesList.filter(item => 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchValue.toLowerCase())
    )

    const tabList = [
      { title: `全部记录 (${filteredHistory.length})` },
      { title: `收藏夹 (${filteredFavorites.length})` }
    ]

    return (
      <View className='history'>
        <View className='container'>
          {/* 搜索栏 */}
          <View className='search-section'>
            <AtSearchBar
              value={searchValue}
              onChange={this.handleSearchChange}
              placeholder='搜索植物名称'
              className='search-bar'
            />
          </View>

          {/* 标签页 */}
          <View className='tabs-section'>
            <AtTabs
              current={currentTab}
              tabList={tabList}
              onClick={this.handleTabChange}
            >
              <AtTabsPane current={currentTab} index={0}>
                <ScrollView className='history-list' scrollY>
                  {loading ? (
                    <View className='loading-state'>
                      <AtIcon value='loading' size='30' color='#07c160' />
                      <Text className='loading-text'>加载中...</Text>
                    </View>
                  ) : filteredHistory.length > 0 ? (
                    filteredHistory.map(item => this.renderHistoryItem(item))
                  ) : (
                    <View className='empty-state'>
                      <AtIcon value='list' size='50' color='#ccc' />
                      <Text className='empty-text'>暂无识别记录</Text>
                      <Text className='empty-subtext'>开始您的第一次植物识别吧</Text>
                    </View>
                  )}
                </ScrollView>
              </AtTabsPane>
              
              <AtTabsPane current={currentTab} index={1}>
                <ScrollView className='history-list' scrollY>
                  {loading ? (
                    <View className='loading-state'>
                      <AtIcon value='loading' size='30' color='#07c160' />
                      <Text className='loading-text'>加载中...</Text>
                    </View>
                  ) : filteredFavorites.length > 0 ? (
                    filteredFavorites.map(item => this.renderHistoryItem(item))
                  ) : (
                    <View className='empty-state'>
                      <AtIcon value='star' size='50' color='#ccc' />
                      <Text className='empty-text'>暂无收藏记录</Text>
                      <Text className='empty-subtext'>收藏您喜欢的植物吧</Text>
                    </View>
                  )}
                </ScrollView>
              </AtTabsPane>
            </AtTabs>
          </View>
        </View>
      </View>
    )
  }
} 