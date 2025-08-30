import React from 'react';
import { cn } from '../utils/index.js';
import { ThemeType, AspectRatioType, SizeType, TemplateType } from '../types.js';

interface Md2PosterProps {
  children?: any;
  className?: string;
  theme?: ThemeType;
  aspectRatio?: AspectRatioType;
  size?: SizeType;
  template?: TemplateType;
}

const themeMapClassName = {
  //gradient
  blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500',
  pink: 'bg-gradient-to-br from-pink-600/80 via-red-400/80 to-pink-600/60',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700',
  green: 'bg-gradient-to-br from-green-600/80 to-green-800/80',
  yellow: 'bg-gradient-to-br from-yellow-500 via-orange-300 to-yellow-500',
  gray: 'bg-gradient-to-br from-black/90 via-gray-700 to-black/90',
  red: 'bg-gradient-to-r from-red-500 to-orange-500',
  indigo: 'bg-gradient-to-br from-indigo-700 via-blue-600/80 to-indigo-700',
  //image bg
  SpringGradientWave: 'bg-spring-gradient-wave bg-cover',
};

const aspectRatioMapClassName = {
  auto: 'aspect-auto',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
};

const Md2Poster: React.FC<Md2PosterProps> = ({
  children,
  theme = 'blue',
  className,
  aspectRatio = 'auto',
  size = 'mobile',
  template = 'QuoteCard'
}) => {
  const aspectRatioClassName = aspectRatioMapClassName[aspectRatio];
  const themeClassName = themeMapClassName[theme];
  // Template-specific sizing
  const sizeClassName = size === 'mobile' ? 
    (template === 'NewsDigest' ? 'max-w-lg p-4' : 'max-w-lg p-6') : 
    (template === 'NewsDigest' ? 'max-w-4xl p-8' : 'max-w-4xl p-16');

  return (
    <div className="markdown-to-image-root">
      <div
        className={cn('w-full relative', themeClassName, aspectRatioClassName, className, sizeClassName)}
      >
        {children}
      </div>
    </div>
  );
};

export default Md2Poster;