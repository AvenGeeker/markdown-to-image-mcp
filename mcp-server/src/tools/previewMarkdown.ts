import { renderMarkdownToHTML } from '../utils/ssrHelper.js';
import { RenderOptions, ThemeType, TemplateType } from '../types.js';

interface PreviewParams {
  markdown: string;
  theme?: ThemeType;
  template?: TemplateType;
}

export class PreviewMarkdownTool {
  async execute(params: PreviewParams): Promise<{ html: string }> {
    try {
      const renderOptions: RenderOptions = {
        markdown: params.markdown,
        theme: params.theme || 'blue',
        template: params.template || 'QuoteCard',
        aspectRatio: 'auto',
        size: 'mobile'
      };

      const html = renderMarkdownToHTML(renderOptions);
      return { html };
    } catch (error) {
      throw new Error(`Preview generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Tool definition for MCP
  static getToolDefinition() {
    return {
      name: 'previewMarkdown',
      description: 'Preview markdown content as HTML before generating the poster image',
      inputSchema: {
        type: 'object',
        properties: {
          markdown: {
            type: 'string',
            description: 'The Markdown content to preview'
          },
          theme: {
            type: 'string',
            enum: ['blue', 'pink', 'purple', 'green', 'yellow', 'gray', 'red', 'indigo', 'SpringGradientWave'],
            description: 'The theme to apply to the preview',
            default: 'blue'
          },
          template: {
            type: 'string',
            enum: ['QuoteCard', 'NewsDigest'],
            description: 'The template layout to use for preview',
            default: 'QuoteCard'
          }
        },
        required: ['markdown']
      }
    };
  }
}