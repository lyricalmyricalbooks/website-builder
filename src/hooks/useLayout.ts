'use client';

import { useState, useCallback, useRef } from 'react';
import { PageLayout, Section, Block, GridPosition, ThemeSettings, NavigationLink } from '@/types/editor';

const INITIAL_THEME: ThemeSettings = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1f2937',
    background: '#ffffff',
    text: '#111827',
    buttonBg: '#3b82f6',
    buttonText: '#ffffff',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  spacingScale: [4, 8, 12, 16, 24, 32, 48, 64],
  checkout: {
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    inputBorderRadius: 'rounded-md',
    fontFamily: 'Inter',
  },
};

const INITIAL_NAV: NavigationLink[] = [
  { id: 'nav_home', label: 'Home', url: '/' },
  { 
    id: 'nav_shop', 
    label: 'Shop', 
    url: '/collections/all',
    children: [
      { id: 'nav_new', label: 'New Arrivals', url: '/collections/new' },
      { id: 'nav_sale', label: 'On Sale', url: '/collections/sale' },
    ]
  },
  { id: 'nav_about', label: 'About', url: '/about' },
];

const INITIAL_LAYOUT: PageLayout = {
  id: 'home_page',
  title: 'Home Page',
  theme: INITIAL_THEME,
  navigation: INITIAL_NAV,
  customComponents: {
    'CustomFeatureCard': `// State-of-the-art custom card component
export default function CustomFeatureCard({ settings, theme }) {
  const title = settings.title || "Interactive Card";
  const desc = settings.description || "Hover over me to see magnetic physics and transitions.";
  
  return (
    <div className="p-6 h-full bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl flex flex-col justify-between hover:border-blue-500 transition-colors duration-300">
      <div>
        <div className="w-10 h-10 mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
          ⚡
        </div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
      <div className="mt-4 text-xs text-blue-500 font-medium tracking-wide uppercase">
        Active Developer Component
      </div>
    </div>
  );
}`
  },
  sections: [
    {
      id: 'sec_header',
      type: 'header',
      isGlobal: true,
      settings: {
        backgroundColor: '#ffffff',
        paddingY: 'py-4',
        textColor: '#111827',
      },
      blocks: [
        {
          id: 'blk_logo',
          type: 'text',
          settings: {
            content: '<span class="font-bold text-xl tracking-tight">BRAND<b>STORE</b></span>',
            fontSize: 'text-lg',
            color: '#111827',
          },
          position: {
            desktop: { x_start: 2, y_start: 1, x_end: 6, y_end: 2, z_index: 1 },
            mobile: { x_start: 1, y_start: 1, x_end: 4, y_end: 2, z_index: 1 },
          },
        },
        {
          id: 'blk_search',
          type: 'search',
          settings: {
            placeholder: 'Search products...',
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
        backgroundColor: '#ffffff',
        paddingY: 'py-24',
        textColor: '#111827',
      },
      blocks: [
        {
          id: 'blk_hero_title',
          type: 'text',
          settings: {
            content: '<h1><b>Design the Future of E-Commerce</b></h1>',
            fontSize: 'text-5xl md:text-6xl',
            fontWeight: 'font-bold',
            color: '#111827',
            alignment: 'text-center',
          },
          position: {
            desktop: { x_start: 3, y_start: 1, x_end: 23, y_end: 4, z_index: 1 },
            mobile: { x_start: 1, y_start: 3, x_end: 9, y_end: 6, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 100, duration: 800 },
        },
        {
          id: 'blk_hero_subtitle',
          type: 'text',
          settings: {
            content: '<p>Build high-performance, custom storefronts using our 24-column CSS Grid layout engine. Experience absolute design freedom with zero-bloat rendering.</p>',
            fontSize: 'text-lg',
            color: '#4b5563',
            alignment: 'text-center',
          },
          position: {
            desktop: { x_start: 5, y_start: 4, x_end: 21, y_end: 6, z_index: 1 },
            mobile: { x_start: 1, y_start: 6, x_end: 9, y_end: 9, z_index: 1 },
          },
          animation: { type: 'slide-up', delay: 300, duration: 800 },
        },
        {
          id: 'blk_hero_button',
          type: 'button',
          settings: {
            text: 'Explore Editor',
            variant: 'primary',
            magnetic: true,
          },
          position: {
            desktop: { x_start: 10, y_start: 6, x_end: 16, y_end: 8, z_index: 1 },
            mobile: { x_start: 2, y_start: 9, x_end: 8, y_end: 11, z_index: 1 },
          },
          animation: { type: 'zoom', delay: 500, duration: 600 },
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
        isGlobal: type === 'header' || type === 'footer',
        settings: {
          backgroundColor: '#ffffff',
          paddingY: 'py-20',
          textColor: '#111827',
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
