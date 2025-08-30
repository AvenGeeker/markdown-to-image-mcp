import { ImageGenerator } from '../core/imageGenerator.js';
import { GenerateMarkdownPosterParams, GenerateResult } from '../types.js';

export class GeneratePosterTool {
  private imageGenerator: ImageGenerator;
  private isInitialized = false;

  constructor() {
    this.imageGenerator = new ImageGenerator();
  }

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.imageGenerator.initialize();
      this.isInitialized = true;
    }
  }

  async execute(params: GenerateMarkdownPosterParams): Promise<GenerateResult> {
    try {
      await this.initialize();
      return await this.imageGenerator.generateFromMarkdown(params.markdown, params);
    } catch (error) {
      console.error('Error in GeneratePosterTool:', error);
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

  async cleanup(): Promise<void> {
    if (this.isInitialized) {
      await this.imageGenerator.cleanup();
      this.isInitialized = false;
    }
  }

  // Tool definition for MCP
  static getToolDefinition() {
    return {
      name: 'generateMarkdownPoster',
      description: 'Generate a visual poster image from Markdown content with customizable themes and templates',
      inputSchema: {
        type: 'object',
        properties: {
          markdown: {
            type: 'string',
            description: 'The Markdown content to render as a poster'
          },
          theme: {
            type: 'string',
            enum: ['blue', 'pink', 'purple', 'green', 'yellow', 'gray', 'red', 'indigo', 'SpringGradientWave'],
            description: 'The theme to apply to the poster',
            default: 'blue'
          },
          template: {
            type: 'string',
            enum: ['QuoteCard', 'NewsDigest'],
            description: 'The template layout to use',
            default: 'QuoteCard'
          },
          aspectRatio: {
            type: 'string',
            enum: ['auto', '16/9', '1/1', '4/3'],
            description: 'The aspect ratio of the generated image',
            default: 'auto'
          },
          size: {
            type: 'string',
            enum: ['desktop', 'mobile'],
            description: 'The size preset for the poster',
            default: 'mobile'
          },
          format: {
            type: 'string',
            enum: ['png', 'jpeg'],
            description: 'The output image format',
            default: 'png'
          },
          quality: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            description: 'Image quality (1-100, only applies to JPEG format)',
            default: 90
          },
          width: {
            type: 'number',
            minimum: 100,
            maximum: 4000,
            description: 'Custom width in pixels',
            default: 800
          },
          height: {
            type: 'number',
            minimum: 100,
            maximum: 4000,
            description: 'Custom height in pixels',
            default: 600
          }
        },
        required: ['markdown']
      }
    };
  }
}