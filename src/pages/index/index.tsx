import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '@/utils/cloud'
import './index.scss'

// 声明全局 wx 对象
declare const wx: any

import LogoSvg from '@/assets/icons/logo.svg'

import SafeAreaTop from '@/components/SafeAreaTop'
import SafeAreaBottom from '@/components/SafeAreaBottom'
import PlantResultModal, { PlantResult } from '@/components/PlantResultModal'
import LottiePlayer from '@/components/LottiePlayer'

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

  async componentDidMount(): Promise<void> {
    // 初始化EMAS Serverless
    try {
      await cloud.init()
    } catch (error) {
      console.error('云服务初始化失败:', error)
    }
  }

  identifyPlant = async (imagePath: string): Promise<void> => {
    try {
      // 显示识别中的提示
      Taro.showLoading({
        title: '识别中...',
      })

      // 将图片转换为base64，直接传递给云函数
      const base64Image = await this.convertImageToBase64(imagePath)
      const plantResult = await cloud.plantAPI.identifyPlant(base64Image)

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

  // 将图片转换为base64
  convertImageToBase64 = (imagePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager()
      fs.readFile({
        filePath: imagePath,
        encoding: 'base64',
        success: (res: any) => {
          resolve(res.data)
        },
        fail: (error: any) => {
          reject(error)
        }
      })
    })
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
              path='https://mp-55d4a02e-2564-489f-a408-ca370fc7efbc.cdn.bspapp.com/plant.json'
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