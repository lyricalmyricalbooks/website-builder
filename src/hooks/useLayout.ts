'use client';

import { useState, useCallback, useRef } from 'react';
import { PageLayout, Section, Block, GridPosition, ThemeSettings, NavigationLink } from '@/types/editor';

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
];

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

  // Section CRUD
  const addSection = useCallback((type: string = 'custom') => {
    updateLayout((next) => {
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
      next.sections.push(newSection);
    });
  }, [updateLayout]);

  const deleteSection = useCallback((sectionId: string) => {
    updateLayout((next) => {
      next.sections = next.sections.filter((s) => s.id !== sectionId);
    });
    setSelectedSectionId(null);
    setSelectedBlockId(null);
  }, [updateLayout]);

  const updateSectionSettings = useCallback((sectionId: string, settings: Record<string, any>) => {
    updateLayout((next) => {
      const section = next.sections.find((s) => s.id === sectionId);
      if (section) {
        section.settings = { ...section.settings, ...settings };
      }
    });
  }, [updateLayout]);

  const toggleSectionGlobal = useCallback((sectionId: string) => {
    updateLayout((next) => {
      const section = next.sections.find((s) => s.id === sectionId);
      if (section) {
        section.isGlobal = !section.isGlobal;
      }
    });
  }, [updateLayout]);

  // Block CRUD
  const addBlock = useCallback((sectionId: string, type: Block['type'], customName?: string) => {
    updateLayout((next) => {
      const section = next.sections.find((s) => s.id === sectionId);
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
    });
  }, [updateLayout]);

  const deleteBlock = useCallback((blockId: string) => {
    updateLayout((next) => {
      next.sections.forEach((section) => {
        section.blocks = section.blocks.filter((b) => b.id !== blockId);
      });
    });
    setSelectedBlockId(null);
  }, [updateLayout]);

  const updateBlockPosition = useCallback((blockId: string, position: Partial<GridPosition>) => {
    updateLayout((next) => {
      next.sections.forEach((section) => {
        const block = section.blocks.find((b) => b.id === blockId);
        if (block) {
          if (breakpoint === 'mobile') {
            block.position.mobile = { ...block.position.mobile, ...position };
          } else {
            block.position.desktop = { ...block.position.desktop, ...position };
          }
        }
      });
    });
  }, [updateLayout, breakpoint]);

  const updateBlockSettings = useCallback((blockId: string, settings: Record<string, any>) => {
    updateLayout((next) => {
      next.sections.forEach((section) => {
        const block = section.blocks.find((b) => b.id === blockId);
        if (block) {
          block.settings = { ...block.settings, ...settings };
        }
      });
    });
  }, [updateLayout]);

  const updateBlockAnimation = useCallback((blockId: string, animation: Block['animation']) => {
    updateLayout((next) => {
      next.sections.forEach((section) => {
        const block = section.blocks.find((b) => b.id === blockId);
        if (block) {
          block.animation = animation;
        }
      });
    });
  }, [updateLayout]);

  const duplicateBlock = useCallback((blockId: string) => {
    updateLayout((next) => {
      let blockToCopy: Block | null = null;
      let targetSection: Section | null = null;

      for (const sec of next.sections) {
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
