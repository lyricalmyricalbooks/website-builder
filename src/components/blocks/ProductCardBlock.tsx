'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardBlockProps {
  settings: {
    title?: string;
    price?: string;
    imageSrc?: string;
    badge?: string;
    buttonText?: string;
  };
  theme?: any;
}

export const ProductCardBlock: React.FC<ProductCardBlockProps> = ({ settings, theme }) => {
  const {
    title = 'Premium Leather Backpack',
    price = '$189.00',
    imageSrc = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=60',
    badge = 'New',
    buttonText = 'Add to Cart',
  } = settings;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="w-full h-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        {badge && (
          <span
            style={{ backgroundColor: theme?.colors?.primary || '#3b82f6' }}
            className="absolute top-3 left-3 z-10 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            {badge}
          </span>
        )}
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.3 }}
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3
            style={{ fontFamily: theme?.typography?.headingFont ? `var(--font-${theme.typography.headingFont.toLowerCase()}, inherit)` : undefined }}
            className="text-gray-800 font-semibold text-base line-clamp-1 mb-1"
          >
            {title}
          </h3>
          <p className="text-gray-900 font-bold text-lg mb-4">{price}</p>
        </div>

        <button
          style={{
            backgroundColor: theme?.colors?.buttonBg || '#3b82f6',
            color: theme?.colors?.buttonText || '#ffffff',
            fontFamily: theme?.typography?.bodyFont ? `var(--font-${theme.typography.bodyFont.toLowerCase()}, inherit)` : undefined,
          }}
          className="w-full py-2.5 text-center text-sm font-medium rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all duration-150 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Added ${title} to cart!`);
          }}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCardBlock;
