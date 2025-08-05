/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

// 微信小程序全局对象
declare const wx: {
  cloud: {
    init: (config: { env: string; traceUser?: boolean }) => void;
    callFunction: (options: {
      name: string;
      data?: any;
      success?: (res: any) => void;
      fail?: (err: any) => void;
    }) => void;
    uploadFile: (options: {
      cloudPath: string;
      filePath: string;
      success?: (res: any) => void;
      fail?: (err: any) => void;
    }) => void;
    database: () => any;
  };
  getUserInfo: (options: {
    success?: (res: { userInfo: UserInfo }) => void;
    fail?: (err: any) => void;
  }) => void;
  getUserProfile: (options: {
    desc: string;
    success?: (res: { userInfo: UserInfo }) => void;
    fail?: (err: any) => void;
  }) => void;
  showToast: (options: {
    title: string;
    icon?: 'success' | 'loading' | 'none';
    duration?: number;
  }) => void;
  showModal: (options: {
    title: string;
    content: string;
    showCancel?: boolean;
    success?: (res: { confirm: boolean; cancel: boolean }) => void;
  }) => void;
  navigateTo: (options: { url: string }) => void;
  switchTab: (options: { url: string }) => void;
  showShareMenu: (options: {
    withShareTicket?: boolean;
    menus?: string[];
  }) => void;
  chooseImage: (options: {
    count: number;
    sizeType?: string[];
    sourceType?: string[];
    success?: (res: { tempFilePaths: string[] }) => void;
  }) => void;
  createCameraContext: () => any;
};

// 用户信息接口
export interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

// 识别记录接口
export interface IdentificationRecord {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  date: string;
  accuracy: string;
  isFavorite: boolean;
  description?: string;
  characteristics?: string[];
  careTips?: string[];
  createTime?: Date;
  updateTime?: Date;
}

// 统计数据接口
export interface Statistics {
  totalIdentifications: number;
  totalFavorites: number;
  accuracyRate: string;
}

// 识别结果接口
export interface IdentificationResult {
  name: string;
  scientificName: string;
  family: string;
  accuracy: string;
  description: string;
  characteristics: string[];
  careTips: string[];
}

// 云函数调用结果接口
export interface CloudFunctionResult<T = any> {
  result: T;
  requestId: string;
}

// 数据库操作结果接口
export interface DatabaseResult {
  _id: string;
  _openid?: string;
}

// 云开发配置接口
export interface CloudConfig {
  envId: string;
  init(): void;
  callFunction<T = any>(name: string, data?: any): Promise<CloudFunctionResult<T>>;
  uploadFile(filePath: string, cloudPath: string): Promise<any>;
  database(): any;
}

// 植物识别API接口
export interface PlantAPI {
  identifyPlant(imageUrl: string): Promise<IdentificationResult>;
  saveRecord(record: Partial<IdentificationRecord>): Promise<DatabaseResult>;
  getHistory(limit?: number, offset?: number): Promise<IdentificationRecord[]>;
  updateFavorite(id: string, isFavorite: boolean): Promise<any>;
  deleteRecord(id: string): Promise<any>;
}

// 用户API接口
export interface UserAPI {
  getUserInfo(): Promise<UserInfo>;
  updateUserInfo(userInfo: UserInfo): Promise<DatabaseResult>;
}

// 云开发工具类接口
export interface CloudUtils extends CloudConfig {
  plantAPI: PlantAPI;
  userAPI: UserAPI;
} 