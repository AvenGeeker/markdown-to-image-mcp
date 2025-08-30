import React from 'react';
import { cn } from '../utils/index.js';

interface Md2PosterHeaderProps {
  children?: any;
  className?: string;
}

const Md2PosterHeader: React.FC<Md2PosterHeaderProps> = ({ children, className }) => {
  return <div className={cn('text-white py-4 text-center', className)}>{children}</div>;
};

export default Md2PosterHeader;