# 工程架构文档

## 1. 项目概述
本项目是一个基于 Gulp 构建的微信 H5 全屏滚动网站模板，适用于移动设备。主要功能包括全屏滚动、背景音乐控制、动画效果等。

## 2. 目录结构
```
├── app/
│   ├── dist/          # 构建输出目录
│   └── src/           # 源代码目录
│       ├── audios/    # 音频资源
│       ├── fonts/     # 字体文件
│       ├── images/    # 图片资源
│       ├── javascripts/ # JavaScript 文件
│       │   ├── animation-control.js # 动画控制逻辑
│       │   └── main.js # 主逻辑文件
│       └── scss/      # SCSS 样式文件
│           ├── base/  # 基础样式
│           ├── components/ # 组件样式
│           ├── helpers/ # 辅助工具
│           └── slides/ # 页面区块样式
├── config/            # 配置文件
│   └── vendors.js    # 第三方库配置
├── gulpfile.js        # Gulp 构建脚本
└── package.json      # 项目依赖配置
```

## 3. 技术栈
- **构建工具**: Gulp
- **样式预处理器**: SCSS
- **JavaScript 库**: jQuery, Swiper
- **动画库**: animate.css
- **依赖管理**: npm

## 4. 核心模块
### 4.1 全屏滚动
- 使用 Swiper 实现全屏滚动效果。
- 支持垂直滚动和动画切换。

### 4.2 背景音乐控制
- 通过 `main.js` 实现背景音乐的播放和暂停功能。

### 4.3 动画效果
- 使用 `animation-control.js` 管理页面元素的动画触发逻辑。

## 5. 构建流程
1. **资源处理**: 图片压缩、字体复制、SCSS 编译。
2. **脚本合并与压缩**: 使用 Browserify 和 Uglify 处理 JavaScript。
3. **开发服务器**: 通过 BrowserSync 提供实时预览。

## 6. 依赖项
- **开发依赖**: Gulp 及相关插件（如 gulp-sass、gulp-autoprefixer 等）。
- **运行时依赖**: jQuery、Swiper、animate.css 等。

## 7. 后续优化建议
- 引入 Webpack 替代 Gulp 以优化构建性能。
- 增加单元测试和 E2E 测试。
- 优化移动端性能，减少首屏加载时间。