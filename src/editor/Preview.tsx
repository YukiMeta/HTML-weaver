import { useState } from 'react';
import type { Block } from '../core/schema';
import { renderToHtml } from '../core/renderer';

interface PreviewProps {
  blocks: Block[];
}

export function Preview({ blocks }: PreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const html = renderToHtml(blocks);

  function handleExport() {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <button
          className={`toolbar-btn${viewport === 'desktop' ? ' active' : ''}`}
          onClick={() => setViewport('desktop')}
        >
          🖥 Desktop
        </button>
        <button
          className={`toolbar-btn${viewport === 'mobile' ? ' active' : ''}`}
          onClick={() => setViewport('mobile')}
        >
          📱 Mobile
        </button>
        <div style={{ flex: 1 }} />
        <button className="toolbar-btn export-btn" onClick={handleExport}>
          ⬇ Export HTML
        </button>
      </div>
      <div className="preview-frame-wrapper">
        <iframe
          srcDoc={html}
          className={`preview-iframe ${viewport}`}
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

export default Preview;
