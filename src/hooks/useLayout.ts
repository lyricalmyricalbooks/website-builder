'use client';

import { useState, useCallback, useRef } from 'react';
import { PageLayout, Page, Section, Block, GridPosition, ThemeSettings, NavigationLink } from '@/types/editor';

const INITIAL_THEME: ThemeSettings = {
  colors: {
    primary: '#F61515', // Lyricalmyrical Red hover
    secondary: '#111111',
    background: '#000000', // Pitch Black background
    text: '#F9F9F9',       // Off-white text
    buttonBg: '#FBFBFB',   // White buttons
    buttonText: '#020202', // Black button text
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
};

const INITIAL_NAV: NavigationLink[] = [
  { 
    id: 'nav_products', 
    label: 'Products', 
    url: '#products',
    children: [
      { id: 'nav_all', label: 'All Products', url: '#products' },
      { id: 'nav_books', label: 'Books', url: '#products' },
      { id: 'nav_zines', label: 'Zines', url: '#products' },
    ]
  },
  { id: 'nav_about', label: 'About', url: '#about' },
  { id: 'nav_submissions', label: 'Submissions', url: '#submissions' },
  { id: 'nav_opencall', label: 'Open Call', url: '#opencall' },
  { id: 'nav_roots', label: 'History', url: '#roots' },
  { id: 'nav_contact', label: 'Contact', url: '#contact' },
];

// Global Shared Sections
const GLOBAL_ANNOUNCEMENT: Section = {
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
};

const GLOBAL_HEADER: Section = {
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
        content: '<a href="#home" class="font-bold text-lg uppercase tracking-widest text-white">Lyricalmyrical<b>Books</b></a>',
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
        placeholder: 'Search art books...',
      },
      position: {
        desktop: { x_start: 18, y_start: 1, x_end: 24, y_end: 2, z_index: 1 },
        mobile: { x_start: 1, y_start: 2, x_end: 9, y_end: 3, z_index: 1 },
      },
    }
  ]
};

const GLOBAL_FOOTER: Section = {
  id: 'sec_footer',
  type: 'footer',
  isGlobal: true,
  settings: {
    backgroundColor: '#0d0d0d',
    paddingY: 'py-12',
    textColor: '#a1a1aa',
  },
  blocks: [
    {
      id: 'blk_footer_text',
      type: 'text',
      settings: {
        content: '<p>© 2026 Lyricalmyrical Books. All rights reserved. Photography and independent publishing house based in Toronto.</p>',
        fontSize: 'text-xs',
        color: '#a1a1aa',
      },
      position: {
        desktop: { x_start: 2, y_start: 1, x_end: 18, y_end: 2, z_index: 1 },
        mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 3, z_index: 1 },
      }
    }
  ]
};

const INITIAL_PAGES: Record<string, Page> = {
  'home': {
    id: 'home',
    name: 'Home Page',
    slug: '/',
    type: 'custom',
    sections: [
      GLOBAL_ANNOUNCEMENT,
      GLOBAL_HEADER,
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
              desktop: { x_start: 2, y_start: 1, x_end: 15, y_end: 4, z_index: 1 },
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
      GLOBAL_FOOTER
    ]
  },
  'grain-archive': {
    id: 'grain-archive',
    name: 'Grain Archive (Template)',
    slug: '#grain-archive',
    type: 'system',
    sections: [
      {
        id: 'grain_announce',
        type: 'announcement',
        isGlobal: false,
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-2',
          textColor: '#ffffff',
        },
        blocks: [
          {
            id: 'grain_ann_text',
            type: 'text',
            settings: {
              content: '<p class="text-center text-[10px] tracking-widest uppercase">Independent writing on music, film, and visual culture—one deep cut at a time.</p>',
              fontSize: 'text-xs',
              alignment: 'text-center',
              color: '#ffffff',
            },
            position: {
              desktop: { x_start: 1, y_start: 1, x_end: 25, y_end: 2, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 2, z_index: 1 },
            }
          }
        ]
      },
      {
        id: 'sec_grain_hero',
        type: 'hero',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-0',
          textColor: '#ffffff',
        },
        blocks: [
          {
            id: 'grain_hero_img',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600',
              alt: 'Grain Archive Portrait',
              objectFit: 'cover',
              overlayColor: 'rgba(249, 115, 22, 0.55)', // Orange tint
              borderRadius: 'rounded-none',
            },
            position: {
              desktop: { x_start: 1, y_start: 1, x_end: 25, y_end: 15, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 12, z_index: 1 },
            }
          },
          {
            id: 'grain_logo_badge',
            type: 'group',
            settings: {
              backgroundColor: '#ffffff',
              borderRadius: 'rounded-full',
              padding: 'p-0',
            },
            position: {
              desktop: { x_start: 2, y_start: 2, x_end: 3, y_end: 3, z_index: 10 },
              mobile: { x_start: 2, y_start: 2, x_end: 3, y_end: 3, z_index: 10 },
            }
          },
          {
            id: 'grain_logo_text',
            type: 'text',
            settings: {
              content: '<span class="font-bold text-[10px] text-black">G•A</span>',
              alignment: 'text-center',
            },
            position: {
              desktop: { x_start: 2, y_start: 2, x_end: 3, y_end: 3, z_index: 11 },
              mobile: { x_start: 2, y_start: 2, x_end: 3, y_end: 3, z_index: 11 },
            }
          },
          {
            id: 'grain_nav_home',
            type: 'button',
            settings: {
              text: 'Home',
              variant: 'primary',
            },
            position: {
              desktop: { x_start: 18, y_start: 2, x_end: 20, y_end: 3, z_index: 10 },
              mobile: { x_start: 5, y_start: 2, x_end: 6, y_end: 3, z_index: 10 },
            }
          },
          {
            id: 'grain_nav_archive',
            type: 'button',
            settings: {
              text: 'Archive',
              variant: 'secondary',
            },
            position: {
              desktop: { x_start: 20, y_start: 2, x_end: 22, y_end: 3, z_index: 10 },
              mobile: { x_start: 6, y_start: 2, x_end: 7, y_end: 3, z_index: 10 },
            }
          },
          {
            id: 'grain_nav_about',
            type: 'button',
            settings: {
              text: 'About',
              variant: 'outline',
            },
            position: {
              desktop: { x_start: 22, y_start: 2, x_end: 24, y_end: 3, z_index: 10 },
              mobile: { x_start: 7, y_start: 2, x_end: 8, y_end: 3, z_index: 10 },
            }
          },
          {
            id: 'grain_title_giant',
            type: 'text',
            settings: {
              content: '<h1 class="text-white text-6xl md:text-8xl font-black tracking-tighter">Grain Archive</h1>',
              fontSize: 'text-5xl',
            },
            position: {
              desktop: { x_start: 2, y_start: 12, x_end: 24, y_end: 15, z_index: 10 },
              mobile: { x_start: 2, y_start: 10, x_end: 8, y_end: 12, z_index: 10 },
            }
          }
        ]
      },
      {
        id: 'sec_grain_grid',
        type: 'custom',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-6',
          textColor: '#ffffff',
        },
        blocks: [
          // Card 1 (Left)
          {
            id: 'grain_card_img_1',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
              alt: 'Listening to Films That Drift',
              objectFit: 'cover',
              borderRadius: 'rounded-xl',
              hoverEffect: 'scale',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 13, y_end: 9, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 7, z_index: 1 },
            }
          },
          {
            id: 'grain_card_glass_1',
            type: 'group',
            settings: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropBlur: 'backdrop-blur-md',
              borderRadius: 'rounded-xl',
              padding: 'p-4',
            },
            position: {
              desktop: { x_start: 2, y_start: 7, x_end: 13, y_end: 9, z_index: 2 },
              mobile: { x_start: 1, y_start: 5, x_end: 9, y_end: 7, z_index: 2 },
            }
          },
          {
            id: 'grain_card_txt_1',
            type: 'text',
            settings: {
              content: '<span class="font-bold text-sm text-white">Listening to Films That Drift</span><br/><span class="text-[10px] text-zinc-300">Film - August 21, 2026</span>',
            },
            position: {
              desktop: { x_start: 2, y_start: 7, x_end: 13, y_end: 9, z_index: 3 },
              mobile: { x_start: 1, y_start: 5, x_end: 9, y_end: 7, z_index: 3 },
            }
          },
          // Card 2 (Right)
          {
            id: 'grain_card_img_2',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
              alt: 'Drowning in Delay',
              objectFit: 'cover',
              borderRadius: 'rounded-xl',
              hoverEffect: 'scale',
            },
            position: {
              desktop: { x_start: 13, y_start: 1, x_end: 24, y_end: 9, z_index: 1 },
              mobile: { x_start: 1, y_start: 8, x_end: 9, y_end: 14, z_index: 1 },
            }
          },
          {
            id: 'grain_card_glass_2',
            type: 'group',
            settings: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropBlur: 'backdrop-blur-md',
              borderRadius: 'rounded-xl',
              padding: 'p-4',
            },
            position: {
              desktop: { x_start: 13, y_start: 7, x_end: 24, y_end: 9, z_index: 2 },
              mobile: { x_start: 1, y_start: 12, x_end: 9, y_end: 14, z_index: 2 },
            }
          },
          {
            id: 'grain_card_txt_2',
            type: 'text',
            settings: {
              content: '<span class="font-bold text-sm text-white">Drowning in Delay: The Revival of Fuzz Worship</span><br/><span class="text-[10px] text-zinc-300">Music - August 6, 2026</span>',
            },
            position: {
              desktop: { x_start: 13, y_start: 7, x_end: 24, y_end: 9, z_index: 3 },
              mobile: { x_start: 1, y_start: 12, x_end: 9, y_end: 14, z_index: 3 },
            }
          },
          // Card 3 (Left Bottom)
          {
            id: 'grain_card_img_3',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800',
              alt: 'Color, Repetition, and the Sound of Soft Things',
              objectFit: 'cover',
              borderRadius: 'rounded-xl',
              hoverEffect: 'scale',
            },
            position: {
              desktop: { x_start: 2, y_start: 10, x_end: 13, y_end: 18, z_index: 1 },
              mobile: { x_start: 1, y_start: 15, x_end: 9, y_end: 21, z_index: 1 },
            }
          },
          {
            id: 'grain_card_glass_3',
            type: 'group',
            settings: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropBlur: 'backdrop-blur-md',
              borderRadius: 'rounded-xl',
              padding: 'p-4',
            },
            position: {
              desktop: { x_start: 2, y_start: 16, x_end: 13, y_end: 18, z_index: 2 },
              mobile: { x_start: 1, y_start: 19, x_end: 9, y_end: 21, z_index: 2 },
            }
          },
          {
            id: 'grain_card_txt_3',
            type: 'text',
            settings: {
              content: '<span class="font-bold text-sm text-white">Color, Repetition, and the Sound of Soft Things</span><br/><span class="text-[10px] text-zinc-300">Film - July 11, 2026</span>',
            },
            position: {
              desktop: { x_start: 2, y_start: 16, x_end: 13, y_end: 18, z_index: 3 },
              mobile: { x_start: 1, y_start: 19, x_end: 9, y_end: 21, z_index: 3 },
            }
          },
          // Card 4 (Right Bottom)
          {
            id: 'grain_card_img_4',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
              alt: 'Mirrors, Image Loops, and Feedback Logic',
              objectFit: 'cover',
              borderRadius: 'rounded-xl',
              hoverEffect: 'scale',
            },
            position: {
              desktop: { x_start: 13, y_start: 10, x_end: 24, y_end: 18, z_index: 1 },
              mobile: { x_start: 1, y_start: 22, x_end: 9, y_end: 28, z_index: 1 },
            }
          },
          {
            id: 'grain_card_glass_4',
            type: 'group',
            settings: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropBlur: 'backdrop-blur-md',
              borderRadius: 'rounded-xl',
              padding: 'p-4',
            },
            position: {
              desktop: { x_start: 13, y_start: 16, x_end: 24, y_end: 18, z_index: 2 },
              mobile: { x_start: 1, y_start: 26, x_end: 9, y_end: 28, z_index: 2 },
            }
          },
          {
            id: 'grain_card_txt_4',
            type: 'text',
            settings: {
              content: '<span class="font-bold text-sm text-white">Mirrors, Image Loops, and Feedback Logic of Visual Culture</span><br/><span class="text-[10px] text-zinc-300">Visual - June 24, 2026</span>',
            },
            position: {
              desktop: { x_start: 13, y_start: 16, x_end: 24, y_end: 18, z_index: 3 },
              mobile: { x_start: 1, y_start: 26, x_end: 9, y_end: 28, z_index: 3 },
            }
          }
        ]
      },
      {
        id: 'sec_grain_view_all',
        type: 'banner',
        isGlobal: false,
        settings: {
          backgroundColor: '#ffffff',
          paddingY: 'py-6',
          textColor: '#000000',
        },
        blocks: [
          {
            id: 'grain_view_all_txt',
            type: 'text',
            settings: {
              content: '<p class="text-center text-4xl font-serif italic text-black">View all</p>',
              fontFamily: 'font-serif',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 24, y_end: 3, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 3, z_index: 1 },
            }
          }
        ]
      },
      {
        id: 'sec_grain_featured',
        type: 'custom',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-16',
          textColor: '#ffffff',
        },
        blocks: [
          {
            id: 'grain_feat_title',
            type: 'text',
            settings: {
              content: '<h2 class="text-white text-6xl md:text-8xl font-black tracking-tighter leading-none">Featured<br/>Album</h2>',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 12, y_end: 8, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 5, z_index: 1 },
            }
          },
          {
            id: 'grain_feat_img',
            type: 'image',
            settings: {
              src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
              alt: 'Featured Album Artwork',
              objectFit: 'cover',
              borderRadius: 'rounded-xl',
            },
            position: {
              desktop: { x_start: 13, y_start: 1, x_end: 24, y_end: 11, z_index: 1 },
              mobile: { x_start: 1, y_start: 6, x_end: 9, y_end: 13, z_index: 1 },
            }
          }
        ]
      }
    ]
  },
  'products': {
    id: 'products',
    name: 'Product Catalog',
    slug: '/products',
    type: 'system',
    sections: [
      GLOBAL_ANNOUNCEMENT,
      GLOBAL_HEADER,
      {
        id: 'sec_products_hero',
        type: 'hero',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-12',
          textColor: '#F9F9F9',
        },
        blocks: [
          {
            id: 'blk_catalog_title',
            type: 'text',
            settings: {
              content: '<h1><b>All Publications</b></h1>',
              fontSize: 'text-3xl',
              fontWeight: 'font-semibold',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 14, y_end: 2, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 2, z_index: 1 },
            }
          }
        ]
      },
      {
        id: 'sec_catalog_grid',
        type: 'products',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-8',
          textColor: '#F9F9F9',
        },
        blocks: [
          {
            id: 'cat_prod_1',
            type: 'product-card',
            settings: {
              title: 'The Hound - Ian Willms',
              price: '$65.00',
              imageSrc: 'https://assets.bigcartel.com/product_images/424080591/preview_DL01130214-2.jpg?auto=format&fit=max&w=500',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 9, y_end: 6, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 6, z_index: 1 },
            },
          },
          {
            id: 'cat_prod_2',
            type: 'product-card',
            settings: {
              title: 'Un Fantastico Altrove - Silvia Clo Di Gregorio',
              price: '$50.00',
              imageSrc: 'https://assets.bigcartel.com/product_images/406503165/_DSC3186.jpg?auto=format&fit=max&w=500',
            },
            position: {
              desktop: { x_start: 9, y_start: 1, x_end: 16, y_end: 6, z_index: 1 },
              mobile: { x_start: 1, y_start: 6, x_end: 9, y_end: 11, z_index: 1 },
            },
          },
          {
            id: 'cat_prod_3',
            type: 'product-card',
            settings: {
              title: 'Archaeology of Presence - Ilaria De Benedetto',
              price: '$43.00',
              imageSrc: 'https://assets.bigcartel.com/product_images/424154676/aiversion.jpg?auto=format&fit=max&w=500',
            },
            position: {
              desktop: { x_start: 16, y_start: 1, x_end: 23, y_end: 6, z_index: 1 },
              mobile: { x_start: 1, y_start: 11, x_end: 9, y_end: 16, z_index: 1 },
            },
          },
        ]
      },
      GLOBAL_FOOTER
    ]
  },
  'product-detail': {
    id: 'product-detail',
    name: 'Product Details (Template)',
    slug: '/products/:id',
    type: 'system',
    sections: [
      GLOBAL_ANNOUNCEMENT,
      GLOBAL_HEADER,
      {
        id: 'sec_product_detail_main',
        type: 'custom',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-16',
          textColor: '#F9F9F9',
        },
        blocks: [
          {
            id: 'det_image',
            type: 'image',
            settings: {
              src: 'https://assets.bigcartel.com/product_images/424080591/preview_DL01130214-2.jpg?auto=format&fit=max&w=1200',
              alt: 'Product Main Image',
              objectFit: 'cover',
              borderRadius: 'rounded-2xl',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 12, y_end: 11, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 7, z_index: 1 },
            }
          },
          {
            id: 'det_title',
            type: 'text',
            settings: {
              content: '<h2><b>The Hound</b></h2><p class="text-zinc-550 text-xs font-bold tracking-widest uppercase mt-1">Ian Willms</p>',
              fontSize: 'text-3xl',
              fontWeight: 'font-bold',
            },
            position: {
              desktop: { x_start: 14, y_start: 1, x_end: 24, y_end: 3, z_index: 1 },
              mobile: { x_start: 1, y_start: 7, x_end: 9, y_end: 9, z_index: 1 },
            }
          },
          {
            id: 'det_price',
            type: 'text',
            settings: {
              content: '<h3 class="text-red-500 font-bold">$65.00 CAD</h3>',
              fontSize: 'text-xl',
            },
            position: {
              desktop: { x_start: 14, y_start: 3, x_end: 24, y_end: 4, z_index: 1 },
              mobile: { x_start: 1, y_start: 9, x_end: 9, y_end: 10, z_index: 1 },
            }
          },
          {
            id: 'det_desc',
            type: 'text',
            settings: {
              content: '<p class="text-zinc-400 text-sm leading-relaxed">A stunning limited-edition photography book documenting presence and transition. Features high-resolution duotone printing on premium archival paper. Hardcover binding, 124 pages.</p>',
              fontSize: 'text-sm',
            },
            position: {
              desktop: { x_start: 14, y_start: 4, x_end: 24, y_end: 7, z_index: 1 },
              mobile: { x_start: 1, y_start: 10, x_end: 9, y_end: 13, z_index: 1 },
            }
          },
          {
            id: 'det_button',
            type: 'button',
            settings: {
              text: 'Add to Cart',
              variant: 'primary',
            },
            position: {
              desktop: { x_start: 14, y_start: 8, x_end: 20, y_end: 10, z_index: 1 },
              mobile: { x_start: 1, y_start: 13, x_end: 9, y_end: 15, z_index: 1 },
            }
          }
        ]
      },
      GLOBAL_FOOTER
    ]
  },
  'checkout': {
    id: 'checkout',
    name: 'Checkout Page (Template)',
    slug: '/checkout',
    type: 'system',
    sections: [
      GLOBAL_ANNOUNCEMENT,
      GLOBAL_HEADER,
      {
        id: 'sec_checkout_main',
        type: 'custom',
        settings: {
          backgroundColor: '#000000',
          paddingY: 'py-16',
          textColor: '#F9F9F9',
        },
        blocks: [
          {
            id: 'chk_title',
            type: 'text',
            settings: {
              content: '<h2><b>Secure Checkout</b></h2>',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
            },
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 24, y_end: 2, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 2, z_index: 1 },
            }
          },
          {
            id: 'chk_form_card',
            type: 'group',
            settings: {
              backgroundColor: '#0d0d0d',
              borderRadius: 'rounded-xl',
              padding: 'p-6',
              borderWidth: 'border',
              borderColor: '#1f1f1f',
            },
            position: {
              desktop: { x_start: 2, y_start: 3, x_end: 14, y_end: 13, z_index: 1 },
              mobile: { x_start: 1, y_start: 3, x_end: 9, y_end: 13, z_index: 1 },
            }
          },
          {
            id: 'chk_form_text',
            type: 'text',
            settings: {
              content: '<div class="space-y-4 text-xs"><h3 class="text-sm font-semibold text-white mb-2">Shipping Information</h3><div class="grid grid-cols-2 gap-3"><div><label class="text-[10px] text-zinc-500 block mb-1">First Name</label><input type="text" class="w-full bg-zinc-900 border border-zinc-805 rounded p-2 text-white" value="Julia" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">Last Name</label><input type="text" class="w-full bg-zinc-900 border border-zinc-805 rounded p-2 text-white" /></div></div><div class="mt-3"><label class="text-[10px] text-zinc-500 block mb-1">Street Address</label><input type="text" class="w-full bg-zinc-900 border border-zinc-805 rounded p-2 text-white" /></div><div class="grid grid-cols-3 gap-3 mt-3"><div><label class="text-[10px] text-zinc-500 block mb-1">City</label><input type="text" class="w-full bg-zinc-900 border border-zinc-805 rounded p-2 text-white" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">State/Prov</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">Postal Code</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div></div></div>',
            },
            position: {
              desktop: { x_start: 3, y_start: 4, x_end: 13, y_end: 12, z_index: 2 },
              mobile: { x_start: 2, y_start: 4, x_end: 8, y_end: 12, z_index: 2 },
            }
          },
          {
            id: 'chk_summary_card',
            type: 'group',
            settings: {
              backgroundColor: '#0d0d0d',
              borderRadius: 'rounded-xl',
              padding: 'p-6',
              borderWidth: 'border',
              borderColor: '#1f1f1f',
            },
            position: {
              desktop: { x_start: 15, y_start: 3, x_end: 24, y_end: 11, z_index: 1 },
              mobile: { x_start: 1, y_start: 14, x_end: 9, y_end: 20, z_index: 1 },
            }
          },
          {
            id: 'chk_summary_text',
            type: 'text',
            settings: {
              content: '<div class="text-xs space-y-3"><h3 class="text-sm font-semibold text-white mb-2">Order Summary</h3><div class="flex justify-between text-zinc-300"><span>The Hound - Ian Willms</span><span class="font-semibold">$65.00</span></div><div class="border-t border-zinc-805 my-2 pt-2 flex justify-between text-zinc-550"><span>Shipping</span><span>$12.00</span></div><div class="flex justify-between text-zinc-550"><span>Taxes</span><span>$8.45</span></div><div class="border-t border-zinc-805 my-2 pt-2 flex justify-between text-white font-bold text-sm"><span>Total</span><span class="text-red-500">$85.45 CAD</span></div></div>',
            },
            position: {
              desktop: { x_start: 16, y_start: 4, x_end: 23, y_end: 9, z_index: 2 },
              mobile: { x_start: 2, y_start: 15, x_end: 8, y_end: 19, z_index: 2 },
            }
          },
          {
            id: 'chk_btn',
            type: 'button',
            settings: {
              text: 'Complete Purchase',
              variant: 'primary',
            },
            position: {
              desktop: { x_start: 15, y_start: 11, x_end: 24, y_end: 13, z_index: 1 },
              mobile: { x_start: 1, y_start: 21, x_end: 9, y_end: 23, z_index: 1 },
            }
          }
        ]
      },
      GLOBAL_FOOTER
    ]
  }
};

const INITIAL_LAYOUT: PageLayout = {
  id: 'lyricalmyrical_theme',
  title: 'Lyricalmyrical Books',
  theme: INITIAL_THEME,
  navigation: INITIAL_NAV,
  customComponents: {
    'BookHighlightCard': `// Premium custom block for featured art books
export default function BookHighlightCard({ settings }) {
  const title = settings.title || "Featured Book";
  const artist = settings.artist || "Artist Name";
  const desc = settings.description || "Limited edition art publication.";
  
  return (
    <div className="p-6 h-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-2xl flex flex-col justify-between hover:border-red-600 transition-colors duration-300">
      <div>
        <div className="w-10 h-10 mb-4 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 font-bold">
          📚
        </div>
        <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{artist}</span>
        <h4 className="text-lg font-semibold mt-1 mb-2">{title}</h4>
        <p className="text-xs text-zinc-450 leading-relaxed">{desc}</p>
      </div>
      <div className="mt-4 text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
        Lyricalmyrical Press
      </div>
    </div>
  );
}`
  },
  pages: INITIAL_PAGES,
  activePageId: 'home',
};

// Syncs global sections (header, footer, announcement) across all pages
const syncGlobalSections = (pages: Record<string, Page>, activePageId: string) => {
  const activePage = pages[activePageId];
  if (!activePage) return;

  // Find all global sections in the active page
  const activeGlobals: Record<string, Section> = {};
  activePage.sections.forEach((sec) => {
    if (sec.isGlobal) {
      activeGlobals[sec.id] = sec;
    }
  });

  // Sync them to all other pages
  Object.entries(pages).forEach(([pageId, page]) => {
    if (pageId === activePageId) return;
    page.sections = page.sections.map((sec) => {
      if (sec.isGlobal && activeGlobals[sec.id]) {
        return JSON.parse(JSON.stringify(activeGlobals[sec.id]));
      }
      return sec;
    });
  });
};

export const useLayout = () => {
  const [layout, setLayout] = useState<PageLayout>(INITIAL_LAYOUT);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Undo/Redo history stacks
  const historyRef = useRef<PageLayout[]>([INITIAL_LAYOUT]);
  const historyIndexRef = useRef<number>(0);

  const pushToHistory = useCallback((newLayout: PageLayout) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newLayout)));
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  }, []);

  const updateLayout = useCallback((updater: (layout: PageLayout) => void) => {
    setLayout((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as PageLayout;
      updater(next);
      // Synchronize global sections across all pages
      syncGlobalSections(next.pages, next.activePageId);
      pushToHistory(next);
      return next;
    });
  }, [pushToHistory]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setLayout(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])));
      setSelectedBlockId(null);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setLayout(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])));
      setSelectedBlockId(null);
    }
  }, []);

  // Page CRUD
  const setActivePage = useCallback((pageId: string) => {
    updateLayout((next) => {
      next.activePageId = pageId;
    });
    setSelectedBlockId(null);
    setSelectedSectionId(null);
  }, [updateLayout]);

  const addPage = useCallback((name: string, slug: string) => {
    updateLayout((next) => {
      const id = slug.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const newPage: Page = {
        id,
        name,
        slug,
        type: 'custom',
        // Include the global announcement, header, and footer by default
        sections: [
          JSON.parse(JSON.stringify(GLOBAL_ANNOUNCEMENT)),
          JSON.parse(JSON.stringify(GLOBAL_HEADER)),
          {
            id: `sec_${Date.now()}_empty`,
            type: 'custom',
            settings: {
              backgroundColor: '#000000',
              paddingY: 'py-32',
              textColor: '#F9F9F9',
            },
            blocks: [
              {
                id: `blk_${Date.now()}_empty_text`,
                type: 'text',
                settings: {
                  content: `<h1 class="text-center"><b>${name}</b></h1><p class="text-center text-zinc-550 mt-2">Start designing this page by adding blocks.</p>`,
                  fontSize: 'text-3xl',
                  alignment: 'text-center',
                },
                position: {
                  desktop: { x_start: 2, y_start: 1, x_end: 24, y_end: 4, z_index: 1 },
                  mobile: { x_start: 1, y_start: 1, x_end: 9, y_end: 4, z_index: 1 },
                }
              }
            ]
          },
          JSON.parse(JSON.stringify(GLOBAL_FOOTER))
        ]
      };
      next.pages[id] = newPage;
      next.activePageId = id;
    });
  }, [updateLayout]);

  const deletePage = useCallback((pageId: string) => {
    updateLayout((next) => {
      if (next.pages[pageId] && next.pages[pageId].type === 'custom' && pageId !== 'home') {
        delete next.pages[pageId];
        next.activePageId = 'home';
      }
    });
  }, [updateLayout]);

  // Section CRUD
  const addSection = useCallback((type: string = 'custom') => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        const newSection: Section = {
          id: `sec_${Date.now()}`,
          type,
          isGlobal: type === 'header' || type === 'footer' || type === 'announcement',
          settings: {
            backgroundColor: '#000000',
            paddingY: 'py-20',
            textColor: '#F9F9F9',
          },
          blocks: [],
        };
        activePage.sections.push(newSection);
      }
    });
  }, [updateLayout]);

  const deleteSection = useCallback((sectionId: string) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        activePage.sections = activePage.sections.filter((s) => s.id !== sectionId);
      }
    });
    setSelectedSectionId(null);
    setSelectedBlockId(null);
  }, [updateLayout]);

  const updateSectionSettings = useCallback((sectionId: string, settings: Record<string, any>) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        const section = activePage.sections.find((s) => s.id === sectionId);
        if (section) {
          section.settings = { ...section.settings, ...settings };
        }
      }
    });
  }, [updateLayout]);

  const toggleSectionGlobal = useCallback((sectionId: string) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        const section = activePage.sections.find((s) => s.id === sectionId);
        if (section) {
          section.isGlobal = !section.isGlobal;
        }
      }
    });
  }, [updateLayout]);

  // Block CRUD
  const addBlock = useCallback((sectionId: string, type: Block['type'], customName?: string) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        const section = activePage.sections.find((s) => s.id === sectionId);
        if (section) {
          const newBlock: Block = {
            id: `blk_${Date.now()}`,
            type,
            componentName: customName,
            settings: type === 'text' 
              ? { content: 'Double click to edit text', fontSize: 'text-base' }
              : type === 'button'
              ? { text: 'Click Me', variant: 'primary' }
              : type === 'product-card'
              ? { title: 'New Product', price: '$99.00', imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' }
              : type === 'search'
              ? { placeholder: 'Search products...' }
              : {},
            position: {
              desktop: { x_start: 2, y_start: 1, x_end: 8, y_end: 3, z_index: 1 },
              mobile: { x_start: 1, y_start: 1, x_end: 5, y_end: 3, z_index: 1 },
            },
          };
          section.blocks.push(newBlock);
        }
      }
    });
  }, [updateLayout]);

  const deleteBlock = useCallback((blockId: string) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        activePage.sections.forEach((section) => {
          section.blocks = section.blocks.filter((b) => b.id !== blockId);
        });
      }
    });
    setSelectedBlockId(null);
  }, [updateLayout]);

  const updateBlockPosition = useCallback((blockId: string, position: Partial<GridPosition>) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        activePage.sections.forEach((section) => {
          const block = section.blocks.find((b) => b.id === blockId);
          if (block) {
            if (breakpoint === 'mobile') {
              block.position.mobile = { ...block.position.mobile, ...position };
            } else {
              block.position.desktop = { ...block.position.desktop, ...position };
            }
          }
        });
      }
    });
  }, [updateLayout, breakpoint]);

  const updateBlockSettings = useCallback((blockId: string, settings: Record<string, any>) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        activePage.sections.forEach((section) => {
          const block = section.blocks.find((b) => b.id === blockId);
          if (block) {
            block.settings = { ...block.settings, ...settings };
          }
        });
      }
    });
  }, [updateLayout]);

  const updateBlockAnimation = useCallback((blockId: string, animation: Block['animation']) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        activePage.sections.forEach((section) => {
          const block = section.blocks.find((b) => b.id === blockId);
          if (block) {
            block.animation = animation;
          }
        });
      }
    });
  }, [updateLayout]);

  const duplicateBlock = useCallback((blockId: string) => {
    updateLayout((next) => {
      const activePage = next.pages[next.activePageId];
      if (activePage) {
        let blockToCopy: Block | null = null;
        let targetSection: Section | null = null;

        for (const sec of activePage.sections) {
          const b = sec.blocks.find((blk) => blk.id === blockId);
          if (b) {
            blockToCopy = b;
            targetSection = sec;
            break;
          }
        }

        if (blockToCopy && targetSection) {
          const copy: Block = JSON.parse(JSON.stringify(blockToCopy));
          copy.id = `blk_${Date.now()}`;
          copy.position.desktop.y_start += 1;
          copy.position.desktop.y_end += 1;
          copy.position.mobile.y_start += 1;
          copy.position.mobile.y_end += 1;
          targetSection.blocks.push(copy);
        }
      }
    });
  }, [updateLayout]);

  // Theme & Checkout Updates
  const updateTheme = useCallback((themeUpdates: Partial<ThemeSettings>) => {
    updateLayout((next) => {
      next.theme = { ...next.theme, ...themeUpdates };
    });
  }, [updateLayout]);

  const updateCheckoutTheme = useCallback((checkoutUpdates: Partial<ThemeSettings['checkout']>) => {
    updateLayout((next) => {
      next.theme.checkout = { ...next.theme.checkout, ...checkoutUpdates };
    });
  }, [updateLayout]);

  // Monaco Custom Component Updates
  const updateCustomComponentCode = useCallback((name: string, code: string) => {
    updateLayout((next) => {
      next.customComponents[name] = code;
    });
  }, [updateLayout]);

  // Navigation Links Modifiers
  const addNavigationLink = useCallback((label: string, url: string, parentId?: string) => {
    updateLayout((next) => {
      const newLink: NavigationLink = {
        id: `nav_${Date.now()}`,
        label,
        url,
      };

      if (!parentId) {
        next.navigation.push(newLink);
      } else {
        const findAndAdd = (links: NavigationLink[]): boolean => {
          for (const link of links) {
            if (link.id === parentId) {
              if (!link.children) link.children = [];
              link.children.push(newLink);
              return true;
            }
            if (link.children && findAndAdd(link.children)) return true;
          }
          return false;
        };
        findAndAdd(next.navigation);
      }
    });
  }, [updateLayout]);

  const deleteNavigationLink = useCallback((linkId: string) => {
    updateLayout((next) => {
      const filterLinks = (links: NavigationLink[]): NavigationLink[] => {
        return links
          .filter((l) => l.id !== linkId)
          .map((l) => ({
            ...l,
            children: l.children ? filterLinks(l.children) : undefined,
          }));
      };
      next.navigation = filterLinks(next.navigation);
    });
  }, [updateLayout]);

  const updateNavigationLink = useCallback((linkId: string, label: string, url: string) => {
    updateLayout((next) => {
      const findAndUpdate = (links: NavigationLink[]): boolean => {
        for (const link of links) {
          if (link.id === linkId) {
            link.label = label;
            link.url = url;
            return true;
          }
          if (link.children && findAndUpdate(link.children)) return true;
        }
        return false;
      };
      findAndUpdate(next.navigation);
    });
  }, [updateLayout]);

  return {
    layout,
    selectedBlockId,
    setSelectedBlockId,
    selectedSectionId,
    setSelectedSectionId,
    breakpoint,
    setBreakpoint,
    zoom,
    setZoom,
    pan,
    setPan,
    undo,
    redo,
    updateLayout,
    setActivePage,
    addPage,
    deletePage,
    addSection,
    deleteSection,
    updateSectionSettings,
    toggleSectionGlobal,
    addBlock,
    deleteBlock,
    updateBlockPosition,
    updateBlockSettings,
    updateBlockAnimation,
    duplicateBlock,
    updateTheme,
    updateCheckoutTheme,
    updateCustomComponentCode,
    addNavigationLink,
    deleteNavigationLink,
    updateNavigationLink,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
  };
};

export default useLayout;
