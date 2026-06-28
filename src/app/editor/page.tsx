'use client';

import React, { useState } from 'react';
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

  // Compile the custom components into JavaScript strings once so they can be executed by GridRenderer
  // Under a real system, they are saved as compiled strings in the layout JSON.
  // We transpile them on the fly here.
  const compiledComponents: Record<string, string> = {};
  Object.entries(layout.customComponents).forEach(([name, code]) => {
    try {
      const { transform } = require('sucrase');
      compiledComponents[name] = transform(code, {
        transforms: ['jsx', 'typescript', 'imports'],
      }).code;
    } catch (e) {
      console.error(`Error compiling custom component ${name}:`, e);
    }
  });

  if (isPreview) {
    return (
      <div className="w-full min-h-screen bg-white relative">
        {/* Floating Back to Edit button */}
        <button
          onClick={() => setIsPreview(false)}
          className="fixed bottom-6 right-6 z-50 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-850 text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ← Exit Preview
        </button>

        {/* Storefront rendering */}
        <div className="w-full">
          {layout.sections.map((section) => (
            <GridRenderer
              key={section.id}
              section={section}
              theme={layout.theme}
              customComponents={compiledComponents}
              breakpoint={breakpoint}
              isPreview={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Bar */}
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
        isPreview={isPreview}
        setIsPreview={setIsPreview}
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
          zoom={zoom}
          pan={pan}
          setPan={setPan}
        />
      </div>
    </div>
  );
}
