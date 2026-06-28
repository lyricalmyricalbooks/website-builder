'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Undo2, Redo2, ZoomIn, ZoomOut, Download, Eye, Edit3 } from 'lucide-react';
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
  isPreview: boolean;
  setIsPreview: (val: boolean) => void;
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
  isPreview,
  setIsPreview,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

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

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between text-slate-100 z-50 select-none">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
          Ω
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide uppercase">Antigravity</h1>
          <p className="text-[10px] text-slate-400">E-Commerce Storefront Builder</p>
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
    </header>
  );
};

export default Topbar;
