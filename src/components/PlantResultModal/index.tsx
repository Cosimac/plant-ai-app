import { View, Text, Image } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtButton, AtRate, AtIcon } from 'taro-ui'
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
  const { name, scientificName, careTips, baikeInfo, allResults } = result || {};
  const getRateValue = (score: any): number => {
    const numericScore = Number(score);
    if (Number.isNaN(numericScore)) return 0;
    const normalized = numericScore > 1 ? numericScore / 20 : numericScore * 5;
    const clamped = Math.max(0, Math.min(5, normalized));
    return Math.round(clamped);
  };
  return <AtModal isOpened={isOpened} onClose={onClose} className='plant-result-modal'>
    <AtModalContent>
      {result && (
        <View className='result-content'>
          <View className='result-header'>
            <Text className='plant-name'>{name}</Text>
            {baikeInfo?.image_url && <View className='avatar-wrap'>
              <Image src={baikeInfo?.image_url} className='plant-image' mode='aspectFill' />
            </View>}
            <Text className='scientific-name'>{scientificName}</Text>
          </View>
          {name !== '非植物' && <View className='result-section'>
            <Text className='section-title'>相似植物 (匹配度)</Text>
            <View className='care-tips'>
              {allResults?.map((item: any, index: number) => (
                <View key={index} className='similar-item'>
                  <Text className='care-item-name'>{item.name}</Text>
                  <View className='care-item-rate'>
                    <AtRate size={14} value={getRateValue(item.score)} />
                  </View>
                </View>
              ))}
            </View>
          </View>}
          <View className='result-section'>
            <Text className='section-title'>温馨提示</Text>
            <View className='care-tips'>
              {careTips?.map((item: string, index: number) => (
                <Text key={index} className='similar-item'>
                  <Text className='care-item-name'>{item}</Text>
                  <View className='care-item-rate'>
                    <AtRate size={14} value={getRateValue(item.score)} />
                  </View>
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </AtModalContent>
    <View className='modal-close' onClick={onClose} role='button' aria-label='关闭'>
      <AtIcon value='close' size={16} color='#2e7d32' />
    </View>
    <AtModalAction>
      {onSave && <AtButton onClick={onSave}>保存</AtButton>}
    </AtModalAction>
  </AtModal>
}

export default PlantResultModal
