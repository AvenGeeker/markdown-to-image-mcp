import { themes } from '../themes/index.js';
import { ThemeConfig } from '../types.js';

export class ListThemesTool {
  async execute(): Promise<ThemeConfig[]> {
    return themes;
  }

  // Tool definition for MCP
  static getToolDefinition() {
    return {
      name: 'listThemes',
      description: 'Get a list of all available themes for markdown posters',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }
}