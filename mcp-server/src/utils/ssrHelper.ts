import React from 'react';
import { renderToString } from 'react-dom/server';
import Md2Poster from '../components/Md2Poster.js';
import Md2PosterHeader from '../components/Md2PosterHeader.js';
import Md2PosterContent from '../components/Md2PosterContent.js';
import Md2PosterFooter from '../components/Md2PosterFooter.js';
import { RenderOptions } from '../types.js';

export function renderMarkdownToHTML(options: RenderOptions): string {
  const { markdown, theme, aspectRatio, size, template } = options;

  // Create the React element with template support
  const posterElement = React.createElement(
    Md2Poster,
    { theme, aspectRatio, size },
    template === 'NewsDigest' ? 
      React.createElement(
        Md2PosterHeader,
        { className: "flex justify-center items-center px-4 font-medium text-lg py-2" },
        React.createElement('span', null, new Date().toISOString().slice(0, 10))
      ) :
      React.createElement(
        Md2PosterHeader,
        { className: "flex justify-center items-center px-4 font-medium text-lg" },
        React.createElement('span', null, new Date().toISOString().slice(0, 10))
      ),
    React.createElement(
      Md2PosterContent,
      null,
      markdown
    ),
    template === 'NewsDigest' ?
      React.createElement(
        Md2PosterFooter,
        { className: 'text-left text-sm py-2' },
        'Powered by MCP Markdown-to-Image'
      ) :
      React.createElement(
        Md2PosterFooter,
        { className: 'text-center' },
        'Powered by MCP Markdown-to-Image'
      )
  );

  // Render to string
  const htmlContent = renderToString(posterElement);

  // Create complete HTML document
  return createHTMLDocument(htmlContent, theme, size, template);
}

function createHTMLDocument(content: string, theme: string, size: string, template?: string): string {
  const sizeClasses = size === 'mobile' ? 'max-w-lg' : 'max-w-4xl';
  
  // Template-specific styles
  const templateStyles = template === 'NewsDigest' ? `
      /* NewsDigest template specific styles */
      .news-digest-header { text-align: left; padding: 0.5rem 0; }
      .news-digest-footer { text-align: left; font-size: 0.875rem; padding: 0.5rem 0; }
  ` : '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Poster</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; padding: 2rem; background-color: #f3f4f6; font-family: system-ui, -apple-system, sans-serif; }
      .markdown-to-image-root { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 4rem); }
      
      /* Typography styles for markdown content */
      .prose { max-width: none; }
      .prose h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937; }
      .prose h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem; color: #374151; }
      .prose h3 { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; color: #4b5563; }
      .prose p { margin-bottom: 1rem; line-height: 1.6; color: #6b7280; }
      .prose ul, .prose ol { margin-bottom: 1rem; padding-left: 1.5rem; }
      .prose li { margin-bottom: 0.5rem; color: #6b7280; }
      .prose img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
      .prose code { background-color: rgba(0,0,0,0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
      .prose pre { background-color: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
      .prose a { color: #3b82f6; text-decoration: underline; }
      .prose strong { font-weight: bold; }
      .prose em { font-style: italic; }
      
      /* Theme-specific background */
      .bg-spring-gradient-wave {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      /* Template-specific styles */
      ${templateStyles}
      
      /* Responsive adjustments */
      @media (max-width: 640px) {
        body { padding: 1rem; }
        .${sizeClasses} { max-width: 100%; }
      }
    </style>
</head>
<body>
    <div id="root">${content}</div>
</body>
</html>`;
}