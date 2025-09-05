#!/bin/bash

# EMAS云函数打包脚本
# 使用方法: npm run package:function

set -e

echo "🚀 开始打包EMAS云函数..."

# 进入云函数目录
cd emas-functions/identifyPlant

# 检查是否存在node_modules，如果不存在则安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装云函数依赖..."
    npm install
fi

# 删除旧的打包文件
if [ -f "identifyPlant.zip" ]; then
    echo "🗑️  删除旧的打包文件..."
    rm identifyPlant.zip
fi

# 打包云函数
echo "📦 正在打包云函数..."
zip -r identifyPlant.zip . -x "*.md" "*.txt" ".DS_Store" "node_modules/.cache/*" "*.log"

# 检查打包结果
if [ -f "identifyPlant.zip" ]; then
    # 获取文件大小
    size=$(ls -lh identifyPlant.zip | awk '{print $5}')
    echo "✅ 打包完成！"
    echo "📁 文件位置: $(pwd)/identifyPlant.zip"
    echo "📊 文件大小: $size"
    echo ""
    echo "🎯 下一步操作："
    echo "1. 登录 EMAS 控制台: https://emas.console.aliyun.com/"
    echo "2. 进入项目 > Serverless > 云函数"
    echo "3. 上传 identifyPlant.zip 文件"
    echo "4. 部署并测试功能"
else
    echo "❌ 打包失败！"
    exit 1
fi
