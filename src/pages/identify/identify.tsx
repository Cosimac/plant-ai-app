import { Component } from 'react'
import { View, Text, Image, Camera } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import './identify.scss'

interface PlantResult {
  name: string;
  scientificName: string;
  family: string;
  accuracy: string;
  description: string;
  characteristics: string[];
  careTips: string[];
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

  identifyPlant = (imagePath: string): void => {
    // 模拟AI识别过程
    setTimeout(() => {
      const mockResult: PlantResult = {
        name: '月季花',
        scientificName: 'Rosa chinensis',
        family: '蔷薇科',
        accuracy: '95%',
        description: '月季花是蔷薇科蔷薇属植物，原产于中国，是著名的观赏花卉。',
        characteristics: [
          '花瓣重瓣或半重瓣',
          '花色丰富多样',
          '花期较长',
          '适应性强'
        ],
        careTips: [
          '喜欢阳光充足的环境',
          '需要疏松肥沃的土壤',
          '定期修剪促进开花',
          '注意防治病虫害'
        ]
      }

      this.setState({
        result: mockResult,
        isIdentifying: false,
        showResult: true
      })
    }, 2000)
  }

  handleChooseImage = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res: any) => {
        this.setState({ isIdentifying: true })
        this.identifyPlant(res.tempFilePaths[0])
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

  handleSaveResult = (): void => {
    const { result } = this.state
    // 保存识别结果到历史记录
    Taro.showToast({
      title: '已保存到历史记录',
      icon: 'success'
    })
    this.setState({ showResult: false })
  }

  render(): React.ReactNode {
    const { isIdentifying, showResult, result, cameraPosition, showCamera } = this.state

    return (
      <View className='identify'>
        <View className='container'>
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