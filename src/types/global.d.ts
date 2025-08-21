// 全局类型定义

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'qq' | 'jd';
  }
}

// Taro 相关类型扩展
declare module '@tarojs/taro' {
  interface CameraContext {
    takePhoto(options: {
      quality?: 'low' | 'normal' | 'high';
      success?: (res: { tempImagePath: string }) => void;
      fail?: (error: any) => void;
    }): void;
    stopRecord(): void;
  }

  interface ChooseImageSuccessCallbackResult {
    tempFilePaths: string[];
    tempFiles: Array<{
      path: string;
      size: number;
    }>;
  }

  interface GetUserInfoSuccessCallbackResult {
    userInfo: {
      nickName: string;
      avatarUrl: string;
      gender: number;
      country: string;
      province: string;
      city: string;
      language: string;
    };
    rawData: string;
    signature: string;
    encryptedData: string;
    iv: string;
  }

  interface ShowModalSuccessCallbackResult {
    confirm: boolean;
    cancel: boolean;
  }

  interface ShowToastOptions {
    title: string;
    icon?: 'success' | 'loading' | 'none';
    image?: string;
    duration?: number;
    mask?: boolean;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }

  interface NavigateToOptions {
    url: string;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }

  interface SwitchTabOptions {
    url: string;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }

  interface ChooseImageOptions {
    count?: number;
    sizeType?: Array<'original' | 'compressed'>;
    sourceType?: Array<'album' | 'camera'>;
    success?: (res: ChooseImageSuccessCallbackResult) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }

  interface GetUserInfoOptions {
    success?: (res: GetUserInfoSuccessCallbackResult) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }

  interface ShowModalOptions {
    title?: string;
    content?: string;
    showCancel?: boolean;
    cancelText?: string;
    cancelColor?: string;
    confirmText?: string;
    confirmColor?: string;
    success?: (res: ShowModalSuccessCallbackResult) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }

  const Taro: {
    createCameraContext(): CameraContext;
    chooseImage(options: ChooseImageOptions): void;
    getUserInfo(options: GetUserInfoOptions): void;
    showToast(options: ShowToastOptions): void;
    showModal(options: ShowModalOptions): void;
    navigateTo(options: NavigateToOptions): void;
    switchTab(options: SwitchTabOptions): void;
    createSelectorQuery(): {
      select(selector: string): {
        node(callback?: (res: { node?: any }) => void): {
          exec(): void;
        };
      };
    };
    getSystemInfoSync(): {
      windowWidth: number;
      windowHeight: number;
      pixelRatio: number;
    };
    showLoading(options: { title: string; mask?: boolean }): void;
    hideLoading(): void;
  };

  export default Taro;
}

// 全局模块声明
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
} 