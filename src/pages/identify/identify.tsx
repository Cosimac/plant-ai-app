import { Component } from 'react'
import { View, Text, Image, Camera } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '../../utils/cloud'
import './identify.scss'

interface PlantResult {
  name: string;
  scientificName: string;
  family: string;
  accuracy: string;
  description: string;
  characteristics: string[];
  careTips: string[];
  baikeInfo?: any;
  allResults?: any[];
}

interface State {
  cameraContext: any;
  isIdentifying: boolean;
  showResult: boolean;
  result: PlantResult | null;
  cameraPosition: 'front' | 'back';
  showCamera: boolean;
}

export default class Identify extends Component<{}, State> {
  state: State = {
    cameraContext: null,
    isIdentifying: false,
    showResult: false,
    result: null,
    cameraPosition: 'back',
    showCamera: false
  }

  componentDidMount(): void {
    this.initCamera()
    // 初始化云开发
    cloud.init()
  }

  componentWillUnmount(): void {
    if (this.state.cameraContext) {
      this.state.cameraContext.stopRecord()
    }
  }

  initCamera(): void {
    const cameraContext = Taro.createCameraContext()
    this.setState({ cameraContext })
  }

  takePhoto = (): void => {
    const { cameraContext } = this.state
    if (!cameraContext) return

    this.setState({ isIdentifying: true })

    cameraContext.takePhoto({
      quality: 'high',
      success: (res: any) => {
        this.identifyPlant(res.tempImagePath)
      },
      fail: (error: any) => {
        console.error('拍照失败:', error)
        Taro.showToast({
          title: '拍照失败',
          icon: 'none'
        })
        this.setState({ isIdentifying: false })
      }
    })
  }

  identifyPlant = async (imagePath: string): Promise<void> => {
    try {
      // 上传图片到云存储
      const uploadResult = await cloud.uploadFile(
        imagePath,
        `plants/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
      )

      // 调用百度植物识别API
      const plantResult = await cloud.plantAPI.identifyPlant(uploadResult.fileID)

      this.setState({
        result: plantResult,
        isIdentifying: false,
        showResult: true
      })

      Taro.showToast({
        title: '识别成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('植物识别失败:', error)
      Taro.showToast({
        title: error.message || '识别失败',
        icon: 'none'
      })
      this.setState({ isIdentifying: false })
    }
  }

  handleChooseImage = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async (res: any) => {
        this.setState({ isIdentifying: true })
        await this.identifyPlant(res.tempFilePaths[0])
      },
      fail: (error: any) => {
        console.error('选择图片失败:', error)
        Taro.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  }

  handleSwitchCamera = (): void => {
    this.setState({
      cameraPosition: this.state.cameraPosition === 'back' ? 'front' : 'back'
    })
  }

  handleCloseResult = (): void => {
    this.setState({ showResult: false })
  }

  handleSaveResult = async (): Promise<void> => {
    const { result } = this.state
    if (!result) return

    try {
      // 保存识别结果到数据库
      await cloud.plantAPI.saveRecord({
        name: result.name,
        scientificName: result.scientificName,
        image: '', // 这里可以保存图片路径
        date: new Date().toLocaleString(),
        accuracy: result.accuracy,
        isFavorite: false,
        result: result
      })

      Taro.showToast({
        title: '已保存到历史记录',
        icon: 'success'
      })
      this.setState({ showResult: false })
    } catch (error) {
      console.error('保存记录失败:', error)
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  }

  render(): React.ReactNode {
    const { isIdentifying, showResult, result, cameraPosition, showCamera } = this.state

    return (
      <View className='identify'>
        <View className='container'>
          {/* 顶部导航 */}
          <View className='top-nav'>
            <AtButton
              circle
              size='small'
              className='back-btn'
              onClick={() => Taro.navigateTo({ url: '/pages/index/index' })}
            >
              <AtIcon value='chevron-left' size='20' />
            </AtButton>
            <Text className='page-title'>植物识别</Text>
            <View className='nav-placeholder'></View>
          </View>

          {/* 相机区域 */}
          <View className='camera-section'>
            {showCamera ? (
              <View className='camera-container'>
                <Camera
                  devicePosition={cameraPosition}
                  flash='off'
                  className='camera'
                  onError={(error: any) => {
                    console.error('相机错误:', error)
                    Taro.showToast({
                      title: '相机启动失败',
                      icon: 'none'
                    })
                  }}
                />
                <View className='camera-controls'>
                  <AtButton
                    circle
                    size='normal'
                    className='capture-btn'
                    onClick={this.takePhoto}
                    disabled={isIdentifying}
                  >
                    <AtIcon value='camera' size='30' color='white' />
                  </AtButton>
                  <AtButton
                    circle
                    size='small'
                    className='switch-btn'
                    onClick={this.handleSwitchCamera}
                  >
                    <AtIcon value='repeat' size='20' />
                  </AtButton>
                </View>
              </View>
            ) : (
              <View className='camera-placeholder'>
                <AtIcon value='camera' size='80' color='#ccc' />
                <Text className='placeholder-text'>点击下方按钮开始拍照</Text>
              </View>
            )}
          </View>

          {/* 操作按钮 */}
          <View className='action-section'>
            <View className='action-buttons'>
              <AtButton
                type='primary'
                size='normal'
                className='action-btn'
                onClick={() => this.setState({ showCamera: true })}
              >
                <AtIcon value='camera' size='20' />
                拍照识别
              </AtButton>

              <AtButton
                type='secondary'
                size='normal'
                className='action-btn'
                onClick={this.handleChooseImage}
              >
                <AtIcon value='image' size='20' />
                相册选择
              </AtButton>
            </View>

            <View className='tips'>
              <Text className='tip-text'>• 请确保植物在画面中清晰可见</Text>
              <Text className='tip-text'>• 建议在光线充足的环境下拍摄</Text>
              <Text className='tip-text'>• 识别结果仅供参考，请以实际情况为准</Text>
            </View>
          </View>

          {/* 识别中状态 */}
          {isIdentifying && (
            <View className='identifying-overlay'>
              <View className='identifying-content'>
                <View className='loading-spinner'></View>
                <Text className='identifying-text'>AI正在识别中...</Text>
                <Text className='identifying-subtext'>请稍候，这可能需要几秒钟</Text>
              </View>
            </View>
          )}

          {/* 识别结果弹窗 */}
          <AtModal isOpened={showResult} onClose={this.handleCloseResult}>
            <AtModalHeader>识别结果</AtModalHeader>
            <AtModalContent>
              {result && (
                <View className='result-content'>
                  <View className='result-header'>
                    <Text className='plant-name'>{result.name}</Text>
                    <Text className='scientific-name'>{result.scientificName}</Text>
                    <Text className='accuracy'>准确率: {result.accuracy}</Text>
                  </View>

                  <View className='result-section'>
                    <Text className='section-title'>植物描述</Text>
                    <Text className='description'>{result.description}</Text>
                  </View>

                  <View className='result-section'>
                    <Text className='section-title'>主要特征</Text>
                    <View className='characteristics'>
                      {result.characteristics.map((item, index) => (
                        <Text key={index} className='characteristic-item'>• {item}</Text>
                      ))}
                    </View>
                  </View>

                  <View className='result-section'>
                    <Text className='section-title'>养护建议</Text>
                    <View className='care-tips'>
                      {result.careTips.map((item, index) => (
                        <Text key={index} className='care-tip-item'>• {item}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </AtModalContent>
            <AtModalAction>
              <AtButton onClick={this.handleCloseResult}>关闭</AtButton>
              <AtButton onClick={this.handleSaveResult}>保存</AtButton>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
} 