import { Component } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtCard, AtIcon, AtButton, AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import Taro from '@tarojs/taro'
import './history.scss'

interface HistoryItem {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  date: string;
  accuracy: string;
  isFavorite: boolean;
}

interface State {
  searchValue: string;
  currentTab: number;
  historyList: HistoryItem[];
  favoritesList: HistoryItem[];
}

export default class History extends Component<{}, State> {
  state: State = {
    searchValue: '',
    currentTab: 0,
    historyList: [],
    favoritesList: []
  }

  componentDidMount(): void {
    this.loadHistoryData()
  }

  loadHistoryData(): void {
    // 模拟加载历史数据
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        name: '月季花',
        scientificName: 'Rosa chinensis',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-15 14:30',
        accuracy: '95%',
        isFavorite: true
      },
      {
        id: '2',
        name: '向日葵',
        scientificName: 'Helianthus annuus',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-14 16:20',
        accuracy: '92%',
        isFavorite: false
      },
      {
        id: '3',
        name: '玫瑰',
        scientificName: 'Rosa rugosa',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-13 10:15',
        accuracy: '88%',
        isFavorite: true
      },
      {
        id: '4',
        name: '百合',
        scientificName: 'Lilium brownii',
        image: 'https://via.placeholder.com/80x80',
        date: '2024-01-12 09:45',
        accuracy: '90%',
        isFavorite: false
      }
    ]

    this.setState({
      historyList: mockHistory,
      favoritesList: mockHistory.filter(item => item.isFavorite)
    })
  }

  handleSearchChange = (value: string): void => {
    this.setState({ searchValue: value })
  }

  handleTabChange = (value: number): void => {
    this.setState({ currentTab: value })
  }

  handleToggleFavorite = (itemId: string): void => {
    const { historyList, favoritesList } = this.state
    const updatedHistory = historyList.map(item => {
      if (item.id === itemId) {
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
  }

  handleViewDetail = (item: HistoryItem): void => {
    Taro.navigateTo({
      url: `/pages/detail/detail?id=${item.id}`
    })
  }

  handleDeleteItem = (itemId: string): void => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条识别记录吗？',
      success: (res) => {
        if (res.confirm) {
          const { historyList, favoritesList } = this.state
          const updatedHistory = historyList.filter(item => item.id !== itemId)
          const updatedFavorites = favoritesList.filter(item => item.id !== itemId)

          this.setState({
            historyList: updatedHistory,
            favoritesList: updatedFavorites
          })

          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }

  renderHistoryItem = (item: HistoryItem): React.ReactNode => {
    return (
      <AtCard
        key={item.id}
        className='history-item'
        title={item.name}
        extra={`准确率: ${item.accuracy}`}
      >
        <View className='history-content'>
          <Image src={item.image} className='history-image' />
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
              onClick={() => this.handleToggleFavorite(item.id)}
            >
              {item.isFavorite ? '取消收藏' : '收藏'}
            </AtButton>
            <AtButton 
              size='small' 
              type='secondary'
              className='action-btn delete-btn'
              onClick={() => this.handleDeleteItem(item.id)}
            >
              删除
            </AtButton>
          </View>
        </View>
      </AtCard>
    )
  }

  render(): React.ReactNode {
    const { searchValue, currentTab, historyList, favoritesList } = this.state

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
                  {filteredHistory.length > 0 ? (
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
                  {filteredFavorites.length > 0 ? (
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