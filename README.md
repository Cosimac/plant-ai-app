# 花草识AI - 微信小程序

基于 Taro 和 EMAS Serverless 的植物识别微信小程序。

## 功能特性

- 📸 拍照识别植物
- 🔍 植物信息查询
- 📱 微信小程序原生体验
- ☁️ EMAS Serverless 云函数支持

## 技术栈

- **前端**: Taro + React + TypeScript
- **后端**: EMAS Serverless
- **AI服务**: 百度AI植物识别API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境

复制配置模板文件：
```bash
cp src/config/cloud.local.example.js src/config/cloud.local.js
```

编辑 `src/config/cloud.local.js`，填入真实配置：
- 微信小程序 AppID
- EMAS Serverless Space ID 和 Client Secret

### 3. 配置云函数

编辑 `emas-functions/identifyPlant/index.js`，在 `BAIDU_CONFIG` 中填入百度AI API密钥。

### 4. 打包云函数

```bash
npm run package:function
```

### 5. 部署云函数

1. 登录 [EMAS 控制台](https://emas.console.aliyun.com/)
2. 进入项目 > Serverless > 云函数
3. 上传 `emas-functions/identifyPlant/identifyPlant.zip`

### 6. 运行项目

```bash
npm run dev:weapp
```

## 项目结构

```
├── src/
│   ├── pages/          # 页面文件
│   ├── components/     # 组件文件
│   ├── utils/          # 工具函数
│   └── config/         # 配置文件
├── emas-functions/     # EMAS 云函数
└── scripts/           # 构建脚本
```

## 注意事项

⚠️ **安全提醒**：
- 请勿将 `src/config/cloud.local.js` 提交到版本控制
- 云函数中的API密钥需要手动配置，不要提交真实密钥
- 生产环境请使用独立的API密钥

## 许可证

MIT License