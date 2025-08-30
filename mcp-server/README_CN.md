# MCP Markdown转图片服务器

一个Model Context Protocol (MCP)服务器，可以将Markdown内容转换为精美的可分享海报图片。该服务使AI助手能够从markdown文本生成视觉社交媒体海报，并支持自定义主题和模板。

## 功能特性

- **Markdown转图片**: 将markdown内容转换为视觉上吸引人的海报图片
- **多种主题**: 9种内置主题，包括渐变和特殊图案
- **模板支持**: 不同内容类型的布局模板
- **可定制输出**: 支持不同尺寸、宽高比和图片格式
- **服务端渲染**: 使用React SSR确保渲染一致性
- **高质量图片**: 基于Puppeteer的渲染，提供清晰的高分辨率图片
- **Base64转图片**: 将Base64编码的图片数据转换为PNG或JPG格式

## 可用工具

### 1. generateMarkdownPoster
从markdown内容生成海报图片。

**参数:**
- `markdown` (必需): 要转换的markdown内容
- `theme` (可选): 主题选择 (`blue`, `pink`, `purple`, `green`, `yellow`, `gray`, `red`, `indigo`, `SpringGradientWave`)
- `template` (可选): 模板类型 (`QuoteCard`, `NewsDigest`)
- `aspectRatio` (可选): 图片宽高比 (`auto`, `16/9`, `1/1`, `4/3`)
- `size` (可选): 尺寸预设 (`desktop`, `mobile`)
- `format` (可选): 输出格式 (`png`, `jpeg`)
- `quality` (可选): JPEG图片质量 (1-100)
- `width` (可选): 自定义宽度像素 (100-4000)
- `height` (可选): 自定义高度像素 (100-4000)

**返回:**
- Base64编码的图片数据
- 图片元数据 (宽度、高度、格式、文件大小)

### 2. listThemes
获取所有可用主题及其描述和配色方案的列表。

### 3. listTemplates
获取所有可用模板及其支持的宽高比的列表。

### 4. previewMarkdown
在生成实际图片之前预览markdown内容为HTML。

### 5. convertBase64ToImage
将Base64编码的图片数据转换为PNG或JPG格式。

**参数:**
- `base64Data` (必需): Base64编码的图片数据
- `format` (可选): 输出格式 (`png`, `jpeg`)，默认为`png`
- `quality` (可选): JPEG图片质量 (1-100)，默认为90

**返回:**
- 指定格式的Base64编码图片数据
- 图片元数据 (格式、文件大小)

## 可用资源

### 主题资源
- **URI模式**: `markdown-poster://themes/{themeId}`
- **访问**: 单个主题配置或使用`_all`获取所有主题

### 模板资源
- **URI模式**: `markdown-poster://templates/{templateId}`
- **访问**: 单个模板配置或使用`_all`获取所有模板

## 安装

### 先决条件
- Node.js 18或更高版本
- npm、pnpm或yarn

### 设置

1. 导航到MCP服务器目录:
```bash
cd mcp-server
```

2. 安装依赖:
```bash
npm install
```

3. 构建项目:
```bash
npm run build
```

## 使用方法

### 运行服务器
```bash
npm start
```

### 开发模式
```bash
npm run dev
```

### 运行综合测试
```bash
npm run test:comprehensive
```

### 作为库使用
```javascript
import { MarkdownPosterMCPServer } from 'mcp-markdown-to-image-server';

const server = new MarkdownPosterMCPServer();
await server.start();
```

## MCP客户端配置

要将此服务器与MCP客户端一起使用，请添加以下配置:

```json
{
  "mcpServers": {
    "markdown-poster": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## 使用示例

### 基本海报生成
```json
{
  "tool": "generateMarkdownPoster",
  "arguments": {
    "markdown": "# Hello World\n\nThis is a **beautiful** markdown poster!",
    "theme": "blue",
    "size": "mobile"
  }
}
```

### 高级配置
```json
{
  "tool": "generateMarkdownPoster",
  "arguments": {
    "markdown": "## Daily News\\n\\n- AI breakthrough in image generation\\n- New framework released\\n- Tech conference announced",
    "theme": "SpringGradientWave",
    "template": "NewsDigest",
    "aspectRatio": "16/9",
    "size": "desktop",
    "format": "png",
    "quality": 95
  }
}
```

### Base64转图片
```json
{
  "tool": "convertBase64ToImage",
  "arguments": {
    "base64Data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "format": "jpeg",
    "quality": 80
  }
}
```

## 主题

| 主题 | 描述 |
|------|------|
| `blue` | 海洋蓝 - 带有海洋气息的平静蓝色渐变 |
| `pink` | 日落粉 - 带有日落色彩的温暖粉色渐变 |
| `purple` | 皇家紫 - 优雅的紫色主题 |
| `green` | 森林绿 - 受森林启发的自然绿色主题 |
| `yellow` | 金色阳光 - 带有阳光般温暖的明亮黄色主题 |
| `gray` | 优雅灰 - 精致的单色主题 |
| `red` | 火焰红 - 带有火焰能量的大胆红色主题 |
| `indigo` | 深靛蓝 - 带有神秘气息的深靛蓝色主题 |
| `SpringGradientWave` | 动态的春季主题渐变，带有波浪图案 |

## 模板

| 模板 | 描述 | 支持的宽高比 |
|------|------|--------------|
| `QuoteCard` | 用于引用和短内容的简洁模板 | 所有比例 |
| `NewsDigest` | 用于新闻文章和长内容的模板 | `auto`, `16/9`, `4/3` |

## 技术细节

### 架构
- **渲染引擎**: Puppeteer用于HTML到图片的转换
- **React SSR**: 服务端渲染确保输出一致性
- **主题系统**: 基于Tailwind CSS的主题
- **图片处理**: 支持高DPI和质量优化

### 性能
- 浏览器实例池提高渲染效率
- 可配置的超时和资源限制
- 内存管理和清理

### 安全性
- 输入验证和清理
- 资源使用限制
- 沙盒化浏览器执行

## 错误处理

服务器包含全面的错误处理:

- **验证错误**: 无效参数或markdown内容
- **渲染错误**: HTML生成或图片捕获期间的问题
- **资源错误**: 内存或超时限制
- **格式错误**: 不支持的输出格式或尺寸

## 开发

### 项目结构
```
mcp-server/
├── src/
```