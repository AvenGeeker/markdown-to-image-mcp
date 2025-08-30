# Markdown-to-Image MCP 服务改造

本项目成功将原有的 `markdown-to-image` React 组件库改造为 Model Context Protocol (MCP) 服务，使 AI 助手能够直接调用 markdown 转图片功能。

## 改造概述

### 原项目架构
- **技术栈**: React + TypeScript + Tailwind CSS + Vite
- **核心功能**: 将 Markdown 内容渲染为视觉海报图片
- **使用方式**: React 组件库，需要集成到前端应用中

### 改造后架构
- **技术栈**: Node.js + TypeScript + Puppeteer + React SSR + MCP SDK
- **核心功能**: 通过 MCP 协议提供 markdown 转图片服务
- **使用方式**: AI 助手可直接调用的后端服务

## 项目结构

```
markdown-to-image-mcp/
├── src/                          # 原 React 组件库
│   ├── packages/                 # 核心组件
│   │   ├── Md2Poster/           # 主容器组件
│   │   ├── Md2PosterContent/    # 内容组件
│   │   ├── Md2PosterHeader/     # 标题组件
│   │   └── Md2PosterFooter/     # 页脚组件
│   └── lib/                     # 工具库
├── mcp-server/                   # 新增 MCP 服务
│   ├── src/
│   │   ├── components/          # 适配的 React 组件
│   │   ├── core/               # 核心渲染引擎
│   │   ├── tools/              # MCP 工具实现
│   │   ├── resources/          # MCP 资源处理
│   │   ├── themes/             # 主题配置
│   │   ├── templates/          # 模板配置
│   │   ├── server/             # MCP 服务器
│   │   └── utils/              # 工具函数
│   ├── test/                   # 测试脚本
│   └── dist/                   # 编译输出
└── example/                     # 原 Web 编辑器示例
```

## 核心改造内容

### 1. 架构转换
- **从客户端到服务端**: 将浏览器端组件转换为服务端渲染
- **从组件库到服务**: 封装为独立的 MCP 服务
- **从截图到渲染**: 使用 Puppeteer 进行服务端截图

### 2. 技术实现

#### 渲染引擎 (`core/renderer.ts`)
```typescript
class MarkdownRenderer {
  private browser: Browser;
  
  async renderToHTML(options: RenderOptions): Promise<string>;
  async renderToImage(params: RenderParams): Promise<Buffer>;
}
```

#### 图片生成器 (`core/imageGenerator.ts`)
```typescript
class ImageGenerator {
  async generateFromMarkdown(
    markdown: string,
    options: GenerateOptions
  ): Promise<GenerateResult>;
}
```

#### SSR 适配 (`utils/ssrHelper.ts`)
- 将 React 组件服务端渲染为 HTML
- 集成 Tailwind CSS 样式
- 生成完整的 HTML 文档

### 3. MCP 工具定义

#### generateMarkdownPoster
- **功能**: 生成 markdown 海报图片
- **参数**: markdown 内容、主题、模板、尺寸等
- **返回**: Base64 编码的图片数据和元数据

#### listThemes
- **功能**: 获取可用主题列表
- **返回**: 包含 9 种预设主题的详细信息

#### listTemplates
- **功能**: 获取可用模板列表
- **返回**: QuoteCard 和 NewsDigest 模板信息

#### previewMarkdown
- **功能**: 预览 markdown 渲染效果
- **返回**: HTML 预览内容

### 4. MCP 资源定义

#### 主题资源
- **URI**: `markdown-poster://themes/{themeId}`
- **功能**: 访问特定主题配置信息

#### 模板资源  
- **URI**: `markdown-poster://templates/{templateId}`
- **功能**: 访问特定模板配置信息

## 功能特性

### 支持的主题
1. **Ocean Blue** - 海洋蓝渐变
2. **Sunset Pink** - 日落粉渐变
3. **Royal Purple** - 皇家紫
4. **Forest Green** - 森林绿
5. **Golden Sun** - 金色太阳
6. **Elegant Gray** - 优雅灰
7. **Fire Red** - 火焰红
8. **Deep Indigo** - 深靛蓝
9. **Spring Gradient Wave** - 春日渐变波浪

### 支持的模板
- **QuoteCard**: 适合引用和短内容
- **NewsDigest**: 适合新闻文章和长内容

### 输出配置
- **格式**: PNG、JPEG
- **尺寸**: Desktop、Mobile
- **宽高比**: Auto、16:9、1:1、4:3
- **质量**: 1-100 (JPEG)
- **自定义尺寸**: 100-4000 像素

## 使用方式

### 1. 构建和启动
```bash
cd mcp-server
npm install
npm run build
npm start
```

### 2. MCP 客户端配置
```json
{
  "mcpServers": {
    "markdown-poster": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

### 3. 调用示例
```json
{
  "tool": "generateMarkdownPoster",
  "arguments": {
    "markdown": "# Hello World\\n\\nThis is a **beautiful** poster!",
    "theme": "SpringGradientWave",
    "size": "mobile"
  }
}
```

## 测试

### 手动测试
```bash
cd mcp-server
npm run test:manual
```

测试会生成多个示例图片到 `test-output` 目录，验证：
- 不同主题效果
- 不同尺寸输出
- 不同格式支持
- 工具功能完整性

## 技术优势

### 1. 性能优化
- **浏览器实例复用**: 避免频繁启动浏览器
- **内存管理**: 及时清理资源
- **并发控制**: 限制同时处理任务数

### 2. 安全性
- **输入验证**: 严格验证所有参数
- **资源限制**: 限制文件大小和渲染时间
- **沙箱隔离**: 浏览器安全沙箱执行

### 3. 扩展性
- **模块化设计**: 易于添加新主题和模板
- **配置化**: 主题和模板完全配置化
- **类型安全**: TypeScript 提供完整类型支持

## 部署建议

### 系统要求
- Node.js 18+
- 足够内存支持 Puppeteer 运行
- 支持无头浏览器的环境

### Docker 部署
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### 环境配置
- 确保有足够磁盘空间存储临时文件
- 配置适当的超时时间
- 监控内存使用情况

## 扩展开发

### 添加新主题
1. 在 `src/themes/index.ts` 中添加主题配置
2. 更新 TypeScript 类型定义
3. 在组件中添加对应的 CSS 类名

### 添加新模板
1. 在 `src/templates/index.ts` 中定义模板
2. 在 SSR 辅助函数中实现模板逻辑
3. 更新工具定义的枚举值

### 添加新工具
1. 在 `src/tools/` 目录创建新工具
2. 实现工具逻辑和 MCP 定义
3. 在服务器中注册新工具

## 总结

本次改造成功将 React 组件库转换为功能完整的 MCP 服务，实现了：

✅ **完整功能迁移**: 保留了原有的所有核心功能  
✅ **MCP 协议集成**: 符合 MCP 标准的工具和资源定义  
✅ **性能优化**: 服务端渲染和资源管理优化  
✅ **类型安全**: 完整的 TypeScript 类型支持  
✅ **扩展性设计**: 易于添加新功能和配置  
✅ **文档完善**: 详细的使用说明和示例  

现在 AI 助手可以直接调用这个 MCP 服务来生成精美的 markdown 海报图片，大大提升了内容创作的效率和质量。