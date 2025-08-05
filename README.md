# 花草识AI - 微信小程序

基于 Taro + Taro UI + SCSS + TypeScript 开发的植物识别微信小程序，后端使用腾讯云开发。

## 项目特性

- 🌱 **AI植物识别** - 基于人工智能的植物识别功能
- 📱 **移动端适配** - 完美适配各种移动设备
- 🎨 **现代化UI** - 使用 Taro UI 组件库，界面美观
- ☁️ **云开发后端** - 基于腾讯云开发，无需自建服务器
- 📊 **数据统计** - 用户识别历史、收藏管理
- 🔍 **搜索功能** - 支持历史记录搜索
- 👤 **用户系统** - 用户登录、个人信息管理
- 🔧 **TypeScript** - 完整的类型支持，提高开发效率

## 技术栈

- **前端框架**: Taro 3.6.8
- **UI组件库**: Taro UI 3.1.0
- **样式语言**: SCSS
- **开发语言**: TypeScript
- **后端服务**: 腾讯云开发
- **数据库**: 云开发数据库
- **文件存储**: 云开发存储

## 项目结构

```
plant-ai-app/
├── config/                 # Taro 配置文件
│   ├── index.js           # 主配置
│   ├── dev.js             # 开发环境配置
│   └── prod.js            # 生产环境配置
├── src/                   # 源代码
│   ├── pages/             # 页面组件
│   │   ├── index/         # 首页
│   │   ├── identify/      # 识别页面
│   │   ├── history/       # 历史记录
│   │   └── profile/       # 个人中心
│   ├── utils/             # 工具类
│   │   └── cloud.ts       # 云开发工具类
│   ├── app.tsx            # 应用入口
│   └── app.scss           # 全局样式
├── types/                 # TypeScript 类型定义
│   └── global.d.ts        # 全局类型定义
├── project.config.json    # 微信小程序配置
├── tsconfig.json          # TypeScript 配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 功能模块

### 1. 首页 (pages/index)
- 欢迎界面
- 用户信息展示
- 功能导航
- 最近识别记录

### 2. 识别页面 (pages/identify)
- 相机拍照识别
- 相册选择识别
- 识别结果展示
- 植物详细信息

### 3. 历史记录 (pages/history)
- 识别历史列表
- 收藏夹管理
- 搜索功能
- 记录删除

### 4. 个人中心 (pages/profile)
- 用户信息管理
- 统计数据展示
- 功能设置
- 关于信息

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install --legacy-peer-deps
```

### 开发模式
```bash
# 微信小程序开发
npm run dev:weapp

# H5开发
npm run dev:h5
```

### 构建生产版本
```bash
# 微信小程序构建
npm run build:weapp

# H5构建
npm run build:h5
```

## TypeScript 支持

项目已完全迁移到 TypeScript，提供完整的类型支持：

### 类型定义
- `UserInfo` - 用户信息接口
- `IdentificationRecord` - 识别记录接口
- `IdentificationResult` - 识别结果接口
- `Statistics` - 统计数据接口
- `CloudUtils` - 云开发工具类接口

### 类型检查
```bash
# 运行类型检查
npx tsc --noEmit
```

## 腾讯云开发配置

### 1. 创建云开发环境
1. 登录腾讯云控制台
2. 创建云开发环境
3. 获取环境ID

### 2. 配置云函数
需要创建以下云函数：
- `identifyPlant` - 植物识别函数
- `getUserInfo` - 获取用户信息函数

### 3. 配置数据库
创建以下数据集合：
- `identifications` - 识别记录
- `users` - 用户信息

### 4. 更新配置
在 `src/utils/cloud.ts` 中更新环境ID：
```typescript
const cloud: CloudUtils = {
  envId: 'your-env-id', // 替换为你的环境ID
  // ...
}
```

## 移动端适配

项目已针对不同屏幕尺寸进行了适配：

- **小屏设备** (≤375px): 紧凑布局
- **中屏设备** (376px-413px): 标准布局  
- **大屏设备** (≥414px): 宽松布局

## 开发注意事项

1. **微信小程序限制**
   - 单个文件大小不超过 2MB
   - 总包大小不超过 20MB
   - 注意图片资源优化

2. **云开发使用**
   - 注意云函数调用频率限制
   - 合理使用数据库查询
   - 及时清理无用文件

3. **TypeScript 开发**
   - 严格类型检查
   - 接口定义完整
   - 类型安全保证

4. **性能优化**
   - 图片懒加载
   - 组件按需加载
   - 减少不必要的重渲染

## 部署说明

1. 构建项目：`npm run build:weapp`
2. 在微信开发者工具中导入项目
3. 配置小程序 AppID
4. 上传代码到微信后台
5. 提交审核

## 版本信息

- **版本**: 1.0.0
- **更新日期**: 2024-01-01
- **兼容性**: 微信小程序基础库 2.19.4+
- **TypeScript**: 4.1.0+

## 许可证

© 2024 花草识AI. All rights reserved. 