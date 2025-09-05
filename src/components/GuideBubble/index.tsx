import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import React from 'react'
import './index.scss'

interface GuideBubbleProps {
  /** 是否显示气泡 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 气泡位置 - 可选，默认居中 */
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  /** 箭头方向 */
  arrow?: 'top' | 'bottom' | 'left' | 'right';
}

const GuideBubble: React.FC<GuideBubbleProps> = ({
  visible,
  onClose,
  position,
  arrow = 'bottom'
}) => {
  if (!visible) return null;

  const bubbleStyle = position ? position : {};

  // 点击遮罩层关闭气泡
  const handleOverlayClick = (e: any) => {
    // 确保只有点击遮罩层本身才触发关闭
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 阻止气泡内部点击事件冒泡
  const handleBubbleClick = (e: any) => {
    e.stopPropagation();
  };

  return (
    <View className="guide-bubble-overlay" onClick={handleOverlayClick}>
      <View
        className={`guide-bubble ${arrow ? `guide-bubble--${arrow}` : ''}`}
        style={bubbleStyle}
        onClick={handleBubbleClick}
      >
        {/* 箭头图标 */}
        <View className="guide-bubble__arrow">
          <AtIcon value="chevron-up" size="20" color="#43a047" />
        </View>
        
        <View className="guide-bubble__content">
          <View className="guide-bubble__text">
            收藏一下, 下次就能找到我了~
          </View>
          <Image
            src="https://mp-55d4a02e-2564-489f-a408-ca370fc7efbc.cdn.bspapp.com/wechat_2025-09-05_145342_070.png"
            className="guide-bubble__image"
            mode="aspectFit"
          />
        </View>
      </View>
    </View>
  );
};

export default GuideBubble;
