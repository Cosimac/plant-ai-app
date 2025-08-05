# 花草识AI - 部署说明

## 项目概述

这是一个基于 Taro + React + TypeScript 的微信小程序，集成了百度植物识别API和腾讯云开发。

## 技术栈

- **前端框架**: Taro 3.6.8 + React 18
- **开发语言**: TypeScript
- **UI组件**: Taro UI
- **后端服务**: 腾讯云开发
- **AI服务**: 百度植物识别API

## 部署步骤

### 1. 百度AI配置

1. 访问 [百度AI开放平台](https://ai.baidu.com/)
2. 注册账号并创建应用
3. 开通植物识别服务
4. 获取 API Key 和 Secret Key

### 2. 更新百度API配置

编辑 `cloudfunctions/identifyPlant/index.js` 文件：

```javascript
// 百度AI配置
const BAIDU_API_KEY = 'your_baidu_api_key' // 替换为你的百度API Key
const BAIDU_SECRET_KEY = 'your_baidu_secret_key' // 替换为你的百度Secret Key
```

### 3. 腾讯云开发配置

1. 访问 [腾讯云开发控制台](https://console.cloud.tencent.com/tcb)
2. 创建云开发环境
3. 获取环境ID

### 4. 更新云开发环境ID

编辑 `src/utils/cloud.ts` 文件：

```typescript
// 云开发环境ID
envId: 'your_cloud_env_id', // 替换为你的云开发环境ID
```

### 5. 部署云函数

在项目根目录执行：

```bash
# 安装云开发CLI
npm install -g @cloudbase/cli

# 登录腾讯云
tcb login

# 部署云函数
tcb fn deploy identifyPlant
tcb fn deploy getUserInfo
tcb fn deploy saveRecord
tcb fn deploy getHistory
tcb fn deploy updateFavorite
tcb fn deploy deleteRecord
```

### 6. 创建数据库集合

在腾讯云开发控制台创建以下数据库集合：

- `users` - 用户信息
- `identifications` - 识别记录

### 7. 构建小程序

```bash
# 安装依赖
npm install

# 构建微信小程序
npm run build:weapp
```

### 8. 上传到微信开发者工具

1. 打开微信开发者工具
2. 导入项目（选择 `dist` 目录）
3. 配置小程序AppID
4. 上传代码

## 项目结构

```
plant-ai-app/
├── src/                    # 源代码
│   ├── pages/             # 页面组件
│   ├── utils/             # 工具类
│   ├── config/            # 配置文件
│   └── types/             # 类型定义
├── cloudfunctions/        # 云函数
│   ├── identifyPlant/     # 植物识别云函数
│   ├── getUserInfo/       # 获取用户信息
│   ├── saveRecord/        # 保存记录
│   ├── getHistory/        # 获取历史
│   ├── updateFavorite/    # 更新收藏
│   └── deleteRecord/      # 删除记录
├── config/                # Taro配置
└── dist/                  # 构建输出
```

## 功能特性

### 植物识别
- 拍照识别植物
- 相册选择图片识别
- 实时AI识别结果
- 详细的植物信息展示

### 历史记录
- 查看识别历史
- 收藏喜欢的植物
- 搜索历史记录
- 删除不需要的记录

### 用户系统
- 微信用户信息获取
- 用户数据云端同步
- 个性化体验

## API接口

### 百度植物识别API
- **接口地址**: `https://aip.baidubce.com/rest/2.0/image-classify/v1/plant`
- **功能**: 识别图片中的植物
- **返回**: 植物名称、学名、描述、准确率等

### 云开发API
- **数据库**: 存储用户信息和识别记录
- **云存储**: 存储上传的植物图片
- **云函数**: 处理业务逻辑

## 注意事项

1. **API密钥安全**: 请妥善保管百度API密钥，不要提交到代码仓库
2. **云开发配额**: 注意腾讯云开发的免费配额限制
3. **图片大小**: 建议上传的图片大小不超过2MB
4. **网络环境**: 确保小程序有稳定的网络连接

## 开发环境

- Node.js >= 14
- npm >= 6
- 微信开发者工具
- 腾讯云开发环境

## 常见问题

### Q: 百度API调用失败
A: 检查API密钥是否正确，确认已开通植物识别服务

### Q: 云函数部署失败
A: 确认已登录腾讯云，检查云开发环境ID是否正确

### Q: 小程序构建失败
A: 检查TypeScript语法错误，确认所有依赖已安装

## 技术支持

如有问题，请查看：
- [Taro官方文档](https://docs.taro.zone/)
- [百度AI开放平台文档](https://ai.baidu.com/ai-doc/)
- [腾讯云开发文档](https://cloud.tencent.com/document/product/876) 