import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import cloud from '@/utils/cloud'
import './index.scss'
import LeafSvg from '@/assets/leaf.svg'
import LogoSvg from '@/assets/logo.svg'
import GiftSvg from '@/assets/gift.svg'
import SafeAreaTop from '@/components/SafeAreaTop'
import SafeAreaBottom from '@/components/SafeAreaBottom'
import PlantResultModal, { PlantResult } from '@/components/PlantResultModal'

interface State {
  loading: boolean;
  isIdentifying: boolean;
  showResult: boolean;
  result: PlantResult | null;
}

export default class Index extends Component<{}, State> {
  state: State = {
    loading: false,
    isIdentifying: false,
    showResult: false,
    result: null
  }

  componentDidMount(): void {
    // 初始化云开发
    cloud.init()
  }

  identifyPlant = async (imagePath: string): Promise<void> => {
    try {
      this.setState({ isIdentifying: true })
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
      Taro.showToast({ title: '识别成功', icon: 'success' })
    } catch (error: any) {
      console.error('植物识别失败:', error)
      Taro.showToast({ title: error.message || '识别失败', icon: 'none' })
      this.setState({ isIdentifying: false })
    }
  }

  handleStartIdentify = (): void => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: async (res: any) => {
        await this.identifyPlant(res.tempFilePaths[0])
      },
      fail: (error: any) => {
        console.error('拍照失败:', error)
        Taro.showToast({ title: '拍照失败', icon: 'none' })
      }
    })
  }

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
        Taro.showToast({ title: '选择图片失败', icon: 'none' })
      }
    })
  }

  handleCategory = (): void => {
    const result = {
      "result": {
        "name": "含羞草",
        "scientificName": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
        "family": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
        "accuracy": "77%",
        "description": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
        "success": true,
        "data": {
          "name": "含羞草",
          "scientificName": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
          "family": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
          "accuracy": "77%",
          "description": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 ",
          "characteristics": [
            "置信度: 77%",
            "植物名称: 含羞草",
            "描述: 含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 "
          ],
          "careTips": [
            "建议在光线充足的环境下拍摄",
            "确保植物在画面中清晰可见",
            "识别结果仅供参考，请以实际情况为准"
          ],
          "baikeInfo": {
            "baike_url": "https://baike.baidu.com/item/%E5%90%AB%E7%BE%9E%E8%8D%89/92",
            "image_url": "https://bkimg.cdn.bcebos.com/pic/9825bc315c6034a85edf77c142455e540923dd54d86e?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
            "description": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 "
          },
          "allResults": [
            {
              "score": 0.77035064,
              "name": "含羞草",
              "baike_info": {
                "baike_url": "https://baike.baidu.com/item/%E5%90%AB%E7%BE%9E%E8%8D%89/92",
                "image_url": "https://bkimg.cdn.bcebos.com/pic/9825bc315c6034a85edf77c142455e540923dd54d86e?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
                "description": "含羞草（学名：Mimosa pudica L.）是豆科、含羞草属披散、亚灌木状草本植物。在中国为入侵物种，入侵级别为2级（严重入侵）。植株高1米；茎为圆柱状，有分枝；托叶为披针形；羽片为手指状，小叶为线状长圆形；花为多数，淡红色圆球形，头状花序；花冠钟状；荚果为扁平长圆形；种子卵圆形；花期3-10月，果期5-11月。含羞草原产热带美洲，广布于世界热带地区，在中国福建、广东、广西、云南、台湾等省区均有培育，生于旷野荒地、灌木丛中。在受到外界触动时，含羞草羽片和小叶闭合而下垂，通过这个可以预兆天气晴雨变化。此动作人们理解为“害羞”，故称之为含羞草、知羞草、怕丑草。花语为害羞。又像是在向人鞠躬一样，花语也为礼貌。含羞草全草供药用，有安神镇静的功能，鲜叶捣烂外敷治带状泡疗，体内的含羞草碱，有微毒，长江流域常有栽培供观赏。 "
              }
            },
            {
              "score": 0.021940237,
              "name": "叶下珠"
            },
            {
              "score": 0.01617388,
              "name": "感应草"
            }
          ]
        }
      },
      "requestID": "a95b1993-8dbf-4fde-9e7b-ea2588e80965"
    }
    this.setState({ showResult: true, result: result.result.data })
    Taro.showToast({
      title: '分类功能开发中',
      icon: 'none'
    })
  }

  handleCloseResult = (): void => {
    this.setState({ showResult: false })
  }

  render(): React.ReactNode {
    const { isIdentifying, showResult, result } = this.state
    return (
      <View className='index'>
        <SafeAreaTop />
        {/* 功能区 */}
        <View className='feature-bar'>
          <Image src={LogoSvg} className='feature-logo' mode='aspectFit' />
          <Text className='feature-title'>花草识</Text>
          <View className='feature-divider'></View>
          <View className='feature-history'>
            <Image src={GiftSvg} className='feature-history-icon' mode='aspectFit' />
            <Text className='feature-history-text'>历史</Text>
          </View>
        </View>
        {/* 主内容区域 */}
        <View className='main-content'>
          <View className='content-card'>
            {/* 装饰性叶子图片 */}
            <View className='leaf-decoration'>
              <Image src={LeafSvg} className='leaf-image large' mode='aspectFit' />
              <Image src={LeafSvg} className='leaf-image small' mode='aspectFit' />
            </View>
            {/* 提示文字 */}
            <View className='instruction-text'>
              <Text>点击底部按钮拍植物~</Text>
            </View>
          </View>
        </View>
        {/* 底部操作按钮 */}
        <View className='bottom-actions-container'>
          <View className='bottom-actions'>
            <AtButton
              className='action-btn album-btn'
              onClick={this.handleAlbumSelect}
            >
              相册
            </AtButton>
            <View
              className='main-action-btn'
              onClick={this.handleStartIdentify}
            >
              <AtIcon value='camera' size='30' color='white' />
            </View>
            <AtButton
              className='action-btn category-btn'
              onClick={this.handleCategory}
            >
              历史
            </AtButton>
          </View>
          <SafeAreaBottom />
        </View>
        {/* 底部装饰 */}
        <View className='footer-decoration'>
          <View className='grass-pattern'></View>
          <View className='person-silhouette'></View>
        </View>
        {/* 识别中遮罩 */}
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
        <PlantResultModal isOpened={showResult} result={result} onClose={this.handleCloseResult} />
      </View>
    )
  }
} 