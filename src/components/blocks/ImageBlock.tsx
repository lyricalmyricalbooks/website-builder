import React from 'react';

interface ImageBlockProps {
  settings: {
    src?: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
    focalPoint?: { x: number; y: number }; // Percentage 0-100
    borderRadius?: string; // 'rounded-none' | 'rounded-md' | 'rounded-full' | etc.
    shadow?: string; // 'shadow-none' | 'shadow-md' | 'shadow-lg'
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
  } = settings;

  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
    width: '100%',
    height: '100%',
  };

  return (
    <div className={`w-full h-full overflow-hidden ${borderRadius} ${shadow}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        loading="lazy"
      />
    </div>
  );
};

export default ImageBlock;
