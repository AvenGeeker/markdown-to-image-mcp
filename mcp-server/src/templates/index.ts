import { TemplateConfig } from '../types.js';

export const templates: TemplateConfig[] = [
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