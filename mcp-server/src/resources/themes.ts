import { themes } from '../themes/index.js';
import { ThemeConfig } from '../types.js';

export class ThemesResource {
  private static readonly URI_SCHEME = 'markdown-poster';
  private static readonly RESOURCE_TYPE = 'themes';

  // Get resource definition for MCP
  static getResourceDefinition() {
    return {
      uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/{themeId}`,
      name: 'Theme Configurations',
      description: 'Access detailed configuration for specific themes',
      mimeType: 'application/json'
    };
  }

  // Handle resource requests
  static async handleRequest(uri: string): Promise<any> {
    const parsedUri = this.parseThemeUri(uri);
    
    if (!parsedUri) {
      throw new Error(`Invalid theme resource URI: ${uri}`);
    }

    const { themeId } = parsedUri;

    if (themeId === '_all') {
      // Return all themes
      return {
        themes: themes,
        count: themes.length
      };
    }

    // Find specific theme
    const theme = themes.find(t => t.id === themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    return theme;
  }

  // List all available theme resources
  static async listResources(): Promise<Array<{ uri: string; name: string; description: string; mimeType: string }>> {
    const resources = [];

    // Add resource for all themes
    resources.push({
      uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/_all`,
      name: 'All Themes',
      description: 'Complete list of all available themes',
      mimeType: 'application/json'
    });

    // Add resource for each individual theme
    for (const theme of themes) {
      resources.push({
        uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/${theme.id}`,
        name: `Theme: ${theme.name}`,
        description: theme.description,
        mimeType: 'application/json'
      });
    }

    return resources;
  }

  private static parseThemeUri(uri: string): { themeId: string } | null {
    const pattern = new RegExp(`^${this.URI_SCHEME}://${this.RESOURCE_TYPE}/(.+)$`);
    const match = uri.match(pattern);
    
    if (!match) {
      return null;
    }

    return {
      themeId: match[1]
    };
  }
}