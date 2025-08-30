import sharp from 'sharp';
import { ConvertBase64ToImageParams, ConvertBase64ToImageResult } from '../types.js';

export class ConvertBase64ToImageTool {
  async execute(args: ConvertBase64ToImageParams): Promise<ConvertBase64ToImageResult> {
    try {
      // Validate input
      if (!args.base64Data) {
        return {
          success: false,
          error: 'Base64 data is required',
          metadata: {
            format: '',
            size: 0
          }
        };
      }

      // Set default values
      const format = args.format || 'png';
      const quality = args.quality || 90;

      // Validate quality for JPEG
      if (format === 'jpeg' && (quality < 1 || quality > 100)) {
        return {
          success: false,
          error: 'Quality must be between 1 and 100 for JPEG format',
          metadata: {
            format: '',
            size: 0
          }
        };
      }

      // Remove data URL prefix if present
      let base64Data = args.base64Data;
      if (base64Data.startsWith('data:image')) {
        base64Data = base64Data.split(',')[1];
      }

      // Validate Base64 format
      if (!this.isValidBase64(base64Data)) {
        return {
          success: false,
          error: 'Invalid Base64 data format',
          metadata: {
            format: '',
            size: 0
          }
        };
      }

      // Convert Base64 to Buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Process image with Sharp
      let processedImage = sharp(imageBuffer);
      
      // Get metadata of original image
      const metadata = await processedImage.metadata();
      
      // Convert to specified format
      if (format === 'jpeg') {
        processedImage = processedImage.jpeg({ quality });
      } else {
        processedImage = processedImage.png();
      }

      // Get the processed image buffer
      const outputBuffer = await processedImage.toBuffer();
      
      // Convert back to Base64
      const imageData = outputBuffer.toString('base64');
      
      return {
        success: true,
        imageData,
        metadata: {
          format,
          size: outputBuffer.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          format: '',
          size: 0
        }
      };
    }
  }

  private isValidBase64(str: string): boolean {
    try {
      // Check if string contains only valid Base64 characters
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(str) && str.length % 4 === 0;
    } catch {
      return false;
    }
  }

  // Tool definition for MCP
  static getToolDefinition() {
    return {
      name: 'convertBase64ToImage',
      description: 'Convert Base64 encoded image data to PNG or JPG format',
      inputSchema: {
        type: 'object',
        properties: {
          base64Data: {
            type: 'string',
            description: 'Base64 encoded image data'
          },
          format: {
            type: 'string',
            enum: ['png', 'jpeg'],
            description: 'Output image format',
            default: 'png'
          },
          quality: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            description: 'Image quality for JPEG format (1-100)',
            default: 90
          }
        },
        required: ['base64Data']
      }
    };
  }
}