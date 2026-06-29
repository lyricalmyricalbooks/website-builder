'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Block, Section, ThemeSettings } from '@/types/editor';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { ProductCardBlock } from './blocks/ProductCardBlock';
import { SearchBlock } from './blocks/SearchBlock';

// Helper to execute compiled code for custom components
const executeCustomComponent = (codeStr: string): React.ComponentType<any> | null => {
  if (!codeStr) return null;
  try {
    const exports: any = {};
    const localRequire = (mod: string) => {
      if (mod === 'react') return React;
      if (mod === 'framer-motion') return require('framer-motion');
      throw new Error(`Module not allowed in sandbox: ${mod}`);
    };
    
    // Transpiled code from sucrase usually targets exports.default or exports.Component
    const fn = new Function('exports', 'require', 'React', codeStr);
    fn(exports, localRequire, React);
    return exports.default || exports.Component || null;
  } catch (err) {
    console.error('Error executing custom component:', err);
    return null;
  }
};

interface AnimatedBlockProps {
  block: Block;
  theme: ThemeSettings;
  customComponents: Record<string, string>;
  breakpoint: 'desktop' | 'mobile';
  isPreview: boolean;
}

const AnimatedBlock: React.FC<AnimatedBlockProps> = ({
  block,
  theme,
  customComponents,
  breakpoint,
  isPreview,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pos = breakpoint === 'mobile' ? block.position.mobile : block.position.desktop;

  // Scroll Parallax setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxSpeed = block.animation?.type === 'scroll-parallax' ? (block.animation.speed ?? 0.3) * 100 : 0;
  const y = useTransform(scrollYProgress, [0, 1], [-parallaxSpeed, parallaxSpeed]);

  // Render the specific block type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock settings={block.settings} theme={theme} />;
      case 'image':
        return <ImageBlock settings={block.settings} />;
      case 'button':
        return <ButtonBlock settings={block.settings} theme={theme} />;
      case 'product-card':
        return <ProductCardBlock settings={block.settings} theme={theme} />;
      case 'search':
        return <SearchBlock settings={block.settings} />;
      case 'group': {
        const {
          backgroundColor = 'transparent',
          padding = 'p-0',
          borderRadius = 'rounded-none',
          shadow = 'shadow-none',
          backdropBlur = 'backdrop-blur-none',
          borderColor = 'transparent',
          borderWidth = 'border-0',
        } = block.settings;

        const isHexBg = backgroundColor.startsWith('#') || backgroundColor.startsWith('rgb') || backgroundColor.startsWith('rgba') || backgroundColor.startsWith('var') || backgroundColor.startsWith('linear-gradient');
        const groupStyle: React.CSSProperties = {
          background: isHexBg ? backgroundColor : undefined,
          borderColor: borderColor !== 'transparent' ? borderColor : undefined,
          borderStyle: borderWidth !== 'border-0' ? 'solid' : undefined,
        };

        return (
          <div
            className={`w-full h-full ${padding} ${borderRadius} ${shadow} ${backdropBlur} ${borderWidth} ${
              !isHexBg && backgroundColor !== 'transparent' ? backgroundColor : ''
            }`}
            style={groupStyle}
          >
            {!isPreview && (
              <div className="absolute inset-0 border border-dashed border-slate-800/30 pointer-events-none rounded-inherit" />
            )}
          </div>
        );
      }
      case 'custom':
        if (block.componentName && customComponents[block.componentName]) {
          const CustomComponent = executeCustomComponent(customComponents[block.componentName]);
          if (CustomComponent) {
            try {
              return <CustomComponent settings={block.settings} theme={theme} />;
            } catch (e) {
              return (
                <div className="p-4 text-red-500 border border-dashed border-red-400 bg-red-50 text-xs rounded-lg">
                  Runtime error in {block.componentName}
                </div>
              );
            }
          }
        }
        return (
          <div className="p-4 text-gray-400 border border-dashed border-gray-300 text-xs rounded-lg text-center">
            Custom block: {block.componentName || 'None'}
          </div>
        );
      default:
        return <div className="p-2 text-xs text-gray-400">Unknown block type</div>;
    }
  };

  const blockStyle: React.CSSProperties = {
    gridColumnStart: pos.x_start,
    gridColumnEnd: pos.x_end,
    gridRowStart: pos.y_start,
    gridRowEnd: pos.y_end,
    zIndex: pos.z_index,
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  // Entrance animations config
  let initial = {};
  let animate = {};
  let transition = {
    delay: (block.animation?.delay ?? 0) / 1000,
    duration: (block.animation?.duration ?? 600) / 1000,
    ease: [0.16, 1, 0.3, 1] as any, // Smooth custom cubic bezier
  };

  if (!isPreview) {
    if (block.animation?.type === 'fade-in') {
      initial = { opacity: 0 };
      animate = { opacity: 1 };
    } else if (block.animation?.type === 'slide-up') {
      initial = { opacity: 0, y: 40 };
      animate = { opacity: 1, y: 0 };
    } else if (block.animation?.type === 'zoom') {
      initial = { opacity: 0, scale: 0.95 };
      animate = { opacity: 1, scale: 1 };
    }
  }

  return (
    <motion.div
      ref={containerRef}
      style={{
        ...blockStyle,
        y: block.animation?.type === 'scroll-parallax' ? y : undefined,
      }}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-50px' }}
      transition={transition}
      className="group/block"
    >
      {renderBlockContent()}
    </motion.div>
  );
};

interface GridRendererProps {
  section: Section;
  theme: ThemeSettings;
  customComponents: Record<string, string>;
  breakpoint: 'desktop' | 'mobile';
  isPreview?: boolean;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  section,
  theme,
  customComponents,
  breakpoint,
  isPreview = false,
}) => {
  const cols = breakpoint === 'mobile' ? 8 : 24;

  const sectionStyle: React.CSSProperties = {
    backgroundColor: section.settings.backgroundColor || '#ffffff',
    color: section.settings.textColor || '#111827',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridAutoRows: 'minmax(20px, auto)',
    gap: '12px',
    position: 'relative',
    width: '100%',
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <section
      style={sectionStyle}
      className={`w-full px-6 md:px-12 ${section.settings.paddingY || 'py-20'} overflow-hidden`}
    >
      <div style={gridStyle}>
        {/* Render grid lines in background if in editor mode and not preview */}
        {!isPreview && (
          <div className="absolute inset-0 grid pointer-events-none opacity-5" style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridAutoRows: 'minmax(20px, auto)',
            gap: '12px',
          }}>
            {Array.from({ length: cols * 10 }).map((_, i) => (
              <div key={i} className="border border-gray-950 h-[20px]" />
            ))}
          </div>
        )}

        {/* Render actual blocks */}
        {section.blocks.map((block) => (
          <AnimatedBlock
            key={block.id}
            block={block}
            theme={theme}
            customComponents={customComponents}
            breakpoint={breakpoint}
            isPreview={isPreview}
          />
        ))}
      </div>
    </section>
  );
};

export default GridRenderer;
