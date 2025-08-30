import React from 'react';
import { cn } from '../utils/index.js';

interface Md2PosterFooterProps {
  children?: any;
  className?: string;
}

const Md2PosterFooter: React.FC<Md2PosterFooterProps> = ({ children, className }) => {
  return <div className={cn('text-gray-50 py-4 text-center', className)}>{children}</div>;
};

export default Md2PosterFooter;