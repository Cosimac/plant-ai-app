import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.scss'

const getStatusBarHeight = () => {
  const info = Taro.getSystemInfoSync?.()
  if (info && info.statusBarHeight) return info.statusBarHeight
  return 44
}

export default function SafeAreaTop() {
  const [height, setHeight] = useState(44)
  useEffect(() => {
    setHeight(getStatusBarHeight())
  }, [])
  return <View className='safe-area-top' style={{ height: `${height}px` }} />
}
