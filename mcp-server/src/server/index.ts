#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { GeneratePosterTool } from '../tools/generatePoster.js';
import { ListThemesTool } from '../tools/listThemes.js';
import { ListTemplatesTool } from '../tools/listTemplates.js';
import { PreviewMarkdownTool } from '../tools/previewMarkdown.js';
import { ConvertBase64ToImageTool } from '../tools/convertBase64ToImage.js';

// Import resources
import { ThemesResource } from '../resources/themes.js';
import { TemplatesResource } from '../resources/templates.js';

class MarkdownPosterMCPServer {
  private server: Server;
  private generatePosterTool: GeneratePosterTool;
  private listThemesTool: ListThemesTool;
  private listTemplatesTool: ListTemplatesTool;
  private previewMarkdownTool: PreviewMarkdownTool;
  private convertBase64ToImageTool: ConvertBase64ToImageTool;

  constructor() {
    this.server = new Server(
      {
        name: 'markdown-poster-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Initialize tools
    this.generatePosterTool = new GeneratePosterTool();
    this.listThemesTool = new ListThemesTool();
    this.listTemplatesTool = new ListTemplatesTool();
    this.previewMarkdownTool = new PreviewMarkdownTool();
    this.convertBase64ToImageTool = new ConvertBase64ToImageTool();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          GeneratePosterTool.getToolDefinition(),
          ListThemesTool.getToolDefinition(),
          ListTemplatesTool.getToolDefinition(),
          PreviewMarkdownTool.getToolDefinition(),
          ConvertBase64ToImageTool.getToolDefinition(),
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generateMarkdownPoster': {
            const result = await this.generatePosterTool.execute(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'listThemes': {
            const themes = await this.listThemesTool.execute();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(themes, null, 2),
                },
              ],
            };
          }

          case 'listTemplates': {
            const templates = await this.listTemplatesTool.execute();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(templates, null, 2),
                },
              ],
            };
          }

          case 'previewMarkdown': {
            const preview = await this.previewMarkdownTool.execute(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(preview, null, 2),
                },
              ],
            };
          }

          case 'convertBase64ToImage': {
            const result = await this.convertBase64ToImageTool.execute(args as any);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: errorMessage }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });

    // Handle resource listing
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const themeResources = await ThemesResource.listResources();
      const templateResources = await TemplatesResource.listResources();

      return {
        resources: [...themeResources, ...templateResources],
      };
    });

    // Handle resource reading
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        let content: any;

        if (uri.startsWith('markdown-poster://themes/')) {
          content = await ThemesResource.handleRequest(uri);
        } else if (uri.startsWith('markdown-poster://templates/')) {
          content = await TemplatesResource.handleRequest(uri);
        } else {
          throw new Error(`Unknown resource URI: ${uri}`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(content, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ error: `Failed to read resource ${uri}: ${errorMessage}` }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Markdown Poster MCP Server started successfully');
  }

  async cleanup(): Promise<void> {
    try {
      await this.generatePosterTool.cleanup();
      console.error('Server cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down gracefully...');
  await server.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  await server.cleanup();
  process.exit(0);
});

// Start the server
const server = new MarkdownPosterMCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default MarkdownPosterMCPServer;