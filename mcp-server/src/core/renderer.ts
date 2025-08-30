import puppeteer, { Browser, Page } from 'puppeteer';
import { RenderOptions, OptimizeOptions, ImageFormat } from '../types.js';
import { renderMarkdownToHTML } from '../utils/ssrHelper.js';

interface RenderParams {
  html: string;
  width?: number;
  height?: number;
  format?: ImageFormat;
  quality?: number;
}

export class MarkdownRenderer {
  private browser: Browser | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized && this.browser) {
      return;
    }

    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
        ]
      });
      this.isInitialized = true;
      console.log('Puppeteer browser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Puppeteer browser:', error);
      throw new Error(`Browser initialization failed: ${error}`);
    }
  }

  async renderToHTML(options: RenderOptions): Promise<string> {
    return renderMarkdownToHTML(options);
  }

  async renderToImage(params: RenderParams): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      
      // Set viewport size
      await page.setViewport({
        width: params.width || 800,
        height: params.height || 600,
        deviceScaleFactor: 2, // For high DPI images
      });

      // Set content
      await page.setContent(params.html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Take screenshot
      const screenshotOptions: any = {
        type: params.format || 'png',
        fullPage: true,
        omitBackground: false,
      };

      if (params.format === 'jpeg' && params.quality) {
        screenshotOptions.quality = params.quality;
      }

      const buffer = await page.screenshot(screenshotOptions);
      return Buffer.from(buffer);

    } catch (error) {
      console.error('Error rendering to image:', error);
      throw new Error(`Image rendering failed: ${error}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
      console.log('Puppeteer browser closed');
    }
  }

  private generateHTMLTemplate(options: RenderOptions): string {
    // This is a temporary implementation
    // Will be replaced with actual React SSR
    const { markdown, theme, size } = options;
    
    const themeClasses = this.getThemeClasses(theme);
    const sizeClasses = size === 'mobile' ? 'max-w-lg p-6' : 'max-w-4xl p-16';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Poster</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .markdown-content h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
      .markdown-content h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem; }
      .markdown-content h3 { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }
      .markdown-content p { margin-bottom: 1rem; line-height: 1.6; }
      .markdown-content ul, .markdown-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
      .markdown-content li { margin-bottom: 0.5rem; }
      .markdown-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
      .markdown-content code { background-color: rgba(0,0,0,0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
      .markdown-content pre { background-color: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
      .bg-spring-gradient-wave {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    </style>
</head>
<body class="m-0 p-8 bg-gray-100">
    <div class="w-full relative ${themeClasses} ${sizeClasses} text-white rounded-lg">
        <div class="markdown-content">
            ${this.parseMarkdownToHTML(markdown)}
        </div>
    </div>
</body>
</html>`;
  }

  private getThemeClasses(theme: string): string {
    const themeMap: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500',
      pink: 'bg-gradient-to-br from-pink-600/80 via-red-400/80 to-pink-600/60',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700',
      green: 'bg-gradient-to-br from-green-600/80 to-green-800/80',
      yellow: 'bg-gradient-to-br from-yellow-500 via-orange-300 to-yellow-500',
      gray: 'bg-gradient-to-br from-black/90 via-gray-700 to-black/90',
      red: 'bg-gradient-to-r from-red-500 to-orange-500',
      indigo: 'bg-gradient-to-br from-indigo-700 via-blue-600/80 to-indigo-700',
      SpringGradientWave: 'bg-spring-gradient-wave bg-cover',
    };
    return themeMap[theme] || themeMap.blue;
  }

  private parseMarkdownToHTML(markdown: string): string {
    // Basic markdown parsing - will be replaced with react-markdown
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
      .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  }
}