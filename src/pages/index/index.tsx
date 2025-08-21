import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '@/utils/cloud'
import './index.scss'

import LogoSvg from '@/assets/icons/logo.svg'
import GiftSvg from '@/assets/icons/gift.svg'
import SafeAreaTop from '@/components/SafeAreaTop'
import SafeAreaBottom from '@/components/SafeAreaBottom'
import PlantResultModal, { PlantResult } from '@/components/PlantResultModal'
import LottiePlayer from '@/components/LottiePlayer'
import plantAnimation from '@/assets/lottie/plant.json'

interface State {
  loading: boolean;
  showResult: boolean;
  result: PlantResult | null;
}

export default class Index extends Component<{}, State> {
  state: State = {
    loading: false,
    showResult: false,
    result: null
  }

  componentDidMount(): void {
    // 初始化云开发
    cloud.init()
  }

  identifyPlant = async (imagePath: string): Promise<void> => {
    try {
      // 显示识别中的提示
      Taro.showLoading({
        title: '识别中...',
      })
      // 上传图片到云存储
      const uploadResult = await cloud.uploadFile(
        imagePath,
        `plants/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
      )
      // 调用百度植物识别API
      const plantResult = await cloud.plantAPI.identifyPlant(uploadResult.fileID)
      this.setState({
        result: plantResult,
        showResult: true
      })
      Taro.hideLoading()
    } catch (error: any) {
      console.error('植物识别失败:', error)
      Taro.hideLoading()
      Taro.showToast({ title: error.message || '识别失败', icon: 'none' })
    }
  }

  // 拍照识别
  handleCameraIdentify = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: async (res: any) => {
        await this.identifyPlant(res.tempFilePaths[0])
      },
      fail: (error: any) => {
        console.error('拍照失败:', error)
      }
    })
  }

  // 相册选择识别
  handleAlbumSelect = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async (res: any) => {
        await this.identifyPlant(res.tempFilePaths[0])
      },
      fail: (error: any) => {
        console.error('选择图片失败:', error)
      }
    })
  }

  handleCategory = (): void => {
    Taro.showToast({
      title: '历史功能开发中',
      icon: 'none'
    })
  }

  handleCloseResult = (): void => {
    this.setState({ showResult: false })
  }

  render(): React.ReactNode {
    const { showResult, result } = this.state
    return (
      <View className='index'>
        <SafeAreaTop />
        {/* 功能区 */}
        <View className='feature-bar'>
          <Image src={LogoSvg} className='feature-logo' mode='aspectFit' />
          <Text className='feature-title'>花草识</Text>
        </View>
        {/* 主内容区域 */}
        <View className='main-content'>
          <View className='content-card'>
            {/* Lottie 动画 */}
            <LottiePlayer
              animationData={plantAnimation}
              width={240}
              height={240}
              loop={true}
              autoplay={true}
              className='plant-animation'
            />
            {/* 提示文字 */}
            <View className='instruction-text'>
              <Text>点击按钮识别植物~</Text>
            </View>
          </View>
        </View>
        {/* 底部操作按钮 */}
        <View className='bottom-actions-container'>
          <View className='bottom-actions'>
            <AtButton
              className='action-btn'
              onClick={this.handleAlbumSelect}
            >相册</AtButton>
            <View
              className='main-action-btn'
              onClick={this.handleCameraIdentify}
            >
              <AtIcon value='camera' size='30' color='white' />
            </View>
            <AtButton
              className='action-btn'
              onClick={this.handleCategory}
            >历史</AtButton>
          </View>
          <SafeAreaBottom />
        </View>
        {/* 底部装饰 */}
        <View className='footer-decoration'>
          <View className='grass-pattern'></View>
          <View className='person-silhouette'></View>
        </View>
        {/* 识别结果弹窗 */}
        <PlantResultModal isOpened={showResult} result={result} onClose={this.handleCloseResult} />
      </View>
    )
  }
} 