import { templates } from '../templates/index.js';
import { TemplateConfig } from '../types.js';

export class TemplatesResource {
  private static readonly URI_SCHEME = 'markdown-poster';
  private static readonly RESOURCE_TYPE = 'templates';

  // Get resource definition for MCP
  static getResourceDefinition() {
    return {
      uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/{templateId}`,
      name: 'Template Configurations',
      description: 'Access detailed configuration for specific templates',
      mimeType: 'application/json'
    };
  }

  // Handle resource requests
  static async handleRequest(uri: string): Promise<any> {
    const parsedUri = this.parseTemplateUri(uri);
    
    if (!parsedUri) {
      throw new Error(`Invalid template resource URI: ${uri}`);
    }

    const { templateId } = parsedUri;

    if (templateId === '_all') {
      // Return all templates
      return {
        templates: templates,
        count: templates.length
      };
    }

    // Find specific template
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return template;
  }

  // List all available template resources
  static async listResources(): Promise<Array<{ uri: string; name: string; description: string; mimeType: string }>> {
    const resources = [];

    // Add resource for all templates
    resources.push({
      uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/_all`,
      name: 'All Templates',
      description: 'Complete list of all available templates',
      mimeType: 'application/json'
    });

    // Add resource for each individual template
    for (const template of templates) {
      resources.push({
        uri: `${this.URI_SCHEME}://${this.RESOURCE_TYPE}/${template.id}`,
        name: `Template: ${template.name}`,
        description: template.description,
        mimeType: 'application/json'
      });
    }

    return resources;
  }

  private static parseTemplateUri(uri: string): { templateId: string } | null {
    const pattern = new RegExp(`^${this.URI_SCHEME}://${this.RESOURCE_TYPE}/(.+)$`);
    const match = uri.match(pattern);
    
    if (!match) {
      return null;
    }

    return {
      templateId: match[1]
    };
  }
}