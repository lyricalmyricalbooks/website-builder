import React from 'react';

interface TextBlockProps {
  settings: {
    content?: string;
    fontSize?: string; // 'text-sm' | 'text-base' | 'text-xl' | 'text-4xl' | etc.
    fontWeight?: string; // 'font-normal' | 'font-semibold' | 'font-bold'
    color?: string; // hex or tailwind class
    alignment?: 'text-left' | 'text-center' | 'text-right' | 'text-justify';
    lineHeight?: string;
  };
  theme?: any;
}

export const TextBlock: React.FC<TextBlockProps> = ({ settings, theme }) => {
  const {
    content = 'Double click to edit text',
    fontSize = 'text-base',
    fontWeight = 'font-normal',
    color = 'inherit',
    alignment = 'text-left',
    lineHeight = 'leading-relaxed',
  } = settings;

  // If color is hex, use it as inline style, otherwise use tailwind class
  const isHexColor = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('var');
  const textStyle: React.CSSProperties = {
    color: isHexColor ? color : undefined,
    fontFamily: theme?.typography?.bodyFont ? `var(--font-${theme.typography.bodyFont.toLowerCase()}, inherit)` : undefined,
  };

  return (
    <div
      className={`w-full h-full p-2 ${alignment} ${fontSize} ${fontWeight} ${lineHeight} ${
        !isHexColor && color !== 'inherit' ? color : ''
      }`}
      style={textStyle}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TextBlock;
