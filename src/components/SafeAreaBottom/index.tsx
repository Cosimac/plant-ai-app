import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.scss'

const getSafeAreaBottom = () => {
  const info = Taro.getSystemInfoSync?.()
  if (info && info.safeArea && info.screenHeight) {
    return info.screenHeight - info.safeArea.bottom
  }
  return 0
}

export default function SafeAreaBottom() {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    setHeight(getSafeAreaBottom())
  }, [])
  return <View className='safe-area-bottom' style={{ height: `${height}px` }} />
}
