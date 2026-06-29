'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GridRenderer } from '@/components/GridRenderer';
import { PageLayout, Page, Section } from '@/types/editor';

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

const DEMO_PAGES: Record<string, Page> = {
  'home': {
    id: 'home',
    name: 'Home Page',
    slug: '#home',
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
  'products': {
    id: 'products',
    name: 'Product Catalog',
    slug: '#products',
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
    slug: '#product-detail',
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
              content: '<h2><b>The Hound</b></h2><p class="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-1">Ian Willms</p>',
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
    slug: '#checkout',
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
              content: '<div class="space-y-4 text-xs"><h3 class="text-sm font-semibold text-white mb-2">Shipping Information</h3><div class="grid grid-cols-2 gap-3"><div><label class="text-[10px] text-zinc-500 block mb-1">First Name</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" value="Julia" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">Last Name</label><input type="text" class="w-full bg-zinc-900 border border-zinc-855 rounded p-2 text-white" /></div></div><div class="mt-3"><label class="text-[10px] text-zinc-500 block mb-1">Street Address</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div><div class="grid grid-cols-3 gap-3 mt-3"><div><label class="text-[10px] text-zinc-500 block mb-1">City</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">State/Prov</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div><div><label class="text-[10px] text-zinc-500 block mb-1">Postal Code</label><input type="text" class="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white" /></div></div></div>',
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
              content: '<div class="text-xs space-y-3"><h3 class="text-sm font-semibold text-white mb-2">Order Summary</h3><div class="flex justify-between text-zinc-300"><span>The Hound - Ian Willms</span><span class="font-semibold">$65.00</span></div><div class="border-t border-zinc-805 my-2 pt-2 flex justify-between text-zinc-500"><span>Shipping</span><span>$12.00</span></div><div class="flex justify-between text-zinc-500"><span>Taxes</span><span>$8.45</span></div><div class="border-t border-zinc-805 my-2 pt-2 flex justify-between text-white font-bold text-sm"><span>Total</span><span class="text-red-500">$85.45 CAD</span></div></div>',
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
  ],
  customComponents: {},
  pages: DEMO_PAGES,
  activePageId: 'home',
};

export default function StorefrontHome() {
  const [activePageId, setActivePageId] = useState<string>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && DEMO_LAYOUT.pages[hash]) {
        setActivePageId(hash);
      } else {
        setActivePageId('home');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activePage = DEMO_LAYOUT.pages[activePageId] || DEMO_LAYOUT.pages['home'];

  return (
    <div className="w-full min-h-screen bg-black relative">
      {/* Floating Call to Action to enter Editor */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/editor"
          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
        >
          <span>⚡ Open Visual Editor</span>
        </Link>
      </div>

      {/* Render active page layout */}
      <div className="w-full bg-black">
        {activePage.sections.map((section) => (
          <GridRenderer
            key={section.id}
            section={section}
            theme={DEMO_LAYOUT.theme}
            customComponents={DEMO_LAYOUT.customComponents}
            breakpoint="desktop"
            isPreview={true}
          />
        ))}
      </div>
    </div>
  );
}
