'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Plus, Layers, Palette, Code2, Trash2, Copy, LayoutGrid, 
  Type, Image, PlaySquare, ShoppingBag, Sparkles, Layers3,
  Compass, Link as LinkIcon, Globe
} from 'lucide-react';
import { PageLayout, Section, Block, ThemeSettings, NavigationLink } from '@/types/editor';
import { transpileTypeScript } from '@/lib/compiler';

interface SidebarProps {
  layout: PageLayout;
  breakpoint: 'desktop' | 'mobile';
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  addSection: (type: string) => void;
  deleteSection: (id: string) => void;
  updateSectionSettings: (sectionId: string, settings: Record<string, any>) => void;
  toggleSectionGlobal: (sectionId: string) => void;
  addBlock: (sectionId: string, type: Block['type'], customName?: string) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlockPosition: (blockId: string, position: Partial<Block['position']['desktop']>) => void;
  updateBlockSettings: (blockId: string, settings: Record<string, any>) => void;
  updateBlockAnimation: (blockId: string, animation: Block['animation']) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateCheckoutTheme: (checkout: Partial<ThemeSettings['checkout']>) => void;
  updateCustomComponentCode: (name: string, code: string) => void;
  addNavigationLink: (label: string, url: string, parentId?: string) => void;
  deleteNavigationLink: (id: string) => void;
  updateNavigationLink: (id: string, label: string, url: string) => void;
}

const THEME_PRESETS = {
  editorial: {
    name: 'Editorial Minimalist (Lyricalmyrical)',
    colors: {
      primary: '#F61515',
      secondary: '#111111',
      background: '#000000',
      text: '#F9F9F9',
      buttonBg: '#FBFBFB',
      buttonText: '#020202',
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'DM Sans',
    }
  },
  sleek_dark: {
    name: 'Sleek Dark & Glassmorphism',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e1e2f',
      background: '#0b0f19',
      text: '#e2e8f0',
      buttonBg: '#3b82f6',
      buttonText: '#ffffff',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    }
  },
  organic_warm: {
    name: 'Organic Warm & Craft',
    colors: {
      primary: '#c2410c',
      secondary: '#1e3a1e',
      background: '#fbfaf7',
      text: '#1c1917',
      buttonBg: '#1c1917',
      buttonText: '#fbfaf7',
    },
    typography: {
      headingFont: 'Lora',
      bodyFont: 'DM Sans',
    }
  }
};

const CURATED_PALETTES = [
  {
    name: 'Editorial Minimalist',
    colors: {
      background: '#000000',
      text: '#F9F9F9',
      primary: '#F61515',
      secondary: '#111111',
      buttonBg: '#FBFBFB',
      buttonText: '#020202',
    }
  },
  {
    name: 'Light Editorial',
    colors: {
      background: '#FFFFFF',
      text: '#111111',
      primary: '#111111',
      secondary: '#F4F4F5',
      buttonBg: '#111111',
      buttonText: '#FFFFFF',
    }
  },
  {
    name: 'Nordic Frost',
    colors: {
      background: '#F0F4F8',
      text: '#102A43',
      primary: '#486581',
      secondary: '#D9E2EC',
      buttonBg: '#102A43',
      buttonText: '#F0F4F8',
    }
  },
  {
    name: 'Sunset Clay',
    colors: {
      background: '#FFF8F6',
      text: '#4A2820',
      primary: '#DD6B4F',
      secondary: '#F9D9D2',
      buttonBg: '#4A2820',
      buttonText: '#FFF8F6',
    }
  },
  {
    name: 'Earthy Sage',
    colors: {
      background: '#F4F7F4',
      text: '#1A2E1A',
      primary: '#7A9A7A',
      secondary: '#E2EAE2',
      buttonBg: '#1A2E1A',
      buttonText: '#F4F7F4',
    }
  },
  {
    name: 'Cyberpunk Neon',
    colors: {
      background: '#0B0F19',
      text: '#E2E8F0',
      primary: '#EC4899',
      secondary: '#06B6D4',
      buttonBg: '#EC4899',
      buttonText: '#0B0F19',
    }
  },
  {
    name: 'Luxury Gold',
    colors: {
      background: '#0C0C0C',
      text: '#E5E5E5',
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      buttonBg: '#D4AF37',
      buttonText: '#0C0C0C',
    }
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  layout,
  breakpoint,
  selectedBlockId,
  setSelectedBlockId,
  selectedSectionId,
  setSelectedSectionId,
  addSection,
  deleteSection,
  updateSectionSettings,
  toggleSectionGlobal,
  addBlock,
  deleteBlock,
  duplicateBlock,
  updateBlockPosition,
  updateBlockSettings,
  updateBlockAnimation,
  updateTheme,
  updateCheckoutTheme,
  updateCustomComponentCode,
  addNavigationLink,
  deleteNavigationLink,
  updateNavigationLink,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'layers' | 'theme' | 'code' | 'nav'>('add');
  const [selectedCustomComponent, setSelectedCustomComponent] = useState<string>('BookHighlightCard');
  const [codeError, setCodeError] = useState<string | null>(null);

  // Nav link inputs
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [selectedParentLinkId, setSelectedParentLinkId] = useState<string>('');

  // Find selected block & section details
  let selectedBlock: Block | null = null;
  let selectedBlockSection: Section | null = null;
  for (const s of layout.sections) {
    const b = s.blocks.find((blk) => blk.id === selectedBlockId);
    if (b) {
      selectedBlock = b;
      selectedBlockSection = s;
      break;
    }
  }
  const selectedSection = layout.sections.find((s) => s.id === selectedSectionId);

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return;
    updateCustomComponentCode(selectedCustomComponent, value);
    try {
      transpileTypeScript(value);
      setCodeError(null);
    } catch (err: any) {
      setCodeError(err.message || 'Syntax error in custom component');
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    addNavigationLink(newLinkLabel, newLinkUrl, selectedParentLinkId || undefined);
    setNewLinkLabel('');
    setNewLinkUrl('');
    setSelectedParentLinkId('');
  };

  const applyThemePreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[presetKey];
    updateTheme({
      colors: preset.colors,
      typography: preset.typography,
    });
  };

  // Render navigation links recursively in a tree view
  const renderNavLinksTree = (links: NavigationLink[], depth = 0) => {
    return links.map((link) => (
      <div key={link.id} className="space-y-1" style={{ marginLeft: `${depth * 12}px` }}>
        <div className="flex items-center justify-between p-2 bg-slate-800/40 border border-slate-800/80 rounded-lg text-xs">
          <div className="flex items-center space-x-1.5 truncate">
            <LinkIcon size={11} className="text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-200 truncate">{link.label}</span>
            <span className="text-[9px] text-slate-500 truncate">({link.url})</span>
          </div>
          <button
            onClick={() => deleteNavigationLink(link.id)}
            className="text-slate-500 hover:text-red-400"
          >
            <Trash2 size={11} />
          </button>
        </div>
        {link.children && link.children.length > 0 && renderNavLinksTree(link.children, depth + 1)}
      </div>
    ));
  };

  // Parsing helper for group backgrounds
  const parseGroupBackground = () => {
    if (!selectedBlock || selectedBlock.type !== 'group') return { isGradient: false, color1: '#3b82f6', color2: '#1d4ed8', angle: 135, solidColor: '#ffffff' };
    const bg = selectedBlock.settings.backgroundColor || 'transparent';
    const isGradient = bg.startsWith('linear-gradient');
    
    let color1 = '#3b82f6';
    let color2 = '#1d4ed8';
    let angle = 135;
    let solidColor = '#ffffff';

    if (isGradient) {
      const match = bg.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/);
      if (match) {
        angle = parseInt(match[1]) || 135;
        color1 = match[2].trim();
        color2 = match[3].trim();
      }
    } else if (bg !== 'transparent') {
      solidColor = bg;
    }

    return { isGradient, color1, color2, angle, solidColor };
  };

  const { isGradient, color1, color2, angle, solidColor } = parseGroupBackground();

  const handleBgTypeChange = (type: 'solid' | 'gradient') => {
    if (type === 'solid') {
      updateBlockSettings(selectedBlock!.id, { backgroundColor: solidColor });
    } else {
      updateBlockSettings(selectedBlock!.id, { backgroundColor: `linear-gradient(${angle}deg, ${color1}, ${color2})` });
    }
  };

  const handleSolidColorChange = (val: string) => {
    updateBlockSettings(selectedBlock!.id, { backgroundColor: val });
  };

  const handleGradientChange = (c1: string, c2: string, ang: number) => {
    updateBlockSettings(selectedBlock!.id, { backgroundColor: `linear-gradient(${ang}deg, ${c1}, ${c2})` });
  };

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-full text-slate-200 select-none">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 p-1">
        {(['add', 'layers', 'theme', 'nav', 'code'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === tab ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'add' && <Plus size={15} />}
            {tab === 'layers' && <Layers size={15} />}
            {tab === 'theme' && <Palette size={15} />}
            {tab === 'nav' && <Compass size={15} />}
            {tab === 'code' && <Code2 size={15} />}
            <span className="text-[9px] mt-0.5">{tab}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'add' && (
          <div className="space-y-6">
            {/* Section Presets */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                <LayoutGrid size={13} className="mr-1.5 text-blue-500" />
                Add Sections
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['header', 'hero', 'features', 'products', 'banner', 'footer', 'custom'].map((type) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 rounded-xl text-left hover:border-blue-500/50 transition-all group"
                  >
                    <span className="text-xs font-semibold capitalize block group-hover:text-blue-400">{type}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Insert section</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Block Elements */}
            {selectedSectionId && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                  <Layers3 size={13} className="mr-1.5 text-blue-500" />
                  Add Blocks to Section
                </h3>
                <div className="space-y-2">
                  {[
                    { type: 'text', label: 'Text Block', icon: <Type size={14} /> },
                    { type: 'image', label: 'Image Block', icon: <Image size={14} /> },
                    { type: 'button', label: 'Button Block', icon: <PlaySquare size={14} /> },
                    { type: 'product-card', label: 'Product Card', icon: <ShoppingBag size={14} /> },
                    { type: 'search', label: 'Predictive Search', icon: <PlaySquare size={14} /> },
                    { type: 'group', label: 'Container Card', icon: <Layers size={14} /> },
                    { type: 'custom', label: 'Custom Widget', icon: <Sparkles size={14} />, customName: 'BookHighlightCard' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addBlock(selectedSectionId, item.type as any, item.customName)}
                      className="w-full p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 rounded-xl flex items-center justify-between hover:border-blue-500/50 transition-all text-left"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400">
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                      <Plus size={12} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Layers size={13} className="mr-1.5 text-blue-500" />
              Page Hierarchy
            </h3>
            {layout.sections.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No layers yet. Add a section.</p>
            ) : (
              <div className="space-y-3">
                {layout.sections.map((section) => (
                  <div key={section.id} className="border-l border-slate-800 pl-2 space-y-1.5">
                    <div
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setSelectedBlockId(null);
                      }}
                      className={`p-2 rounded-lg flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                        selectedSectionId === section.id && !selectedBlockId
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                          : 'hover:bg-slate-850 text-slate-300'
                      }`}
                    >
                      <span className="capitalize flex items-center space-x-1.5">
                        <span>Section: {section.type}</span>
                        {section.isGlobal && (
                          <span className="bg-blue-600 text-white text-[8px] px-1 rounded uppercase font-bold">Global</span>
                        )}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="pl-3 space-y-1">
                      {section.blocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlockId(block.id);
                            setSelectedSectionId(section.id);
                          }}
                          className={`p-1.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-all ${
                            selectedBlockId === block.id
                              ? 'bg-blue-600/15 text-blue-400 font-medium'
                              : 'hover:bg-slate-850 text-slate-400'
                          }`}
                        >
                          <span className="capitalize truncate max-w-[150px]">{block.type} Block</span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateBlock(block.id);
                              }}
                              className="text-slate-500 hover:text-slate-300"
                              title="Duplicate"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="text-slate-500 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Global Theme Presets */}
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                <Sparkles size={13} className="mr-1.5 text-blue-500" />
                Global Theme Presets
              </h3>
              <p className="text-[10px] text-slate-400 mb-3">Apply a curated design system preset instantly.</p>
              <select
                onChange={(e) => applyThemePreset(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-750 text-xs px-2 py-1.5 rounded-lg focus:outline-none text-slate-200 font-medium"
                defaultValue=""
              >
                <option value="" disabled>-- Select Theme Preset --</option>
                {Object.entries(THEME_PRESETS).map(([key, p]) => (
                  <option key={key} value={key}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Curated Color Palettes Swatch Library */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                <Palette size={13} className="mr-1.5 text-blue-500" />
                Curated Color Palettes
              </h3>
              <p className="text-[10px] text-slate-400 mb-3">Quick-apply professionally curated swatches:</p>
              <div className="space-y-2">
                {CURATED_PALETTES.map((palette, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateTheme({ colors: palette.colors })}
                    className="w-full p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all hover:border-slate-700"
                  >
                    <span className="text-[10px] font-medium text-slate-300">{palette.name}</span>
                    <div className="flex space-x-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: palette.colors.background }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: palette.colors.text }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: palette.colors.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: palette.colors.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
                <Palette size={13} className="mr-1.5 text-blue-500" />
                Global Color Palette
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'primary', label: 'Primary Accent' },
                  { key: 'secondary', label: 'Secondary Accent' },
                  { key: 'background', label: 'Page Background' },
                  { key: 'text', label: 'Body Text Color' },
                  { key: 'buttonBg', label: 'Button Background' },
                  { key: 'buttonText', label: 'Button Text' },
                ].map((color) => (
                  <div key={color.key} className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">{color.label}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={(layout.theme.colors as any)[color.key]}
                        onChange={(e) => updateTheme({ colors: { ...layout.theme.colors, [color.key]: e.target.value } })}
                        className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {(layout.theme.colors as any)[color.key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="border-t border-slate-800 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Global Typography</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Heading Font</label>
                  <select
                    value={layout.theme.typography.headingFont}
                    onChange={(e) => updateTheme({ typography: { ...layout.theme.typography, headingFont: e.target.value } })}
                    className="w-full bg-slate-850 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                  >
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="Lora">Lora (Elegant Serif)</option>
                    <option value="Inter">Inter (Sleek Sans)</option>
                    <option value="DM Sans">DM Sans (Minimalist Sans)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Body Font</label>
                  <select
                    value={layout.theme.typography.bodyFont}
                    onChange={(e) => updateTheme({ typography: { ...layout.theme.typography, bodyFont: e.target.value } })}
                    className="w-full bg-slate-850 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                  >
                    <option value="DM Sans">DM Sans (Minimalist Sans)</option>
                    <option value="Inter">Inter (Sleek Sans)</option>
                    <option value="Lora">Lora (Elegant Serif)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkout Customizer */}
            <div className="border-t border-slate-800 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
                <Globe size={13} className="mr-1.5 text-blue-500" />
                Checkout Customizer
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Checkout Accent Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={layout.theme.checkout?.accentColor || '#3b82f6'}
                      onChange={(e) => updateCheckoutTheme({ accentColor: e.target.value })}
                      className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {layout.theme.checkout?.accentColor || '#3b82f6'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Checkout Background</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={layout.theme.checkout?.backgroundColor || '#ffffff'}
                      onChange={(e) => updateCheckoutTheme({ backgroundColor: e.target.value })}
                      className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {layout.theme.checkout?.backgroundColor || '#ffffff'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-300 block mb-1">Input Border Radius</span>
                  <select
                    value={layout.theme.checkout?.inputBorderRadius || 'rounded-md'}
                    onChange={(e) => updateCheckoutTheme({ inputBorderRadius: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                  >
                    <option value="rounded-none">Square (none)</option>
                    <option value="rounded-md">Medium (md)</option>
                    <option value="rounded-xl">Round (xl)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nav' && (
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Compass size={13} className="mr-1.5 text-blue-500" />
              Navigation Menu Builder
            </h3>

            {/* Links List Tree */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {layout.navigation.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center">No menu items yet.</p>
              ) : (
                <div className="space-y-2">
                  {renderNavLinksTree(layout.navigation)}
                </div>
              )}
            </div>

            {/* Add Link Form */}
            <form onSubmit={handleAddLink} className="space-y-3 bg-slate-850 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Add Menu Item</span>
              <div>
                <label className="text-[9px] text-slate-500 block">Link Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., About Us"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1.5 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block">Link URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., /about"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1.5 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block">Parent Item (Optional)</label>
                <select
                  value={selectedParentLinkId}
                  onChange={(e) => setSelectedParentLinkId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1.5 rounded-lg focus:outline-none text-slate-200"
                >
                  <option value="">None (Top Level)</option>
                  {layout.navigation.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Add Menu Item
              </button>
            </form>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex flex-col h-full space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Code2 size={13} className="mr-1.5 text-blue-500" />
                Custom Block Compiler
              </h3>
              <select
                value={selectedCustomComponent}
                onChange={(e) => setSelectedCustomComponent(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 focus:outline-none text-slate-200"
              >
                <option value="BookHighlightCard">Feature Card</option>
              </select>
            </div>

            <div className="flex-grow border border-slate-800 rounded-xl overflow-hidden bg-slate-950 min-h-[250px]">
              <Editor
                height="100%"
                language="typescript"
                theme="vs-dark"
                value={layout.customComponents[selectedCustomComponent] || ''}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 11,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            {codeError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-lg overflow-x-auto whitespace-pre-wrap">
                {codeError}
              </div>
            )}
            {!codeError && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg text-center font-medium">
                ✓ Compiled Successfully
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right-side Inspector Panel */}
      {(selectedBlock || selectedSection) && (
        <div className="border-t border-slate-800 bg-slate-950 p-4 max-h-[350px] overflow-y-auto">
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Block Inspector
                </h4>
                <button
                  onClick={() => deleteBlock(selectedBlock!.id)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Aspect Ratio Lock setting */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Aspect Ratio Lock</label>
                <select
                  value={selectedBlock.settings.aspectRatio || 'none'}
                  onChange={(e) => updateBlockSettings(selectedBlock!.id, { aspectRatio: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                >
                  <option value="none">Freeform (None)</option>
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Widescreen (16:9)</option>
                  <option value="4:3">Standard (4:3)</option>
                </select>
              </div>

              {/* Coordinates Editor */}
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Grid Coordinates</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 block">Col Start</label>
                    <input
                      type="number"
                      value={breakpoint === 'mobile' ? selectedBlock.position.mobile.x_start : selectedBlock.position.desktop.x_start}
                      onChange={(e) => updateBlockPosition(selectedBlock!.id, { x_start: parseInt(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Col End</label>
                    <input
                      type="number"
                      value={breakpoint === 'mobile' ? selectedBlock.position.mobile.x_end : selectedBlock.position.desktop.x_end}
                      onChange={(e) => updateBlockPosition(selectedBlock!.id, { x_end: parseInt(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Row Start</label>
                    <input
                      type="number"
                      value={breakpoint === 'mobile' ? selectedBlock.position.mobile.y_start : selectedBlock.position.desktop.y_start}
                      onChange={(e) => updateBlockPosition(selectedBlock!.id, { y_start: parseInt(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Row End</label>
                    <input
                      type="number"
                      value={breakpoint === 'mobile' ? selectedBlock.position.mobile.y_end : selectedBlock.position.desktop.y_end}
                      onChange={(e) => updateBlockPosition(selectedBlock!.id, { y_end: parseInt(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fine-Grained Offsets */}
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Fine-Grained Offsets</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 block">Offset X (px)</label>
                    <input
                      type="number"
                      value={selectedBlock.settings.offsetX || 0}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { offsetX: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Offset Y (px)</label>
                    <input
                      type="number"
                      value={selectedBlock.settings.offsetY || 0}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { offsetY: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hover Interactions */}
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Hover Micro-Interactions</h5>
                <div className="space-y-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Gently Float Up</span>
                    <input
                      type="checkbox"
                      checked={selectedBlock.settings.hoverEffectSettings?.float || false}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, {
                        hoverEffectSettings: {
                          ...selectedBlock!.settings.hoverEffectSettings,
                          float: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Grow / Scale Up</span>
                    <input
                      type="checkbox"
                      checked={selectedBlock.settings.hoverEffectSettings?.scale || false}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, {
                        hoverEffectSettings: {
                          ...selectedBlock!.settings.hoverEffectSettings,
                          scale: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Brand Glow Effect</span>
                    <input
                      type="checkbox"
                      checked={selectedBlock.settings.hoverEffectSettings?.glow || false}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, {
                        hoverEffectSettings: {
                          ...selectedBlock!.settings.hoverEffectSettings,
                          glow: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Block Specific Settings */}
              {selectedBlock.type === 'text' && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Text Settings</h5>
                  <p className="text-[10px] text-slate-455 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                    💡 Double-click the text on the canvas to edit inline.
                  </p>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Text Size</label>
                    <select
                      value={selectedBlock.settings.fontSize || 'text-base'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { fontSize: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="text-xs">Extra Small</option>
                      <option value="text-sm">Small</option>
                      <option value="text-base">Base</option>
                      <option value="text-lg">Large</option>
                      <option value="text-xl">Heading 3 (XL)</option>
                      <option value="text-3xl">Heading 2 (3XL)</option>
                      <option value="text-5xl">Heading 1 (5XL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Font Family</label>
                    <select
                      value={selectedBlock.settings.fontFamily || 'default'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { fontFamily: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="default">Theme Default</option>
                      <option value="font-serif">Playfair / Lora (Serif)</option>
                      <option value="font-sans">DM Sans / Inter (Sans)</option>
                      <option value="font-mono">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Letter Spacing</label>
                    <select
                      value={selectedBlock.settings.letterSpacing || 'tracking-normal'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { letterSpacing: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="tracking-tighter">Tighter</option>
                      <option value="tracking-normal">Normal</option>
                      <option value="tracking-wide">Wide</option>
                      <option value="tracking-widest">Widest</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Line Height</label>
                    <select
                      value={selectedBlock.settings.lineHeight || 'leading-relaxed'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { lineHeight: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="leading-none">None</option>
                      <option value="leading-normal">Normal</option>
                      <option value="leading-relaxed">Relaxed</option>
                      <option value="leading-loose">Loose</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Text Transform</label>
                    <select
                      value={selectedBlock.settings.textTransform || 'normal-case'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { textTransform: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="normal-case">None</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="lowercase">lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>

                  {/* Text Gradient Settings */}
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Text Fill Type</label>
                      <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateBlockSettings(selectedBlock!.id, { textGradient: false })}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${!selectedBlock.settings.textGradient ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBlockSettings(selectedBlock!.id, { textGradient: true })}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${selectedBlock.settings.textGradient ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Gradient
                        </button>
                      </div>
                    </div>
                    {selectedBlock.settings.textGradient && (
                      <div className="space-y-2 pt-1 border-t border-slate-800/60">
                        <div>
                          <label className="text-[9px] text-slate-500 block">Gradient Colors</label>
                          <select
                            value={selectedBlock.settings.textGradientColor || 'linear-gradient(135deg, #3b82f6, #8b5cf6)'}
                            onChange={(e) => updateBlockSettings(selectedBlock!.id, { textGradientColor: e.target.value })}
                            className="w-full bg-slate-850 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                          >
                            <option value="linear-gradient(135deg, #3b82f6, #8b5cf6)">Blue to Purple</option>
                            <option value="linear-gradient(135deg, #ec4899, #f43f5e)">Pink to Rose</option>
                            <option value="linear-gradient(135deg, #f59e0b, #e11d48)">Gold to Crimson</option>
                            <option value="linear-gradient(135deg, #10b981, #059669)">Emerald Green</option>
                            <option value="linear-gradient(135deg, #ffffff, #a1a1aa)">Silver Metallic</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 block">Text Color</label>
                    <input
                      type="text"
                      placeholder="e.g. #ff0000 or text-red-500"
                      value={selectedBlock.settings.color || ''}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { color: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedBlock.type === 'image' && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image Settings</h5>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Image Source URL</label>
                    <input
                      type="text"
                      value={selectedBlock.settings.src || ''}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { src: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Object Fit</label>
                    <select
                      value={selectedBlock.settings.objectFit || 'cover'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { objectFit: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="cover">Cover (Fill & Crop)</option>
                      <option value="contain">Contain (Fit Entire)</option>
                      <option value="fill">Fill (Stretch)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Image Filter</label>
                    <select
                      value={selectedBlock.settings.filter || 'none'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { filter: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="none">None</option>
                      <option value="grayscale">Grayscale</option>
                      <option value="blur">Soft Blur</option>
                      <option value="darken">Darken (Brightness 50%)</option>
                      <option value="grayscale-darken">Grayscale + Darken</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Color Overlay (Hex/RGBA)</label>
                    <input
                      type="text"
                      placeholder="e.g. rgba(0,0,0,0.4)"
                      value={selectedBlock.settings.overlayColor || ''}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { overlayColor: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Hover Zoom Effect</label>
                    <select
                      value={selectedBlock.settings.hoverEffect || 'none'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { hoverEffect: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="none">No Zoom</option>
                      <option value="scale">Zoom on Hover</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedBlock.type === 'button' && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Button Settings</h5>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Button Text</label>
                    <input
                      type="text"
                      value={selectedBlock.settings.text || ''}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { text: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Style Variant</label>
                    <select
                      value={selectedBlock.settings.variant || 'primary'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { variant: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="primary">Primary Accent</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedBlock.type === 'group' && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Container Card Settings</h5>
                  
                  {/* Visual Background Controller (Solid vs Gradient) */}
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Background Type</label>
                      <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleBgTypeChange('solid')}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${!isGradient ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBgTypeChange('gradient')}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${isGradient ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Gradient
                        </button>
                      </div>
                    </div>

                    {!isGradient ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">Color</span>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="color"
                            value={solidColor.startsWith('#') ? solidColor : '#ffffff'}
                            onChange={(e) => handleSolidColorChange(e.target.value)}
                            className="w-5 h-5 border-0 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-[9px] font-mono text-slate-400 uppercase">{solidColor}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1 border-t border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">Start Color</span>
                          <input
                            type="color"
                            value={color1.startsWith('#') ? color1 : '#3b82f6'}
                            onChange={(e) => handleGradientChange(e.target.value, color2, angle)}
                            className="w-5 h-5 border-0 rounded cursor-pointer bg-transparent"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">End Color</span>
                          <input
                            type="color"
                            value={color2.startsWith('#') ? color2 : '#1d4ed8'}
                            onChange={(e) => handleGradientChange(color1, e.target.value, angle)}
                            className="w-5 h-5 border-0 rounded cursor-pointer bg-transparent"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                            <span>Angle</span>
                            <span>{angle}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => handleGradientChange(color1, color2, parseInt(e.target.value))}
                            className="w-full accent-blue-500 bg-slate-850 h-1 rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 block">Inner Padding</label>
                    <select
                      value={selectedBlock.settings.padding || 'p-0'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { padding: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="p-0">None (p-0)</option>
                      <option value="p-2">Small (p-2)</option>
                      <option value="p-4">Medium (p-4)</option>
                      <option value="p-6">Large (p-6)</option>
                      <option value="p-8">Extra Large (p-8)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Corner Radius</label>
                    <select
                      value={selectedBlock.settings.borderRadius || 'rounded-none'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { borderRadius: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="rounded-none">Square (none)</option>
                      <option value="rounded-md">Medium (rounded-md)</option>
                      <option value="rounded-lg">Large (rounded-lg)</option>
                      <option value="rounded-xl">XL (rounded-xl)</option>
                      <option value="rounded-2xl">2XL (rounded-2xl)</option>
                      <option value="rounded-3xl">3XL (rounded-3xl)</option>
                      <option value="rounded-full">Full (rounded-full)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Drop Shadow</label>
                    <select
                      value={selectedBlock.settings.shadow || 'shadow-none'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { shadow: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="shadow-none">None</option>
                      <option value="shadow-sm">Small</option>
                      <option value="shadow-md">Medium</option>
                      <option value="shadow-lg">Large</option>
                      <option value="shadow-xl">Extra Large</option>
                      <option value="shadow-2xl">Double XL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Backdrop Blur</label>
                    <select
                      value={selectedBlock.settings.backdropBlur || 'backdrop-blur-none'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { backdropBlur: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="backdrop-blur-none">None</option>
                      <option value="backdrop-blur-sm">Light</option>
                      <option value="backdrop-blur-md">Medium</option>
                      <option value="backdrop-blur-lg">Strong</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Border Width</label>
                    <select
                      value={selectedBlock.settings.borderWidth || 'border-0'}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { borderWidth: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="border-0">None (0px)</option>
                      <option value="border">Thin (1px)</option>
                      <option value="border-2">Thick (2px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Border Color</label>
                    <input
                      type="text"
                      placeholder="e.g. #3b82f6"
                      value={selectedBlock.settings.borderColor || ''}
                      onChange={(e) => updateBlockSettings(selectedBlock!.id, { borderColor: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Animation settings */}
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Animations & Physics</h5>
                <select
                  value={selectedBlock.animation?.type || 'none'}
                  onChange={(e) => updateBlockAnimation(selectedBlock!.id, {
                    type: e.target.value as any,
                    speed: e.target.value === 'scroll-parallax' ? 0.3 : undefined,
                  })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                >
                  <option value="none">No Animation</option>
                  <option value="fade-in">Fade In</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="zoom">Zoom In</option>
                  <option value="scroll-parallax">Scroll Parallax</option>
                </select>
              </div>
            </div>
          ) : (
            selectedSection && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 pb-2 border-b border-slate-800 flex justify-between items-center">
                  <span>Section Settings</span>
                  <button
                    onClick={() => deleteSection(selectedSection.id)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </h4>
                <div className="flex items-center justify-between py-1">
                  <label className="text-[10px] text-slate-400 block">Global Section</label>
                  <input
                    type="checkbox"
                    checked={selectedSection.isGlobal || false}
                    onChange={() => toggleSectionGlobal(selectedSection.id)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Background Color</label>
                  <input
                    type="color"
                    value={selectedSection.settings.backgroundColor || '#ffffff'}
                    onChange={(e) => updateSectionSettings(selectedSection.id, { backgroundColor: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded focus:outline-none h-8"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Vertical Padding</label>
                  <select
                    value={selectedSection.settings.paddingY || 'py-20'}
                    onChange={(e) => updateSectionSettings(selectedSection.id, { paddingY: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                  >
                    <option value="py-12">Small (py-12)</option>
                    <option value="py-20">Medium (py-20)</option>
                    <option value="py-32">Large (py-32)</option>
                  </select>
                </div>

                {/* SVG Shape Dividers */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shape Dividers</h5>
                  <div>
                    <label className="text-[9px] text-slate-500 block">Bottom Divider</label>
                    <select
                      value={selectedSection.settings.bottomDivider || 'none'}
                      onChange={(e) => updateSectionSettings(selectedSection.id, { bottomDivider: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none text-slate-200"
                    >
                      <option value="none">None (Straight)</option>
                      <option value="slope">Slope Angle</option>
                      <option value="curve">Gentle Curve</option>
                      <option value="wave">Organic Wave</option>
                    </select>
                  </div>
                  {selectedSection.settings.bottomDivider && selectedSection.settings.bottomDivider !== 'none' && (
                    <div>
                      <label className="text-[9px] text-slate-500 block">Divider Fill Color</label>
                      <input
                        type="color"
                        value={selectedSection.settings.bottomDividerColor || '#ffffff'}
                        onChange={(e) => updateSectionSettings(selectedSection.id, { bottomDividerColor: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-xs rounded focus:outline-none h-8"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
