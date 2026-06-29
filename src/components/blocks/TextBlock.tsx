import React from 'react';

interface TextBlockProps {
  settings: {
    content?: string;
    fontSize?: string; // 'text-sm' | 'text-base' | 'text-xl' | 'text-4xl' | etc.
    fontWeight?: string; // 'font-normal' | 'font-semibold' | 'font-bold'
    color?: string; // hex or tailwind class
    alignment?: 'text-left' | 'text-center' | 'text-right' | 'text-justify';
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    fontFamily?: string;
    textGradient?: boolean;
    textGradientColor?: string;
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
    letterSpacing = 'tracking-normal',
    textTransform = 'normal-case',
    fontFamily = 'default',
    textGradient = false,
    textGradientColor = 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  } = settings;

  // Generate a unique ID to scope link styles
  const blockId = React.useMemo(() => `txt-${Math.random().toString(36).substr(2, 9)}`, []);

  // Resolve font family overrides
  let resolvedFontFamily = undefined;
  if (fontFamily === 'font-serif') {
    resolvedFontFamily = '"Playfair Display", "Lora", Georgia, serif';
  } else if (fontFamily === 'font-sans') {
    resolvedFontFamily = '"DM Sans", "Inter", sans-serif';
  } else if (fontFamily === 'font-mono') {
    resolvedFontFamily = 'monospace';
  } else if (theme?.typography?.bodyFont) {
    resolvedFontFamily = theme.typography.bodyFont === 'Playfair Display' || theme.typography.bodyFont === 'Lora'
      ? `"${theme.typography.bodyFont}", Georgia, serif`
      : `"${theme.typography.bodyFont}", sans-serif`;
  }

  const isHexColor = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('var');
  const isGradientActive = textGradient && textGradientColor;

  const textStyle: React.CSSProperties = {
    color: isGradientActive ? 'transparent' : (isHexColor ? color : undefined),
    backgroundImage: isGradientActive ? textGradientColor : undefined,
    WebkitBackgroundClip: isGradientActive ? 'text' : undefined,
    backgroundClip: isGradientActive ? 'text' : undefined,
    fontFamily: resolvedFontFamily,
  };

  return (
    <div className="w-full h-full relative" id={blockId}>
      <style dangerouslySetInnerHTML={{ __html: `
        #${blockId} a {
          color: ${theme?.colors?.primary || '#3b82f6'};
          text-decoration: underline;
          transition: opacity 0.2s ease;
          pointer-events: auto;
        }
        #${blockId} a:hover {
          opacity: 0.7;
        }
      ` }} />
      <div
        className={`w-full h-full p-2 ${alignment} ${fontSize} ${fontWeight} ${lineHeight} ${letterSpacing} ${textTransform} ${
          !isHexColor && color !== 'inherit' && !isGradientActive ? color : ''
        }`}
        style={textStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default TextBlock;
