import { Component } from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import lottie from 'lottie-miniprogram'
import './index.scss'

interface LottiePlayerProps {
  /** 动画数据 */
  animationData: any
  /** 动画宽度，默认240 */
  width?: number
  /** 动画高度，默认240 */
  height?: number
  /** 是否循环播放，默认true */
  loop?: boolean
  /** 是否自动播放，默认true */
  autoplay?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 动画加载完成回调 */
  onLoaded?: (animation: any) => void
  /** 错误回调 */
  onError?: (error: any) => void
}

interface LottiePlayerState {
  isInitialized: boolean
  hasError: boolean
}

export default class LottiePlayer extends Component<LottiePlayerProps, LottiePlayerState> {
  static defaultProps: Partial<LottiePlayerProps> = {
    width: 240,
    height: 240,
    loop: true,
    autoplay: true,
    className: ''
  }

  state: LottiePlayerState = {
    isInitialized: false,
    hasError: false
  }

  private animation: any = null
  private canvasId: string = ''

  constructor(props: LottiePlayerProps) {
    super(props)
    // 生成唯一的canvas ID
    this.canvasId = `lottie-canvas-${Math.random().toString(36).substr(2, 9)}`
  }

  componentDidMount(): void {
    this.initLottieAnimation()
  }

  componentWillUnmount(): void {
    this.destroyAnimation()
  }

  componentDidUpdate(prevProps: LottiePlayerProps): void {
    // 如果动画数据发生变化，重新初始化
    if (prevProps.animationData !== this.props.animationData) {
      this.destroyAnimation()
      this.setState({ isInitialized: false, hasError: false })
      this.initLottieAnimation()
    }
  }

  destroyAnimation = (): void => {
    if (this.animation) {
      try {
        this.animation.destroy()
      } catch (error) {
        console.warn('销毁动画时发生错误:', error)
      } finally {
        this.animation = null
      }
    }
  }

  initLottieAnimation = (): void => {
    const { animationData, width = 240, height = 240, loop = true, autoplay = true, onLoaded, onError } = this.props

    if (!animationData) {
      const error = new Error('缺少animationData')
      this.setState({ hasError: true })
      onError?.(error)
      return
    }

    // 使用 setTimeout 确保 Canvas 已渲染
    setTimeout(() => {
      try {
        const query = Taro.createSelectorQuery()
        query.select(`#${this.canvasId}`).node((res) => {
          if (res && res.node) {
            const canvas = res.node
            const context = canvas.getContext('2d')
            
            if (!context) {
              throw new Error('无法获取Canvas 2D上下文')
            }
            
            // 获取系统信息设置 canvas 尺寸
            const { pixelRatio } = Taro.getSystemInfoSync()
            canvas.width = width * pixelRatio
            canvas.height = height * pixelRatio
            context.scale(pixelRatio, pixelRatio)

            // 初始化 lottie
            lottie.setup(canvas)

            // 加载动画
            this.animation = lottie.loadAnimation({
              loop,
              autoplay,
              animationData,
              rendererSettings: {
                context
              }
            })

            // 监听动画事件
            if (this.animation) {
              this.animation.addEventListener('data_ready', () => {
                this.setState({ isInitialized: true })
                onLoaded?.(this.animation)
              })

              this.animation.addEventListener('data_failed', (error: any) => {
                this.setState({ hasError: true })
                onError?.(error)
              })
            }

            this.setState({ isInitialized: true })
            onLoaded?.(this.animation)
          } else {
            throw new Error('无法获取Canvas节点')
          }
        }).exec()
      } catch (error) {
        console.error('初始化Lottie动画失败:', error)
        this.setState({ hasError: true })
        onError?.(error)
      }
    }, 100)
  }

  // 控制动画播放
  play = (): void => {
    this.animation?.play()
  }

  // 控制动画暂停
  pause = (): void => {
    this.animation?.pause()
  }

  // 控制动画停止
  stop = (): void => {
    this.animation?.stop()
  }

  // 跳转到指定帧
  goToAndStop = (frame: number): void => {
    this.animation?.goToAndStop(frame)
  }

  // 跳转到指定帧并播放
  goToAndPlay = (frame: number): void => {
    this.animation?.goToAndPlay(frame)
  }

  render(): React.ReactNode {
    const { width = 240, height = 240, className = '' } = this.props
    const { isInitialized, hasError } = this.state

    return (
      <View className={`lottie-player ${className}`}>
        <View 
          className='lottie-container'
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <Canvas
            id={this.canvasId}
            type='2d'
            className='lottie-canvas'
            style={{ width: `${width}px`, height: `${height}px` }}
          />
          
          {/* 加载状态 */}
          {!isInitialized && !hasError && (
            <View className='lottie-loading'>
              <View className='loading-text'>加载中...</View>
            </View>
          )}
          
          {/* 错误状态 */}
          {hasError && (
            <View className='lottie-error'>
              <View className='error-text'>动画加载失败</View>
            </View>
          )}
        </View>
      </View>
    )
  }
}
