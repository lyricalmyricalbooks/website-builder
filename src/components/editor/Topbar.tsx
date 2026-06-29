'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Monitor, Smartphone, Undo2, Redo2, ZoomIn, ZoomOut, 
  Download, Upload, Eye, Edit3, Trash2, Plus 
} from 'lucide-react';
import { PageLayout } from '@/types/editor';

interface TopbarProps {
  title: string;
  breakpoint: 'desktop' | 'mobile';
  setBreakpoint: (val: 'desktop' | 'mobile') => void;
  zoom: number;
  setZoom: (val: number | ((v: number) => number)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  layout: PageLayout;
  onImportLayout: (layout: PageLayout) => void;
  isPreview: boolean;
  setIsPreview: (val: boolean) => void;
  setActivePage: (pageId: string) => void;
  addPage: (name: string, slug: string) => void;
  deletePage: (pageId: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  breakpoint,
  setBreakpoint,
  zoom,
  setZoom,
  undo,
  redo,
  canUndo,
  canRedo,
  layout,
  onImportLayout,
  isPreview,
  setIsPreview,
  setActivePage,
  addPage,
  deletePage,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);

  // Form states
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const handleExportJSON = () => {
    setShowExportModal(true);
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(layout, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${layout.id || 'layout'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.id || !parsed.pages) {
        throw new Error('Invalid layout schema. Must contain id and pages.');
      }
      onImportLayout(parsed);
      setShowImportModal(false);
      setImportJsonText('');
      setImportError(null);
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim() || !newPageSlug.trim()) return;
    addPage(newPageName, newPageSlug);
    setNewPageName('');
    setNewPageSlug('');
    setShowAddPageModal(false);
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between text-slate-100 z-50 select-none">
      {/* Brand & Page Selector */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            Ω
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide uppercase">Antigravity</h1>
            <p className="text-[10px] text-slate-400">Storefront Builder</p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-850" />

        {/* Page Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPageDropdown(!showPageDropdown)}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 hover:text-white rounded-lg flex items-center space-x-2 text-xs font-semibold shadow-sm transition-all"
          >
            <span>Page: <b className="text-blue-400">{layout.pages[layout.activePageId]?.name || 'Home'}</b></span>
            <span className="text-[10px] text-slate-500 font-mono">({layout.pages[layout.activePageId]?.slug})</span>
            <span className="text-[9px] text-slate-500">▼</span>
          </button>

          {showPageDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowPageDropdown(false)} />
              <div className="absolute left-0 mt-1.5 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 block mb-1">Custom Pages</span>
                {Object.values(layout.pages).filter(p => p.type === 'custom').map((p) => (
                  <div
                    key={p.id}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      layout.activePageId === p.id ? 'bg-blue-600/15 text-blue-450 border border-blue-500/10' : 'text-slate-350 hover:bg-slate-905 hover:text-slate-200'
                    }`}
                    onClick={() => {
                      setActivePage(p.id);
                      setShowPageDropdown(false);
                    }}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{p.slug}</div>
                    </div>
                    {p.id !== 'home' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePage(p.id);
                          if (layout.activePageId === p.id) {
                            setActivePage('home');
                          }
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                ))}

                <div className="w-full h-px bg-slate-850 my-1.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 block mb-1">System Templates</span>
                {Object.values(layout.pages).filter(p => p.type === 'system').map((p) => (
                  <div
                    key={p.id}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      layout.activePageId === p.id ? 'bg-blue-600/15 text-blue-450 border border-blue-500/10' : 'text-slate-350 hover:bg-slate-905 hover:text-slate-200'
                    }`}
                    onClick={() => {
                      setActivePage(p.id);
                      setShowPageDropdown(false);
                    }}
                  >
                    <div className="truncate">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{p.slug}</div>
                    </div>
                  </div>
                ))}

                <div className="w-full h-px bg-slate-855 my-1.5" />
                <button
                  onClick={() => {
                    setShowAddPageModal(true);
                    setShowPageDropdown(false);
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Create Custom Page</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Viewport Breakpoint Selector */}
      <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700/50">
        <button
          onClick={() => setBreakpoint('desktop')}
          className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 text-xs font-medium transition-all ${
            breakpoint === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor size={14} />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setBreakpoint('mobile')}
          className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 text-xs font-medium transition-all ${
            breakpoint === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone size={14} />
          <span>Mobile</span>
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center space-x-4">
        {/* Zoom */}
        <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/50 p-0.5 text-slate-400">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="p-1.5 hover:text-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="px-2 text-[10px] font-mono font-medium select-none min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            className="p-1.5 hover:text-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* History (Undo/Redo) */}
        <div className="flex items-center space-x-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Toggle Preview */}
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs font-medium border transition-all ${
              isPreview
                ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
            <span>{isPreview ? 'Back to Edit' : 'Preview'}</span>
          </button>

          {/* Open GrapesJS Studio */}
          <Link
            href="/studio"
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-350 hover:bg-slate-750 hover:text-slate-200 flex items-center space-x-1.5 text-xs font-semibold shadow-sm transition-all"
          >
            <span>🍇 GrapesJS Studio</span>
          </Link>

          {/* Import Figma */}
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-750 flex items-center space-x-1.5 text-xs font-medium shadow-sm transition-all"
          >
            <Upload size={14} />
            <span>Import Figma</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 text-xs font-medium shadow-sm transition-all"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Export JSON Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div>
                <h3 className="font-bold text-base text-white">Exported Page Layout Schema</h3>
                <p className="text-xs text-slate-400 mt-0.5">Use this JSON to render this page dynamically on any frontend.</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm font-medium"
              >
                Close
              </button>
            </div>
            <div className="p-6 flex-grow overflow-auto max-h-[400px]">
              <pre className="text-xs font-mono text-blue-400 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                {JSON.stringify(layout, null, 2)}
              </pre>
            </div>
            <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={downloadJSON}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Download size={14} />
                <span>Download .json</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Figma Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleImportSubmit} className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div>
                <h3 className="font-bold text-base text-white">Import Figma Design</h3>
                <p className="text-xs text-slate-400 mt-0.5">Paste the JSON exported from the Antigravity Figma Plugin.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                }}
                className="text-slate-400 hover:text-white text-sm font-medium"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                required
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste Figma JSON here (e.g. {"id": "my_page", "pages": {...}})'
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {importError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-lg">
                  Error: {importError}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Upload size={14} />
                <span>Import Layout</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Page Modal */}
      {showAddPageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleCreatePage} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div>
                <h3 className="font-bold text-base text-white">Create Custom Page</h3>
                <p className="text-xs text-slate-400 mt-0.5">Add a new designable page to your storefront.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPageModal(false)}
                className="text-slate-400 hover:text-white text-sm font-medium"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">Page Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. About Us"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    // Auto-generate slug
                    setNewPageSlug('/' + e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">URL Path (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /about"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button
                type="button"
                onClick={() => setShowAddPageModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-all"
              >
                Create Page
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Topbar;
