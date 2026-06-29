// Antigravity Storefront Exporter - Core Figma Plugin Logic
// Runs inside the Figma sandbox

figma.showUI(__html__, { width: 340, height: 440 });

// Handle messages from the HTML UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-layout') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('❌ Please select a frame to export.');
      return;
    }
    
    const targetNode = selection[0];
    if (targetNode.type !== 'FRAME') {
      figma.notify('❌ Selection must be a Frame (e.g. Desktop Homepage).');
      return;
    }

    figma.notify('Analyzing design layers...');
    
    try {
      const layout = translateFrameToLayout(targetNode);
      figma.ui.postMessage({ type: 'compiled-layout', layout });
    } catch (err) {
      figma.notify('❌ Export failed: ' + err.message);
    }
  }
};

function translateFrameToLayout(frame) {
  const cols = 24;
  const colWidth = frame.width / cols;
  const rowHeight = 20; // 20px grid rows

  const sections = [];
  
  // Create a default section containing all top-level children of the frame
  const defaultSection = {
    id: `sec_${Date.now()}`,
    type: 'custom',
    settings: {
      backgroundColor: rgbToHex(frame.fills),
      paddingY: 'py-20',
      textColor: '#111827'
    },
    blocks: []
  };

  // Traverse immediate children of the selected frame
  for (const child of frame.children) {
    const block = translateNodeToBlock(child, colWidth, rowHeight);
    if (block) {
      defaultSection.blocks.push(block);
    }
  }

  sections.push(defaultSection);

  return {
    id: `figma_${frame.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title: frame.name,
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1f2937',
        background: rgbToHex(frame.fills) || '#ffffff',
        text: '#111827',
        buttonBg: '#3b82f6',
        buttonText: '#ffffff'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter'
      },
      spacingScale: [4, 8, 12, 16, 24, 32, 48, 64],
      checkout: {
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        inputBorderRadius: 'rounded-md',
        fontFamily: 'Inter'
      }
    },
    navigation: [],
    customComponents: {},
    sections: sections
  };
}

function translateNodeToBlock(node, colWidth, rowHeight) {
  // Calculate grid coordinates relative to parent frame
  const x_start = Math.max(1, Math.round(node.x / colWidth) + 1);
  const x_end = Math.max(x_start + 1, Math.round((node.x + node.width) / colWidth) + 1);
  
  const y_start = Math.max(1, Math.round(node.y / rowHeight) + 1);
  const y_end = Math.max(y_start + 1, Math.round((node.y + node.height) / rowHeight) + 1);

  const position = {
    desktop: { x_start, x_end, y_start, y_end, z_index: 1 },
    mobile: { x_start: 1, x_end: 9, y_start, y_end, z_index: 1 } // Fallback mobile
  };

  // 1. Text Nodes
  if (node.type === 'TEXT') {
    return {
      id: `blk_${node.id.replace(/:/g, '_')}`,
      type: 'text',
      settings: {
        content: `<p>${node.characters.replace(/\n/g, '<br />')}</p>`,
        fontSize: mapFontSize(node.fontSize),
        color: rgbToHex(node.fills) || '#111827',
        alignment: mapAlignment(node.textAlignHorizontal)
      },
      position
    };
  }

  // 2. Images (Rectangles with Image fills)
  if (node.type === 'RECTANGLE' && hasImageFill(node.fills)) {
    return {
      id: `blk_${node.id.replace(/:/g, '_')}`,
      type: 'image',
      settings: {
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60', // Placeholder
        alt: node.name,
        objectFit: 'cover'
      },
      position
    };
  }

  // 3. Buttons (Groups or Frames named with #button or containing text)
  if (node.name.toLowerCase().includes('button') || node.name.toLowerCase().includes('btn')) {
    return {
      id: `blk_${node.id.replace(/:/g, '_')}`,
      type: 'button',
      settings: {
        text: extractTextContent(node) || 'Click Me',
        variant: 'primary',
        magnetic: true
      },
      position
    };
  }

  // 4. Product Cards
  if (node.name.toLowerCase().includes('product') || node.name.toLowerCase().includes('card')) {
    return {
      id: `blk_${node.id.replace(/:/g, '_')}`,
      type: 'product-card',
      settings: {
        title: extractTextContent(node) || 'Premium Product',
        price: '$99.00',
        imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
      },
      position
    };
  }

  return null;
}

// Helpers
function hasImageFill(fills) {
  if (!fills || !Array.isArray(fills)) return false;
  return fills.some(fill => fill.type === 'IMAGE');
}

function rgbToHex(fills) {
  if (!fills || !Array.isArray(fills) || fills.length === 0) return null;
  const fill = fills[0];
  if (fill.type !== 'SOLID') return null;
  const r = Math.round(fill.color.r * 255);
  const g = Math.round(fill.color.g * 255);
  const b = Math.round(fill.color.b * 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function mapFontSize(size) {
  if (!size) return 'text-base';
  if (size < 12) return 'text-xs';
  if (size < 16) return 'text-sm';
  if (size < 20) return 'text-base';
  if (size < 28) return 'text-lg';
  if (size < 40) return 'text-xl';
  if (size < 60) return 'text-3xl';
  return 'text-5xl';
}

function mapAlignment(align) {
  if (align === 'CENTER') return 'text-center';
  if (align === 'RIGHT') return 'text-right';
  if (align === 'JUSTIFIED') return 'text-justify';
  return 'text-left';
}

function extractTextContent(node) {
  if (node.type === 'TEXT') return node.characters;
  if (node.children) {
    for (const child of node.children) {
      const text = extractTextContent(child);
      if (text) return text;
    }
  }
  return null;
}
