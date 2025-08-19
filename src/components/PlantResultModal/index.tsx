import { View, Text } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton } from 'taro-ui'
import React from 'react'
import './index.scss'

export interface PlantResult {
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

interface PlantResultModalProps {
  isOpened: boolean;
  result: PlantResult | null;
  onClose: () => void;
  onSave?: () => void;
}

const PlantResultModal: React.FC<PlantResultModalProps> = ({ isOpened, result, onClose, onSave }) => {
  console.log('result :', result);
  return <AtModal isOpened={isOpened} onClose={onClose} className='plant-result-modal'>
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
      <AtButton onClick={onClose}>关闭</AtButton>
      {onSave && <AtButton onClick={onSave}>保存</AtButton>}
    </AtModalAction>
  </AtModal>
}

export default PlantResultModal
