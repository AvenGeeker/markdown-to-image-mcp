// Theme types
export type ThemeType = 
  | 'blue' 
  | 'pink' 
  | 'purple' 
  | 'green' 
  | 'yellow' 
  | 'gray' 
  | 'red' 
  | 'indigo' 
  | 'SpringGradientWave';

// Template types
export type TemplateType = 'QuoteCard' | 'NewsDigest';

// Aspect ratio types
export type AspectRatioType = 'auto' | '16/9' | '1/1' | '4/3';

// Size types
export type SizeType = 'desktop' | 'mobile';

// Image format types
export type ImageFormat = 'png' | 'jpeg';

// Generate poster parameters
export interface GenerateMarkdownPosterParams {
  markdown: string;
  theme?: ThemeType;
  template?: TemplateType;
  aspectRatio?: AspectRatioType;
  size?: SizeType;
  format?: ImageFormat;
  quality?: number; // 1-100
  width?: number;
  height?: number;
}

// Generate result
export interface GenerateResult {
  success: boolean;
  imageData?: string; // Base64 encoded image data
  imageUrl?: string; // Temporary image URL
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number; // File size in bytes
  };
  error?: string;
}

// Theme configuration
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
  className: string;
}

// Template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview?: string;
  supportedAspectRatios: AspectRatioType[];
}

// Render options
export interface RenderOptions {
  markdown: string;
  theme: ThemeType;
  template: TemplateType;
  aspectRatio: AspectRatioType;
  size: SizeType;
}

// Optimize options
export interface OptimizeOptions {
  format: ImageFormat;
  quality: number;
}