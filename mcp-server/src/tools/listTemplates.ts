import { templates } from '../templates/index.js';
import { TemplateConfig } from '../types.js';

export class ListTemplatesTool {
  async execute(): Promise<TemplateConfig[]> {
    return templates;
  }

  // Tool definition for MCP
  static getToolDefinition() {
    return {
      name: 'listTemplates',
      description: 'Get a list of all available templates for markdown posters',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }
}