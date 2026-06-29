'use client';

import React from 'react';
import Link from 'next/link';
import { GridRenderer } from '@/components/GridRenderer';
import { PageLayout } from '@/types/editor';

const DEMO_LAYOUT: PageLayout = {
  id: 'lyricalmyrical_theme',
  title: 'Lyricalmyrical Books',
  theme: {
    colors: {
      primary: '#F61515',
      secondary: '#111111',
      background: '#000000',
      text: '#F9F9F9',
      buttonBg: '#FBFBFB',
      buttonText: '#020202',
    },
    typography: {
      headingFont: 'DM Sans',
      bodyFont: 'DM Sans',
    },
    spacingScale: [4, 8, 12, 16, 24, 32, 48, 64],
    checkout: {
      accentColor: '#F61515',
      backgroundColor: '#000000',
      inputBorderRadius: 'rounded-md',
      fontFamily: 'DM Sans',
    },
  },
  navigation: [
    { 
      id: 'nav_products', 
      label: 'Products', 
      url: '/products',
      children: [
        { id: 'nav_all', label: 'All Products', url: '/products' },
        { id: 'nav_books', label: 'Books', url: '/category/books' },
        { id: 'nav_zines', label: 'Zines', url: '/category/zines' },
      ]
    },
    { id: 'nav_about', label: 'About', url: '/about' },
    { id: 'nav_submissions', label: 'Submissions', url: '/submissions' },
    { id: 'nav_opencall', label: 'Open Call', url: '/open-call-collective-book' },
    { id: 'nav_roots', label: 'History', url: '/roots' },
    { id: 'nav_contact', label: 'Contact', url: '/contact' },
  ],
  customComponents: {},
  sections: [
    {
      id: 'sec_announcement',
      type: 'announcement',
      isGlobal: true,
      settings: {
        backgroundColor: '#000000',
        paddingY: 'py-2',
        textColor: '#F9F9F9',
      },
      blocks: [
        {
          id: 'blk_announce_text',
          type: 'text',
          settings: {
            content: '<p class="text-center text-xs tracking-wider uppercase">THE HOUND BY IAN WILLMS IS HERE &nbsp;|&nbsp; Shipping Internationally</p>',
            fontSize: 'text-xs',
            color: '#F9F9F9',
            alignment: 'text-center',
          },
          position: {
            desktop: { x_start: 1, y_start: 1, x_end: 25, y_end: 2, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 2, z_index: 1 },
          },
        }
      ]
    },
    {
      id: 'sec_header',
      type: 'header',
      isGlobal: true,
      settings: {
        backgroundColor: '#000000',
        paddingY: 'py-6',
        textColor: '#F9F9F9',
      },
      blocks: [
        {
          id: 'blk_logo',
          type: 'text',
          settings: {
            content: '<span class="font-bold text-lg uppercase tracking-widest text-white">Lyricalmyrical<b>Books</b></span>',
            fontSize: 'text-lg',
            color: '#F9F9F9',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 8, y_end: 2, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 6, y_end: 2, z_index: 1 },
          },
        },
        {
          id: 'blk_search',
          type: 'search',
          settings: {
            placeholder: 'Search art books & zines...',
          },
          position: {
            desktop: { x_start: 18, y_start: 1, x_end: 24, y_end: 2, z_index: 1 },
            mobile: { x_start: 1, y_start: 2, x_end: 9, y_end: 3, z_index: 1 },
          },
        }
      ]
    },
    {
      id: 'sec_hero',
      type: 'hero',
      settings: {
        backgroundColor: '#000000',
        paddingY: 'py-20',
        textColor: '#F9F9F9',
      },
      blocks: [
        {
          id: 'blk_hero_title',
          type: 'text',
          settings: {
            content: '<h1>Independent publishing house specializing in photography & art books.</h1>',
            fontSize: 'text-3xl md:text-4xl',
            fontWeight: 'font-medium',
            color: '#F9F9F9',
            alignment: 'text-left',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 14, y_end: 4, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 4, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 100, duration: 800 },
        },
        {
          id: 'blk_hero_subtitle',
          type: 'text',
          settings: {
            content: '<p>Based in Toronto with roots in Italy. Supporting artists and capturing presence through high-quality print publications.</p>',
            fontSize: 'text-base',
            color: '#A1A1AA',
            alignment: 'text-left',
          },
          position: {
            desktop: { x_start: 2, y_start: 4, x_end: 13, y_end: 6, z_index: 1 },
            mobile: { x_start: 1, y_start: 4, x_end: 9, y_end: 6, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 200, duration: 800 },
        },
        {
          id: 'blk_hero_button',
          type: 'button',
          settings: {
            text: 'Browse Publications',
            variant: 'primary',
            magnetic: true,
          },
          position: {
            desktop: { x_start: 2, y_start: 6, x_end: 7, y_end: 8, z_index: 1 },
            mobile: { x_start: 1, y_start: 6, x_end: 9, y_end: 8, z_index: 1 },
          },
          animation: { type: 'zoom', delay: 300, duration: 600 },
        },
        {
          id: 'blk_hero_image',
          type: 'image',
          settings: {
            src: 'https://assets.bigcartel.com/product_images/424080591/preview_DL01130214-2.jpg?auto=format&fit=max&w=1200',
            alt: 'The Hound by Ian Willms',
            objectFit: 'cover',
            borderRadius: 'rounded-xl',
            shadow: 'shadow-lg',
          },
          position: {
            desktop: { x_start: 15, y_start: 1, x_end: 24, y_end: 9, z_index: 1 },
            mobile: { x_start: 1, y_start: 9, x_end: 9, y_end: 13, z_index: 1 },
          },
          animation: { type: 'fade-in', delay: 400, duration: 1000 },
        }
      ],
    },
    {
      id: 'sec_products',
      type: 'products',
      settings: {
        backgroundColor: '#000000',
        paddingY: 'py-16',
        textColor: '#F9F9F9',
      },
      blocks: [
        {
          id: 'p_title',
          type: 'text',
          settings: {
            content: '<h3><b>Featured Publications</b></h3>',
            fontSize: 'text-2xl',
            fontWeight: 'font-semibold',
            alignment: 'text-left',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 24, y_end: 2, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 2, z_index: 1 },
          },
        },
        {
          id: 'prod_1',
          type: 'product-card',
          settings: {
            title: 'The Hound - Ian Willms',
            price: '$65.00',
            imageSrc: 'https://assets.bigcartel.com/product_images/424080591/preview_DL01130214-2.jpg?auto=format&fit=max&w=500',
            badge: 'New',
          },
          position: {
            desktop: { x_start: 2, y_start: 2, x_end: 9, y_end: 7, z_index: 1 },
            mobile: { x_start: 1, y_start: 2, x_end: 9, y_end: 7, z_index: 1 },
          },
        },
        {
          id: 'prod_2',
          type: 'product-card',
          settings: {
            title: 'Un Fantastico Altrove - Silvia Clo Di Gregorio',
            price: '$50.00',
            imageSrc: 'https://assets.bigcartel.com/product_images/406503165/_DSC3186.jpg?auto=format&fit=max&w=500',
            badge: 'On Sale',
          },
          position: {
            desktop: { x_start: 9, y_start: 2, x_end: 16, y_end: 7, z_index: 1 },
            mobile: { x_start: 1, y_start: 7, x_end: 9, y_end: 12, z_index: 1 },
          },
        },
        {
          id: 'prod_3',
          type: 'product-card',
          settings: {
            title: 'Archaeology of Presence - Ilaria De Benedetto',
            price: '$43.00',
            imageSrc: 'https://assets.bigcartel.com/product_images/424154676/aiversion.jpg?auto=format&fit=max&w=500',
          },
          position: {
            desktop: { x_start: 16, y_start: 2, x_end: 23, y_end: 7, z_index: 1 },
            mobile: { x_start: 1, y_start: 12, x_end: 9, y_end: 17, z_index: 1 },
          },
        },
      ],
    },
  ],
};

export default function StorefrontHome() {
  const compiledComponents: Record<string, string> = {};

  return (
    <div className="w-full min-h-screen bg-black relative">
      {/* Floating Call to Action to enter Editor */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/editor"
          className="px-5 py-2.5 rounded-full bg-red-650 hover:bg-red-600 text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
        >
          <span>⚡ Open Visual Editor</span>
        </Link>
      </div>

      {/* Render layout */}
      <div className="w-full bg-black">
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
