'use client';

import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { useLayout } from '@/hooks/useLayout';
import { Topbar } from '@/components/editor/Topbar';
import { Sidebar } from '@/components/editor/Sidebar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { GridRenderer } from '@/components/GridRenderer';

export default function EditorPage() {
  const {
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
    canUndo,
    canRedo,
  } = useLayout();

  const [isPreview, setIsPreview] = useState(false);

  // Poll the backend API for Figma exports
  React.useEffect(() => {
    if (isPreview) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/import-layout');
        const data = await res.json();
        if (data.layout) {
          updateLayout((next) => {
            Object.assign(next, data.layout);
          });
        }
      } catch (e) {
        // Silently fail to avoid console clutter
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPreview, updateLayout]);

  // If preview mode, render the static preview version of the page
  if (isPreview) {
    return (
      <div className="relative w-screen h-screen bg-black overflow-x-hidden">
        {/* Floating Back to Edit button */}
        <button
          onClick={() => setIsPreview(false)}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-semibold transition-all hover:scale-105"
        >
          <Edit3 size={15} />
          <span>Back to Editor</span>
        </button>

        {/* Render all active page sections */}
        <div className="w-full">
          {(layout.pages[layout.activePageId]?.sections || []).map((section) => (
            <GridRenderer
              key={section.id}
              section={section}
              theme={layout.theme}
              customComponents={layout.customComponents}
              breakpoint={breakpoint}
              isPreview={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Controls Bar */}
      <Topbar
        title={layout.title}
        breakpoint={breakpoint}
        setBreakpoint={setBreakpoint}
        zoom={zoom}
        setZoom={setZoom}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        layout={layout}
        onImportLayout={(newLayout) => updateLayout((next) => { Object.assign(next, newLayout); })}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        setActivePage={setActivePage}
        addPage={addPage}
        deletePage={deletePage}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          layout={layout}
          breakpoint={breakpoint}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          addSection={addSection}
          deleteSection={deleteSection}
          updateSectionSettings={updateSectionSettings}
          toggleSectionGlobal={toggleSectionGlobal}
          addBlock={addBlock}
          deleteBlock={deleteBlock}
          duplicateBlock={duplicateBlock}
          updateBlockPosition={updateBlockPosition}
          updateBlockSettings={updateBlockSettings}
          updateBlockAnimation={updateBlockAnimation}
          updateTheme={updateTheme}
          updateCheckoutTheme={updateCheckoutTheme}
          updateCustomComponentCode={updateCustomComponentCode}
          addNavigationLink={addNavigationLink}
          deleteNavigationLink={deleteNavigationLink}
          updateNavigationLink={updateNavigationLink}
        />

        {/* Central Visual Editor Canvas */}
        <EditorCanvas
          layout={layout}
          breakpoint={breakpoint}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          updateBlockPosition={updateBlockPosition}
          updateBlockSettings={updateBlockSettings}
          zoom={zoom}
          pan={pan}
          setPan={setPan}
        />
      </div>
    </div>
  );
}
