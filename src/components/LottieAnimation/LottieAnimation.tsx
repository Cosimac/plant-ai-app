import { View } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface LottieAnimationProps {
  src: string; // Lottie JSON 文件路径
  autoplay?: boolean; // 是否自动播放
  loop?: boolean; // 是否循环播放
  speed?: number; // 播放速度
  className?: string; // 自定义样式类
  style?: React.CSSProperties; // 自定义样式
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  src,
  autoplay = true,
  loop = true,
  speed = 1,
  className = '',
  style = {}
}) => {
  return (
    <View className={`lottie-container ${className}`} style={style}>
      {/* 使用微信小程序的 Lottie 组件 */}
      <lottie
        src={src}
        autoplay={autoplay}
        loop={loop}
        speed={speed}
        className="lottie-animation"
      />
    </View>
  )
}

export default LottieAnimation
