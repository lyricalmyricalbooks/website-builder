'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ButtonBlockProps {
  settings: {
    text?: string;
    link?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    magnetic?: boolean;
    borderRadius?: string;
    padding?: string;
  };
  theme?: any;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ settings, theme }) => {
  const {
    text = 'Shop Now',
    link = '#',
    variant = 'primary',
    magnetic = true,
    borderRadius = 'rounded-md',
    padding = 'px-6 py-3',
  } = settings;

  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth elastic movement
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center (max pull of 15px)
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const buttonColors = {
    primary: {
      bg: theme?.colors?.buttonBg || '#3b82f6',
      text: theme?.colors?.buttonText || '#ffffff',
      border: 'border-transparent',
      borderColor: 'transparent',
    },
    secondary: {
      bg: theme?.colors?.secondary || '#4b5563',
      text: '#ffffff',
      border: 'border-transparent',
      borderColor: 'transparent',
    },
    outline: {
      bg: 'transparent',
      text: theme?.colors?.buttonBg || '#3b82f6',
      border: `border-2`,
      borderColor: theme?.colors?.buttonBg || '#3b82f6',
    },
  };

  const activeColors = buttonColors[variant] || buttonColors.primary;

  const buttonStyle: React.CSSProperties = {
    backgroundColor: variant !== 'outline' ? activeColors.bg : undefined,
    color: activeColors.text,
    borderColor: variant === 'outline' ? activeColors.borderColor : undefined,
    fontFamily: theme?.typography?.bodyFont ? `var(--font-${theme.typography.bodyFont.toLowerCase()}, inherit)` : undefined,
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          ...buttonStyle,
          x: springX,
          y: springY,
        }}
        className={`w-full text-center font-medium transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${padding} ${borderRadius} ${
          variant === 'outline' ? 'border' : ''
        } ${isHovered ? 'shadow-md brightness-110' : 'shadow-sm'}`}
      >
        <a href={link} className="block w-full h-full" onClick={(e) => e.preventDefault()}>
          {text}
        </a>
      </motion.button>
    </div>
  );
};

export default ButtonBlock;
