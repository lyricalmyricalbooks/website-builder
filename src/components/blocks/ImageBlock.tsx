import React from 'react';

interface ImageBlockProps {
  settings: {
    src?: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
    focalPoint?: { x: number; y: number }; // Percentage 0-100
    borderRadius?: string; // 'rounded-none' | 'rounded-md' | 'rounded-full' | etc.
    shadow?: string; // 'shadow-none' | 'shadow-md' | 'shadow-lg'
    filter?: string; // 'none' | 'grayscale' | 'blur' | 'darken' | 'grayscale-darken'
    overlayColor?: string; // hex or rgba overlay
    hoverEffect?: 'scale' | 'none';
  };
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ settings }) => {
  const {
    src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    alt = 'E-commerce product placeholder',
    objectFit = 'cover',
    focalPoint = { x: 50, y: 50 },
    borderRadius = 'rounded-md',
    shadow = 'shadow-sm',
    filter = 'none',
    overlayColor = 'transparent',
    hoverEffect = 'none',
  } = settings;

  // Map filter settings to CSS filter
  let resolvedFilter = '';
  if (filter === 'grayscale') {
    resolvedFilter = 'grayscale(100%)';
  } else if (filter === 'blur') {
    resolvedFilter = 'blur(4px)';
  } else if (filter === 'darken') {
    resolvedFilter = 'brightness(50%)';
  } else if (filter === 'grayscale-darken') {
    resolvedFilter = 'grayscale(100%) brightness(50%)';
  }

  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
    width: '100%',
    height: '100%',
    filter: resolvedFilter || undefined,
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease',
  };

  return (
    <div className={`w-full h-full overflow-hidden relative group/img ${borderRadius} ${shadow}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${hoverEffect === 'scale' ? 'transition-transform duration-700 ease-out group-hover/img:scale-105' : ''}`}
        style={imageStyle}
        loading="lazy"
      />
      {overlayColor && overlayColor !== 'transparent' && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: overlayColor }}
        />
      )}
    </div>
  );
};

export default ImageBlock;
