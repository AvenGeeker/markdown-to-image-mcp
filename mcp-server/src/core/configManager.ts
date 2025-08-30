import { ThemeConfig, TemplateConfig, ThemeType, TemplateType, AspectRatioType } from '../types.js';

export class ConfigManager {
  private themes: Map<string, ThemeConfig> = new Map();
  private templates: Map<string, TemplateConfig> = new Map();

  constructor() {
    this.initializeThemes();
    this.initializeTemplates();
  }

  getTheme(themeId: string): ThemeConfig | null {
    return this.themes.get(themeId) || null;
  }

  getTemplate(templateId: string): TemplateConfig | null {
    return this.templates.get(templateId) || null;
  }

  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  validateConfig(config: any): boolean {
    // Basic validation - can be expanded
    return config && typeof config === 'object';
  }

  private initializeThemes(): void {
    const themeConfigs: ThemeConfig[] = [
      {
        id: 'blue',
        name: 'Ocean Blue',
        description: 'A calm blue gradient theme with ocean vibes',
        colorScheme: {
          primary: '#3B82F6',
          secondary: '#06B6D4',
          background: 'linear-gradient(to bottom right, #3B82F6, #06B6D4, #3B82F6)'
        },
        className: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500'
      },
      {
        id: 'pink',
        name: 'Sunset Pink',
        description: 'A warm pink gradient with sunset colors',
        colorScheme: {
          primary: '#EC4899',
          secondary: '#F87171',
          background: 'linear-gradient(to bottom right, #EC4899, #F87171, #EC4899)'
        },
        className: 'bg-gradient-to-br from-pink-600/80 via-red-400/80 to-pink-600/60'
      },
      {
        id: 'purple',
        name: 'Royal Purple',
        description: 'An elegant purple theme with royal feel',
        colorScheme: {
          primary: '#9333EA',
          secondary: '#A855F7',
          background: 'linear-gradient(to right, #9333EA, #A855F7)'
        },
        className: 'bg-gradient-to-r from-purple-600 to-purple-700'
      },
      {
        id: 'green',
        name: 'Forest Green',
        description: 'A natural green theme inspired by forests',
        colorScheme: {
          primary: '#059669',
          secondary: '#047857',
          background: 'linear-gradient(to bottom right, #059669, #047857)'
        },
        className: 'bg-gradient-to-br from-green-600/80 to-green-800/80'
      },
      {
        id: 'yellow',
        name: 'Golden Sun',
        description: 'A bright yellow theme with sun-like warmth',
        colorScheme: {
          primary: '#EAB308',
          secondary: '#FB923C',
          background: 'linear-gradient(to bottom right, #EAB308, #FB923C, #EAB308)'
        },
        className: 'bg-gradient-to-br from-yellow-500 via-orange-300 to-yellow-500'
      },
      {
        id: 'gray',
        name: 'Elegant Gray',
        description: 'A sophisticated monochrome theme',
        colorScheme: {
          primary: '#374151',
          secondary: '#000000',
          background: 'linear-gradient(to bottom right, #000000, #374151, #000000)'
        },
        className: 'bg-gradient-to-br from-black/90 via-gray-700 to-black/90'
      },
      {
        id: 'red',
        name: 'Fire Red',
        description: 'A bold red theme with fiery energy',
        colorScheme: {
          primary: '#EF4444',
          secondary: '#F97316',
          background: 'linear-gradient(to right, #EF4444, #F97316)'
        },
        className: 'bg-gradient-to-r from-red-500 to-orange-500'
      },
      {
        id: 'indigo',
        name: 'Deep Indigo',
        description: 'A deep indigo theme with mystical vibes',
        colorScheme: {
          primary: '#4F46E5',
          secondary: '#2563EB',
          background: 'linear-gradient(to bottom right, #4F46E5, #2563EB, #4F46E5)'
        },
        className: 'bg-gradient-to-br from-indigo-700 via-blue-600/80 to-indigo-700'
      },
      {
        id: 'SpringGradientWave',
        name: 'Spring Gradient Wave',
        description: 'A dynamic spring-themed gradient with wave patterns',
        colorScheme: {
          primary: '#667eea',
          secondary: '#764ba2',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        className: 'bg-spring-gradient-wave bg-cover'
      }
    ];

    themeConfigs.forEach(theme => {
      this.themes.set(theme.id, theme);
    });
  }

  private initializeTemplates(): void {
    const templateConfigs: TemplateConfig[] = [
      {
        id: 'QuoteCard',
        name: 'Quote Card',
        description: 'A clean template suitable for quotes and short content',
        supportedAspectRatios: ['auto', '16/9', '1/1', '4/3']
      },
      {
        id: 'NewsDigest',
        name: 'News Digest',
        description: 'A template designed for news articles and longer content',
        supportedAspectRatios: ['auto', '16/9', '4/3']
      }
    ];

    templateConfigs.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Utility methods for validation
  isValidTheme(theme: string): boolean {
    return this.themes.has(theme);
  }

  isValidTemplate(template: string): boolean {
    return this.templates.has(template);
  }

  isValidAspectRatio(aspectRatio: string): boolean {
    const validRatios: AspectRatioType[] = ['auto', '16/9', '1/1', '4/3'];
    return validRatios.includes(aspectRatio as AspectRatioType);
  }

  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }
}