'use client';

import React from 'react';
import Link from 'next/link';
import { GridRenderer } from '@/components/GridRenderer';
import { PageLayout } from '@/types/editor';

// Hardcoded initial layout for the public storefront demo
const DEMO_LAYOUT: PageLayout = {
  id: 'demo_storefront',
  title: 'Antigravity Storefront',
  navigation: [],
  theme: {
    colors: {
      primary: '#2563eb',
      secondary: '#1e293b',
      background: '#ffffff',
      text: '#0f172a',
      buttonBg: '#2563eb',
      buttonText: '#ffffff',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    spacingScale: [4, 8, 12, 16, 24, 32, 48, 64],
    checkout: {
      accentColor: '#2563eb',
      backgroundColor: '#ffffff',
      inputBorderRadius: 'rounded-md',
      fontFamily: 'Inter',
    },
  },
  customComponents: {
    'FeatureCard': `// Transpiled feature card
export default function FeatureCard({ settings }) {
  return (
    <div className="p-6 h-full bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div>
        <div className="w-10 h-10 mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold">
          ⚡
        </div>
        <h4 className="text-lg font-semibold mb-2 text-slate-800">{settings.title || "Custom Element"}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{settings.description || "Designed in Monaco, compiled on the client."}</p>
      </div>
    </div>
  );
}`
  },
  sections: [
    {
      id: 'sec_1',
      type: 'hero',
      settings: {
        backgroundColor: '#ffffff',
        paddingY: 'py-28',
        textColor: '#0f172a',
      },
      blocks: [
        {
          id: 'b1',
          type: 'text',
          settings: {
            content: '<span class="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">State-of-the-Art Visual Commerce</span><h1><b>Crafting High-Performance Storefronts</b></h1>',
            fontSize: 'text-5xl md:text-6xl',
            fontWeight: 'font-extrabold',
            color: '#0f172a',
            alignment: 'text-left',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 14, y_end: 5, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 5, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 100, duration: 800 },
        },
        {
          id: 'b2',
          type: 'text',
          settings: {
            content: '<p>A layout engine built using a fluid 24-column CSS Grid. Experience absolute design freedom with zero-bloat rendering and spring-physics micro-interactions.</p>',
            fontSize: 'text-lg',
            color: '#475569',
            alignment: 'text-left',
          },
          position: {
            desktop: { x_start: 2, y_start: 5, x_end: 13, y_end: 7, z_index: 1 },
            mobile: { x_start: 1, y_start: 5, x_end: 9, y_end: 7, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 200, duration: 800 },
        },
        {
          id: 'b3',
          type: 'button',
          settings: {
            text: 'Launch Visual Editor',
            variant: 'primary',
            magnetic: true,
          },
          position: {
            desktop: { x_start: 2, y_start: 7, x_end: 7, y_end: 9, z_index: 1 },
            mobile: { x_start: 1, y_start: 7, x_end: 9, y_end: 9, z_index: 1 },
          },
          animation: { type: 'zoom', delay: 300, duration: 600 },
        },
        {
          id: 'b4',
          type: 'image',
          settings: {
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
            alt: 'Analytics and design',
            objectFit: 'cover',
            borderRadius: 'rounded-2xl',
            shadow: 'shadow-xl',
          },
          position: {
            desktop: { x_start: 14, y_start: 1, x_end: 24, y_end: 9, z_index: 1 },
            mobile: { x_start: 1, y_start: 9, x_end: 9, y_end: 13, z_index: 1 },
          },
          animation: { type: 'fade-in', delay: 400, duration: 1000 },
        },
      ],
    },
    {
      id: 'sec_2',
      type: 'products',
      settings: {
        backgroundColor: '#f8fafc',
        paddingY: 'py-24',
        textColor: '#0f172a',
      },
      blocks: [
        {
          id: 'p_title',
          type: 'text',
          settings: {
            content: '<h2><b>Featured Collection</b></h2><p class="text-slate-500 mt-2">Curated premium products built for comfort and style.</p>',
            fontSize: 'text-3xl',
            fontWeight: 'font-bold',
            alignment: 'text-center',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 24, y_end: 3, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 3, z_index: 1 },
          },
        },
        {
          id: 'prod_1',
          type: 'product-card',
          settings: {
            title: 'Minimalist Leather Backpack',
            price: '$185.00',
            imageSrc: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600',
            badge: 'New',
          },
          position: {
            desktop: { x_start: 2, y_start: 3, x_end: 9, y_end: 8, z_index: 1 },
            mobile: { x_start: 1, y_start: 3, x_end: 9, y_end: 8, z_index: 1 },
          },
        },
        {
          id: 'prod_2',
          type: 'product-card',
          settings: {
            title: 'Premium Wireless Headphones',
            price: '$299.00',
            imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
            badge: 'Trending',
          },
          position: {
            desktop: { x_start: 9, y_start: 3, x_end: 16, y_end: 8, z_index: 1 },
            mobile: { x_start: 1, y_start: 8, x_end: 9, y_end: 13, z_index: 1 },
          },
        },
        {
          id: 'prod_3',
          type: 'product-card',
          settings: {
            title: 'Waterproof Sports Smartwatch',
            price: '$149.00',
            imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
            badge: 'Sale',
          },
          position: {
            desktop: { x_start: 16, y_start: 3, x_end: 23, y_end: 8, z_index: 1 },
            mobile: { x_start: 1, y_start: 13, x_end: 9, y_end: 18, z_index: 1 },
          },
        },
      ],
    },
  ],
};

export default function StorefrontHome() {
  // Transpile custom components
  const compiledComponents: Record<string, string> = {};
  Object.entries(DEMO_LAYOUT.customComponents).forEach(([name, code]) => {
    try {
      const { transform } = require('sucrase');
      compiledComponents[name] = transform(code, {
        transforms: ['jsx', 'typescript', 'imports'],
      }).code;
    } catch (e) {
      console.error(`Error compiling custom component ${name}:`, e);
    }
  });

  return (
    <div className="w-full min-h-screen bg-white relative">
      {/* Floating Call to Action to enter Editor */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/editor"
          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
        >
          <span>⚡ Open Visual Editor</span>
        </Link>
      </div>

      {/* Render layout */}
      <div className="w-full">
        {DEMO_LAYOUT.sections.map((section) => (
          <GridRenderer
            key={section.id}
            section={section}
            theme={DEMO_LAYOUT.theme}
            customComponents={compiledComponents}
            breakpoint="desktop"
            isPreview={true}
          />
        ))}
      </div>
    </div>
  );
}
