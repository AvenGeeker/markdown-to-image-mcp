import { MarkdownRenderer } from './renderer.js';
import { GenerateMarkdownPosterParams, GenerateResult, RenderOptions, OptimizeOptions } from '../types.js';

export class ImageGenerator {
  private renderer: MarkdownRenderer;

  constructor() {
    this.renderer = new MarkdownRenderer();
  }

  async initialize(): Promise<void> {
    await this.renderer.initialize();
  }

  async generateFromMarkdown(
    markdown: string,
    options: Partial<GenerateMarkdownPosterParams> = {}
  ): Promise<GenerateResult> {
    try {
      // Set default values
      const {
        theme = 'blue',
        template = 'QuoteCard',
        aspectRatio = 'auto',
        size = 'mobile',
        format = 'png',
        quality = 90,
        width = 800,
        height = 600
      } = options;

      // Validate inputs
      const fullOptions = { markdown, ...options };
      this.validateInputs(markdown, fullOptions);

      // Create render options
      const renderOptions: RenderOptions = {
        markdown,
        theme,
        template,
        aspectRatio,
        size
      };

      // Generate HTML
      const html = await this.renderer.renderToHTML(renderOptions);

      // Render to image
      const imageBuffer = await this.renderer.renderToImage({
        html,
        width,
        height,
        format,
        quality: format === 'jpeg' ? quality : undefined
      });

      // Optimize if needed
      const optimizedBuffer = await this.optimizeImage(imageBuffer, {
        format,
        quality
      });

      // Convert to base64
      const imageData = await this.convertToBase64(optimizedBuffer);

      // Get metadata
      const metadata = {
        width,
        height,
        format,
        size: optimizedBuffer.length
      };

      return {
        success: true,
        imageData,
        metadata
      };

    } catch (error) {
      console.error('Error generating image from markdown:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          width: 0,
          height: 0,
          format: 'unknown',
          size: 0
        }
      };
    }
  }

  async convertToBase64(buffer: Buffer): Promise<string> {
    return buffer.toString('base64');
  }

  async optimizeImage(
    buffer: Buffer,
    options: OptimizeOptions
  ): Promise<Buffer> {
    // For now, return the buffer as-is
    // In a production environment, you might want to use libraries like sharp
    // to optimize the image (resize, compress, etc.)
    return buffer;
  }

  async cleanup(): Promise<void> {
    await this.renderer.cleanup();
  }

  private validateInputs(markdown: string, options: GenerateMarkdownPosterParams): void {
    if (!markdown || typeof markdown !== 'string') {
      throw new Error('Markdown content is required and must be a string');
    }

    if (markdown.length > 50000) {
      throw new Error('Markdown content is too large (max 50KB)');
    }

    if (options.quality && (options.quality < 1 || options.quality > 100)) {
      throw new Error('Quality must be between 1 and 100');
    }

    if (options.width && (options.width < 100 || options.width > 4000)) {
      throw new Error('Width must be between 100 and 4000 pixels');
    }

    if (options.height && (options.height < 100 || options.height > 4000)) {
      throw new Error('Height must be between 100 and 4000 pixels');
    }

    const validThemes = ['blue', 'pink', 'purple', 'green', 'yellow', 'gray', 'red', 'indigo', 'SpringGradientWave'];
    if (options.theme && !validThemes.includes(options.theme)) {
      throw new Error(`Invalid theme. Valid themes: ${validThemes.join(', ')}`);
    }

    const validTemplates = ['QuoteCard', 'NewsDigest'];
    if (options.template && !validTemplates.includes(options.template)) {
      throw new Error(`Invalid template. Valid templates: ${validTemplates.join(', ')}`);
    }

    const validAspectRatios = ['auto', '16/9', '1/1', '4/3'];
    if (options.aspectRatio && !validAspectRatios.includes(options.aspectRatio)) {
      throw new Error(`Invalid aspect ratio. Valid ratios: ${validAspectRatios.join(', ')}`);
    }

    const validSizes = ['desktop', 'mobile'];
    if (options.size && !validSizes.includes(options.size)) {
      throw new Error(`Invalid size. Valid sizes: ${validSizes.join(', ')}`);
    }

    const validFormats = ['png', 'jpeg'];
    if (options.format && !validFormats.includes(options.format)) {
      throw new Error(`Invalid format. Valid formats: ${validFormats.join(', ')}`);
    }
  }
}