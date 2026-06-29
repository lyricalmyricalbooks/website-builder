export interface GridPosition {
  x_start: number; // 1-indexed (1 to 25 for desktop, 1 to 9 for mobile)
  y_start: number; // 1-indexed row number
  x_end: number;   // 1-indexed (exclusive end column)
  y_end: number;   // 1-indexed row number
  z_index: number;
}

export interface BlockAnimation {
  type: 'none' | 'fade-in' | 'slide-up' | 'zoom' | 'scroll-parallax';
  delay?: number;     // in milliseconds
  duration?: number;  // in milliseconds
  speed?: number;     // for parallax (0.1 to 1)
}

export type BlockType = 'text' | 'image' | 'button' | 'product-card' | 'custom' | 'group' | 'search';

export interface Block {
  id: string;
  type: BlockType;
  parentId?: string; // If nested inside a group or auto-layout container
  componentName?: string; // For custom blocks compiled in Monaco
  settings: Record<string, any>;
  position: {
    desktop: GridPosition;
    mobile: GridPosition;
  };
  animation?: BlockAnimation;
}

export interface Section {
  id: string;
  type: string; // 'hero' | 'features' | 'banner' | 'products' | 'custom'
  isGlobal?: boolean; // Shared across pages
  settings: {
    backgroundColor?: string;
    paddingY?: string; // 'py-12' | 'py-20' | 'py-32'
    textColor?: string;
    [key: string]: any;
  };
  blocks: Block[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonBg: string;
  buttonText: string;
}

export interface ThemeTypography {
  headingFont: string; // e.g., 'Inter', 'Playfair Display'
  bodyFont: string;    // e.g., 'Roboto', 'Open Sans'
}

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  children?: NavigationLink[];
}

export interface CheckoutTheme {
  logoUrl?: string;
  accentColor: string;
  backgroundColor: string;
  inputBorderRadius: string; // 'rounded-none' | 'rounded-md' | 'rounded-xl'
  fontFamily: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacingScale: number[]; // Spacing steps in pixels, e.g., [4, 8, 12, 16, 24, 32, 48, 64]
  checkout: CheckoutTheme;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  type: 'custom' | 'system';
  sections: Section[];
}

export interface PageLayout {
  id: string;
  title: string;
  theme: ThemeSettings;
  navigation: NavigationLink[]; // Global menu structure
  customComponents: Record<string, string>; // Maps componentName -> raw TSX code
  pages: Record<string, Page>; // Dictionary of pages by pageId
  activePageId: string; // The page currently being edited
  sections?: Section[]; // For backward compatibility
}

export interface EditorState {
  layout: PageLayout;
  selectedBlockId: string | null;
  selectedSectionId: string | null;
  activeBreakpoint: 'desktop' | 'mobile';
  history: PageLayout[];
  historyIndex: number;
  pan: { x: number; y: number };
  zoom: number;
  guides: {
    horizontal: number[]; // Grid Y lines
    vertical: number[];   // Grid X lines
  };
}
