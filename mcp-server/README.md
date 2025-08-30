# MCP Markdown-to-Image Server

A Model Context Protocol (MCP) server that converts Markdown content into beautiful, shareable poster images. This service enables AI assistants to generate visual social media posters from markdown text with customizable themes and templates.

## Features

- **Markdown to Image Conversion**: Transform markdown content into visually appealing poster images
- **Multiple Themes**: 9 built-in themes including gradients and special patterns
- **Template Support**: Different layout templates for various content types
- **Customizable Output**: Support for different sizes, aspect ratios, and image formats
- **Server-Side Rendering**: Uses React SSR for consistent rendering
- **High-Quality Images**: Puppeteer-based rendering for crisp, high-resolution images
- **Base64 to Image Conversion**: Convert Base64 encoded image data to PNG or JPG format

## Available Tools

### 1. generateMarkdownPoster
Generate a poster image from markdown content.

**Parameters:**
- `markdown` (required): The markdown content to convert
- `theme` (optional): Theme selection (`blue`, `pink`, `purple`, `green`, `yellow`, `gray`, `red`, `indigo`, `SpringGradientWave`)
- `template` (optional): Template type (`QuoteCard`, `NewsDigest`)
- `aspectRatio` (optional): Image aspect ratio (`auto`, `16/9`, `1/1`, `4/3`)
- `size` (optional): Size preset (`desktop`, `mobile`)
- `format` (optional): Output format (`png`, `jpeg`)
- `quality` (optional): Image quality for JPEG (1-100)
- `width` (optional): Custom width in pixels (100-4000)
- `height` (optional): Custom height in pixels (100-4000)

**Returns:**
- Base64 encoded image data
- Image metadata (width, height, format, file size)

### 2. listThemes
Get a list of all available themes with their descriptions and color schemes.

### 3. listTemplates
Get a list of all available templates with their supported aspect ratios.

### 4. previewMarkdown
Preview markdown content as HTML before generating the actual image.

### 5. convertBase64ToImage
Convert Base64 encoded image data to PNG or JPG format.

**Parameters:**
- `base64Data` (required): Base64 encoded image data
- `format` (optional): Output format (`png`, `jpeg`), defaults to `png`
- `quality` (optional): Image quality for JPEG (1-100), defaults to 90

**Returns:**
- Base64 encoded image data in the specified format
- Image metadata (format, file size)

## Available Resources

### Themes Resource
- **URI Pattern**: `markdown-poster://themes/{themeId}`
- **Access**: Individual theme configurations or all themes with `_all`

### Templates Resource
- **URI Pattern**: `markdown-poster://templates/{templateId}`
- **Access**: Individual template configurations or all templates with `_all`

## Installation

### Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn

### Setup

1. Navigate to the MCP server directory:
```bash
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Running the Server
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Running Comprehensive Tests
```bash
npm run test:comprehensive
```

### As a Library
```javascript
import { MarkdownPosterMCPServer } from 'mcp-markdown-to-image-server';

const server = new MarkdownPosterMCPServer();
await server.start();
```

## MCP Client Configuration

To use this server with an MCP client, add the following configuration:

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

## Example Usage

### Basic Poster Generation
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

### Advanced Configuration
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

## Themes

| Theme | Description |
|-------|-------------|
| `blue` | Ocean Blue - A calm blue gradient with ocean vibes |
| `pink` | Sunset Pink - A warm pink gradient with sunset colors |
| `purple` | Royal Purple - An elegant purple theme |
| `green` | Forest Green - A natural green theme inspired by forests |
| `yellow` | Golden Sun - A bright yellow theme with sun-like warmth |
| `gray` | Elegant Gray - A sophisticated monochrome theme |
| `red` | Fire Red - A bold red theme with fiery energy |
| `indigo` | Deep Indigo - A deep indigo theme with mystical vibes |
| `SpringGradientWave` | A dynamic spring-themed gradient with wave patterns |

## Templates

| Template | Description | Supported Aspect Ratios |
|----------|-------------|-------------------------|
| `QuoteCard` | Clean template for quotes and short content | All ratios |
| `NewsDigest` | Template for news articles and longer content | `auto`, `16/9`, `4/3` |

## Technical Details

### Architecture
- **Rendering Engine**: Puppeteer for HTML-to-image conversion
- **React SSR**: Server-side rendering for consistent output
- **Theme System**: Tailwind CSS-based theming
- **Image Processing**: High-DPI support with quality optimization

### Performance
- Browser instance pooling for efficient rendering
- Configurable timeouts and resource limits
- Memory management and cleanup

### Security
- Input validation and sanitization
- Resource usage limits
- Sandboxed browser execution

## Error Handling

The server includes comprehensive error handling:

- **Validation Errors**: Invalid parameters or markdown content
- **Rendering Errors**: Issues during HTML generation or image capture
- **Resource Errors**: Memory or timeout limitations
- **Format Errors**: Unsupported output formats or sizes

## Development

### Project Structure
```
mcp-server/
├── src/
│   ├── components/     # React components for SSR
│   ├── core/          # Core rendering and image generation
│   ├── resources/     # MCP resource handlers
│   ├── server/        # MCP server implementation
│   ├── themes/        # Theme configurations
│   ├── templates/     # Template configurations
│   ├── tools/         # MCP tool implementations
│   ├── utils/         # Utility functions
│   └── types.ts       # TypeScript type definitions
├── dist/              # Compiled JavaScript output
└── package.json
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache-2.0

## Support

For issues and questions:
- Check the GitHub issues
- Review the documentation
- Submit a new issue with detailed information

---

**Note**: This MCP server requires a headless browser environment. Ensure your deployment environment supports Puppeteer and has adequate resources for image generation.