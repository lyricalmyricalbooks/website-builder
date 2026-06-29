'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Link as LinkIcon, Check 
} from 'lucide-react';
import { Block, Section, PageLayout, GridPosition } from '@/types/editor';
import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { ProductCardBlock } from '../blocks/ProductCardBlock';
import { SearchBlock } from '../blocks/SearchBlock';

interface EditorCanvasProps {
  layout: PageLayout;
  breakpoint: 'desktop' | 'mobile';
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  updateBlockPosition: (blockId: string, position: Partial<GridPosition>) => void;
  updateBlockSettings: (blockId: string, settings: Record<string, any>) => void;
  zoom: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
}

// Helper to parse aspect ratio string (e.g. "16:9" or "1:1")
const parseAspectRatio = (ratioStr: string): number => {
  if (!ratioStr || ratioStr === 'none') return 1;
  const parts = ratioStr.split(':');
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return w / h;
  }
  return 1;
};

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  layout,
  breakpoint,
  selectedBlockId,
  setSelectedBlockId,
  selectedSectionId,
  setSelectedSectionId,
  updateBlockPosition,
  updateBlockSettings,
  zoom,
  pan,
  setPan,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cols = breakpoint === 'mobile' ? 8 : 24;

  // Track dragging/resizing state
  const [activeDrag, setActiveDrag] = useState<{
    blockId: string;
    sectionId: string;
    type: 'move' | 'resize-e' | 'resize-s' | 'resize-se';
    startX: number;
    startY: number;
    startPos: GridPosition;
    cellWidth: number;
    cellHeight: number;
    aspectRatio?: string;
  } | null>(null);

  // Mouse pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Key state for Alt key (distance measurement)
  const [altPressed, setAltPressed] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // WYSIWYG text editing state
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setAltPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setAltPressed(false);
    };
    const handleSpaceDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement === document.body) {
        e.preventDefault();
        setIsPanning(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleSpaceDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleSpaceDown);
    };
  }, []);

  // Handle mouse down on canvas for panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || isPanning) { // Middle click or space+drag
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (activeDrag && containerRef.current) {
      const { startX, startY, startPos, cellWidth, cellHeight, type, aspectRatio } = activeDrag;
      const deltaX = Math.round((e.clientX - startX) / (cellWidth * zoom));
      const deltaY = Math.round((e.clientY - startY) / (cellHeight * zoom));

      if (type === 'move') {
        const newXStart = Math.max(1, Math.min(cols - (startPos.x_end - startPos.x_start) + 1, startPos.x_start + deltaX));
        const width = startPos.x_end - startPos.x_start;
        const newYStart = Math.max(1, startPos.y_start + deltaY);
        
        updateBlockPosition(activeDrag.blockId, {
          x_start: newXStart,
          x_end: newXStart + width,
          y_start: newYStart,
          y_end: newYStart + (startPos.y_end - startPos.y_start),
        });
      } else if (type === 'resize-e') {
        const newXEnd = Math.max(startPos.x_start + 1, Math.min(cols + 1, startPos.x_end + deltaX));
        const updates: Partial<GridPosition> = { x_end: newXEnd };

        if (aspectRatio && aspectRatio !== 'none') {
          const ratio = parseAspectRatio(aspectRatio);
          const widthPx = (newXEnd - startPos.x_start) * cellWidth;
          const heightPx = widthPx / ratio;
          const rowSpan = Math.max(1, Math.round(heightPx / cellHeight));
          updates.y_end = startPos.y_start + rowSpan;
        }

        updateBlockPosition(activeDrag.blockId, updates);
      } else if (type === 'resize-s') {
        const newYEnd = Math.max(startPos.y_start + 1, startPos.y_end + deltaY);
        const updates: Partial<GridPosition> = { y_end: newYEnd };

        if (aspectRatio && aspectRatio !== 'none') {
          const ratio = parseAspectRatio(aspectRatio);
          const heightPx = (newYEnd - startPos.y_start) * cellHeight;
          const widthPx = heightPx * ratio;
          const colSpan = Math.max(1, Math.round(widthPx / cellWidth));
          updates.x_end = Math.min(cols + 1, startPos.x_start + colSpan);
        }

        updateBlockPosition(activeDrag.blockId, updates);
      } else if (type === 'resize-se') {
        const newXEnd = Math.max(startPos.x_start + 1, Math.min(cols + 1, startPos.x_end + deltaX));
        const updates: Partial<GridPosition> = { x_end: newXEnd };

        if (aspectRatio && aspectRatio !== 'none') {
          const ratio = parseAspectRatio(aspectRatio);
          const widthPx = (newXEnd - startPos.x_start) * cellWidth;
          const heightPx = widthPx / ratio;
          const rowSpan = Math.max(1, Math.round(heightPx / cellHeight));
          updates.y_end = startPos.y_start + rowSpan;
        } else {
          updates.y_end = Math.max(startPos.y_start + 1, startPos.y_end + deltaY);
        }

        updateBlockPosition(activeDrag.blockId, updates);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setActiveDrag(null);
    setIsPanning(false);
  };

  // Start drag or resize handler
  const handleInteractionStart = (
    e: React.MouseEvent,
    block: Block,
    sectionId: string,
    type: 'move' | 'resize-e' | 'resize-s' | 'resize-se'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedBlockId(block.id);
    setSelectedSectionId(sectionId);

    const blockElement = e.currentTarget.closest('.block-wrapper');
    const gridElement = e.currentTarget.closest('.grid-container');

    if (blockElement && gridElement) {
      const gridRect = gridElement.getBoundingClientRect();
      const cellWidth = gridRect.width / cols;
      const cellHeight = 20; // 20px minmax row height

      const pos = breakpoint === 'mobile' ? block.position.mobile : block.position.desktop;

      setActiveDrag({
        blockId: block.id,
        sectionId,
        type,
        startX: e.clientX,
        startY: e.clientY,
        startPos: { ...pos },
        cellWidth,
        cellHeight,
        aspectRatio: block.settings.aspectRatio,
      });
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter Link URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  // Render a single block inside the editor canvas
  const renderBlock = (block: Block, sectionId: string) => {
    const isSelected = selectedBlockId === block.id;
    const isEditingText = editingBlockId === block.id;
    const pos = breakpoint === 'mobile' ? block.position.mobile : block.position.desktop;

    const blockStyle: React.CSSProperties = {
      gridColumnStart: pos.x_start,
      gridColumnEnd: pos.x_end,
      gridRowStart: pos.y_start,
      gridRowEnd: pos.y_end,
      zIndex: pos.z_index,
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    // Render group block with styles
    const renderGroupBlock = () => {
      const {
        backgroundColor = 'transparent',
        padding = 'p-0',
        borderRadius = 'rounded-none',
        shadow = 'shadow-none',
        backdropBlur = 'backdrop-blur-none',
        borderColor = 'transparent',
        borderWidth = 'border-0',
      } = block.settings;

      const isHexBg = backgroundColor.startsWith('#') || backgroundColor.startsWith('rgb') || backgroundColor.startsWith('rgba') || backgroundColor.startsWith('var') || backgroundColor.startsWith('linear-gradient');
      const groupStyle: React.CSSProperties = {
        background: isHexBg ? backgroundColor : undefined,
        borderColor: borderColor !== 'transparent' ? borderColor : undefined,
        borderStyle: borderWidth !== 'border-0' ? 'solid' : undefined,
      };

      return (
        <div
          className={`w-full h-full ${padding} ${borderRadius} ${shadow} ${backdropBlur} ${borderWidth} ${
            !isHexBg && backgroundColor !== 'transparent' ? backgroundColor : ''
          }`}
          style={groupStyle}
        >
          <div className="absolute inset-0 border border-dashed border-slate-800/30 pointer-events-none rounded-inherit" />
        </div>
      );
    };

    const renderContent = () => {
      switch (block.type) {
        case 'text':
          if (isEditingText) {
            // Inline WYSIWYG text editor
            const alignment = block.settings.alignment || 'text-left';
            const fontSize = block.settings.fontSize || 'text-base';
            const fontWeight = block.settings.fontWeight || 'font-normal';
            const lineHeight = block.settings.lineHeight || 'leading-relaxed';
            const letterSpacing = block.settings.letterSpacing || 'tracking-normal';
            const textTransform = block.settings.textTransform || 'normal-case';
            const isHexColor = block.settings.color && (block.settings.color.startsWith('#') || block.settings.color.startsWith('rgb'));

            return (
              <div 
                className={`w-full h-full p-2 outline-none pointer-events-auto select-text ${alignment} ${fontSize} ${fontWeight} ${lineHeight} ${letterSpacing} ${textTransform}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  updateBlockSettings(block.id, { content: e.currentTarget.innerHTML });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.currentTarget.blur();
                    setEditingBlockId(null);
                  }
                }}
                style={{
                  color: isHexColor ? block.settings.color : undefined,
                }}
                dangerouslySetInnerHTML={{ __html: block.settings.content || '' }}
              />
            );
          }
          return <TextBlock settings={block.settings} theme={layout.theme} />;
        case 'image':
          return <ImageBlock settings={block.settings} />;
        case 'button':
          return <ButtonBlock settings={block.settings} theme={layout.theme} />;
        case 'product-card':
          return <ProductCardBlock settings={block.settings} theme={layout.theme} />;
        case 'search':
          return <SearchBlock settings={block.settings} />;
        case 'group':
          return renderGroupBlock();
        case 'custom':
          return (
            <div className="w-full h-full p-4 border border-blue-500/20 bg-blue-500/5 text-blue-500 rounded-lg flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Custom Component</span>
              <span className="text-sm font-semibold">{block.componentName}</span>
            </div>
          );
        default:
          return <div className="p-2 text-xs text-gray-400">Unknown Block</div>;
      }
    };

    return (
      <div
        key={block.id}
        style={blockStyle}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(null)}
        onDoubleClick={(e) => {
          if (block.type === 'text') {
            e.stopPropagation();
            setEditingBlockId(block.id);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBlockId(block.id);
          setSelectedSectionId(sectionId);
        }}
        className={`block-wrapper group relative border transition-colors duration-150 cursor-pointer ${
          isSelected 
            ? 'border-blue-500 ring-1 ring-blue-500' 
            : hoveredBlockId === block.id 
            ? 'border-blue-400/50' 
            : 'border-transparent'
        }`}
      >
        {/* Drag Handle Overlay */}
        {!isEditingText && (
          <div
            onMouseDown={(e) => handleInteractionStart(e, block, sectionId, 'move')}
            className="absolute inset-0 z-0 bg-transparent"
          />
        )}

        {/* Actual block content */}
        <div className="relative z-10 w-full h-full pointer-events-none">
          {renderContent()}
        </div>

        {/* Selection Outlines and Resize Handles */}
        {isSelected && !isEditingText && (
          <>
            {/* Top-Left Coordinate indicator */}
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm font-mono z-30 pointer-events-none">
              C:{pos.x_start}-{pos.x_end - 1} | R:{pos.y_start}-{pos.y_end - 1}
            </div>

            {/* Resize East (Right) */}
            <div
              onMouseDown={(e) => handleInteractionStart(e, block, sectionId, 'resize-e')}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-blue-500/10 hover:bg-blue-500/40 z-20"
            />
            {/* Resize South (Bottom) */}
            <div
              onMouseDown={(e) => handleInteractionStart(e, block, sectionId, 'resize-s')}
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-blue-500/10 hover:bg-blue-500/40 z-20"
            />
            {/* Resize South-East (Corner) */}
            <div
              onMouseDown={(e) => handleInteractionStart(e, block, sectionId, 'resize-se')}
              className="absolute right-0 bottom-0 w-3 h-3 cursor-nwse-resize bg-blue-600 border border-white rounded-full shadow-sm z-30"
            />
          </>
        )}

        {/* Floating formatting toolbar for inline text editor */}
        {isEditingText && (
          <div className="absolute -top-12 left-0 bg-slate-950 border border-slate-800 text-slate-200 p-1.5 rounded-xl shadow-2xl flex items-center space-x-2 z-40 select-none pointer-events-auto">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Bold"
            >
              <Bold size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Italic"
            >
              <Italic size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline'); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Underline"
            >
              <Underline size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleInsertLink(); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Insert Link"
            >
              <LinkIcon size={13} />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); updateBlockSettings(block.id, { alignment: 'text-left' }); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Align Left"
            >
              <AlignLeft size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); updateBlockSettings(block.id, { alignment: 'text-center' }); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Align Center"
            >
              <AlignCenter size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); updateBlockSettings(block.id, { alignment: 'text-right' }); }}
              className="p-1.5 hover:bg-slate-850 rounded text-slate-300 hover:text-white"
              title="Align Right"
            >
              <AlignRight size={13} />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <select
              value={block.settings.fontSize || 'text-base'}
              onChange={(e) => updateBlockSettings(block.id, { fontSize: e.target.value })}
              className="bg-slate-900 border border-slate-850 text-[10px] rounded px-1.5 py-0.5 text-slate-200 focus:outline-none"
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Body</option>
              <option value="text-xl">H3</option>
              <option value="text-3xl">H2</option>
              <option value="text-5xl">H1</option>
            </select>
            <div className="w-px h-4 bg-slate-800" />
            <button
              type="button"
              onClick={() => setEditingBlockId(null)}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white flex items-center justify-center"
              title="Done"
            >
              <Check size={13} />
            </button>
          </div>
        )}

        {/* Distance measurement guides (Alt hover) */}
        {altPressed && selectedBlockId && selectedBlockId !== block.id && hoveredBlockId === block.id && (
          <div className="absolute inset-0 border border-dashed border-red-500 pointer-events-none z-30">
            <div className="absolute top-1/2 left-0 right-0 border-t border-red-500 flex justify-center">
              <span className="bg-red-500 text-white text-[10px] px-1 rounded -translate-y-1/2">Measure</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      className={`relative flex-grow h-full overflow-hidden bg-slate-900 flex items-center justify-center select-none ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Zoom/Pan viewport */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: activeDrag ? 'none' : 'transform 0.1s ease-out',
        }}
        className="relative w-full max-w-[1280px] bg-white shadow-2xl transition-shadow duration-300"
      >
        {layout.sections.map((section) => {
          const isSecSelected = selectedSectionId === section.id;

          return (
            <div
              key={section.id}
              onClick={() => {
                setSelectedSectionId(section.id);
                setSelectedBlockId(null);
              }}
              style={{
                backgroundColor: section.settings.backgroundColor || '#ffffff',
                color: section.settings.textColor || '#111827',
              }}
              className={`relative w-full px-6 md:px-12 ${
                section.settings.paddingY || 'py-20'
              } border-b border-gray-100 ${
                isSecSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
            >
              {/* Section Tag */}
              <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-mono select-none flex items-center space-x-2">
                <span>Section: {section.type}</span>
                {section.isGlobal && (
                  <span className="bg-blue-600 text-white text-[9px] px-1 rounded uppercase font-bold">Global</span>
                )}
              </div>

              {/* Responsive 24-Column Grid Canvas */}
              <div
                className="grid-container relative w-full"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridAutoRows: 'minmax(20px, auto)',
                  gap: '12px',
                }}
              >
                {/* Editor Grid Lines Overlay */}
                <div
                  className="absolute inset-0 grid pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gridAutoRows: 'minmax(20px, auto)',
                    gap: '12px',
                  }}
                >
                  {Array.from({ length: cols * 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-dashed border-gray-200/50 h-[20px]"
                    />
                  ))}
                </div>

                {/* Render Section Blocks */}
                {section.blocks.map((block) => renderBlock(block, section.id))}
              </div>
            </div>
          );
        })}

        {layout.sections.length === 0 && (
          <div className="py-32 text-center text-gray-400">
            <p className="text-lg">Your canvas is empty.</p>
            <p className="text-sm mt-2">Add a section from the left sidebar to get started.</p>
          </div>
        )}
      </div>

      {/* Rulers Overlay */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-slate-800 border-b border-slate-700 flex text-[9px] text-slate-400 select-none pointer-events-none">
        <div className="w-4 h-full border-r border-slate-700 bg-slate-900" />
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-grow border-r border-slate-700/50 text-center py-0.5">
            Col {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
