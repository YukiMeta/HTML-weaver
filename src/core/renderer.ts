import type { Block, BlockData, BlockConfig } from './schema';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHero(data: BlockData, config: BlockConfig): string {
  const theme = config.theme ?? 'light';
  const layout = config.layout ?? 'center';

  const bgStyle = theme === 'dark'
    ? 'background: #1a1a2e; color: #eee;'
    : theme === 'gradient'
    ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;'
    : 'background: #f8f9fa; color: #333;';

  const textAlign = layout === 'center' ? 'text-align: center;' : 'text-align: left;';
  const flexDir = layout === 'split' ? 'flex-direction: row; gap: 40px;' : 'flex-direction: column;';
  const alignItems = layout === 'center' ? 'align-items: center;' : 'align-items: flex-start;';

  const btnStyle = theme === 'dark' || theme === 'gradient'
    ? 'background: #fff; color: #333;'
    : 'background: #667eea; color: #fff;';

  const imageHtml = data.imageUrl && layout === 'split'
    ? `<img src="${escapeHtml(data.imageUrl)}" alt="" style="max-width:400px;border-radius:12px;flex-shrink:0;" />`
    : '';

  return `
<section style="padding: 80px 40px; ${bgStyle}">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; ${flexDir} ${alignItems} gap: 24px;">
    <div style="flex: 1; ${textAlign}">
      ${data.title ? `<h1 style="font-size: 3rem; font-weight: 800; margin: 0 0 16px;">${escapeHtml(data.title)}</h1>` : ''}
      ${data.subtitle ? `<h2 style="font-size: 1.5rem; font-weight: 400; margin: 0 0 16px; opacity: 0.85;">${escapeHtml(data.subtitle)}</h2>` : ''}
      ${data.description ? `<p style="font-size: 1.1rem; margin: 0 0 32px; opacity: 0.75; max-width: 600px;">${escapeHtml(data.description)}</p>` : ''}
      ${data.buttonText ? `<a href="${escapeHtml(data.buttonUrl ?? '#')}" style="display: inline-block; padding: 14px 32px; border-radius: 8px; ${btnStyle} font-size: 1rem; font-weight: 600; text-decoration: none;">${escapeHtml(data.buttonText)}</a>` : ''}
    </div>
    ${imageHtml}
  </div>
</section>`;
}

function renderGallery(data: BlockData, config: BlockConfig): string {
  const theme = config.theme ?? 'light';
  const layout = config.layout ?? '3col';

  const bgStyle = theme === 'dark' ? 'background: #1a1a2e; color: #eee;' : 'background: #fff; color: #333;';
  const cardBg = theme === 'dark' ? 'background: #2d2d44;' : 'background: #f8f9fa;';

  const cols = layout === '2col' ? 2 : layout === '4col' ? 4 : 3;
  const gridCols = layout === 'masonry' ? 'columns: 3; column-gap: 20px;' : `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 20px;`;

  const items = data.items ?? [];
  const itemsHtml = items.map(item => {
    const imgHtml = item.imageUrl
      ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.text)}" style="width:100%;height:200px;object-fit:cover;" />`
      : `<div style="width:100%;height:200px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;">${item.label ? escapeHtml(item.label) : '🖼️'}</div>`;
    return `<div style="${cardBg} border-radius: 12px; overflow: hidden; ${layout === 'masonry' ? 'margin-bottom:20px;break-inside:avoid;' : ''}">
      ${imgHtml}
      <div style="padding: 16px;">
        <p style="margin: 0; font-weight: 600;">${escapeHtml(item.text)}</p>
        ${item.label ? `<p style="margin: 4px 0 0; opacity: 0.6; font-size: 0.875rem;">${escapeHtml(item.label)}</p>` : ''}
      </div>
    </div>`;
  }).join('');

  return `
<section style="padding: 60px 40px; ${bgStyle}">
  <div style="max-width: 1200px; margin: 0 auto;">
    ${data.title ? `<h2 style="font-size: 2rem; font-weight: 700; margin: 0 0 40px; text-align: center;">${escapeHtml(data.title)}</h2>` : ''}
    <div style="${gridCols}">${itemsHtml}</div>
  </div>
</section>`;
}

function renderFeatures(data: BlockData, config: BlockConfig): string {
  const theme = config.theme ?? 'light';
  const layout = config.layout ?? '3col';

  const bgStyle = theme === 'dark'
    ? 'background: #1a1a2e; color: #eee;'
    : theme === 'blue'
    ? 'background: #e8f4fd; color: #1a1a2e;'
    : 'background: #fff; color: #333;';

  const cardBg = theme === 'dark'
    ? 'background: #2d2d44;'
    : theme === 'blue'
    ? 'background: #fff;'
    : 'background: #f8f9fa;';

  const cols = layout === '2col' ? 2 : 3;

  const items = data.items ?? [];
  const itemsHtml = items.map(item => `
    <div style="${cardBg} padding: 32px; border-radius: 12px; text-align: center;">
      ${item.label ? `<div style="font-size: 2.5rem; margin-bottom: 16px;">${escapeHtml(item.label)}</div>` : ''}
      ${item.value !== undefined && item.value !== '' ? `<div style="font-size: 2rem; font-weight: 800; color: #667eea; margin-bottom: 8px;">${escapeHtml(String(item.value))}</div>` : ''}
      <p style="margin: 0; font-weight: 600; font-size: 1rem;">${escapeHtml(item.text)}</p>
    </div>`).join('');

  return `
<section style="padding: 60px 40px; ${bgStyle}">
  <div style="max-width: 1200px; margin: 0 auto;">
    ${data.title ? `<h2 style="font-size: 2rem; font-weight: 700; margin: 0 0 12px; text-align: center;">${escapeHtml(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p style="font-size: 1.1rem; margin: 0 0 40px; text-align: center; opacity: 0.7;">${escapeHtml(data.subtitle)}</p>` : ''}
    <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 24px;">${itemsHtml}</div>
  </div>
</section>`;
}

function renderText(data: BlockData, _config: BlockConfig): string {
  return `
<section style="padding: 40px; background: #fff; color: #333;">
  <div style="max-width: 800px; margin: 0 auto;">
    ${data.title ? `<h2 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 16px;">${escapeHtml(data.title)}</h2>` : ''}
    ${data.description ? `<p style="font-size: 1rem; line-height: 1.7; margin: 0;">${escapeHtml(data.description)}</p>` : ''}
  </div>
</section>`;
}

function renderMetrics(data: BlockData, config: BlockConfig): string {
  const theme = config.theme ?? 'light';
  const bgStyle = theme === 'dark' ? 'background: #1a1a2e; color: #eee;' : 'background: #f0f4ff; color: #333;';

  const items = data.items ?? [];
  const itemsHtml = items.map(item => `
    <div style="text-align: center; padding: 24px;">
      <div style="font-size: 3rem; font-weight: 900; color: #667eea;">${escapeHtml(String(item.value ?? '0'))}</div>
      <div style="font-size: 1rem; margin-top: 8px; opacity: 0.7;">${escapeHtml(item.text)}</div>
      ${item.label ? `<div style="font-size: 0.875rem; opacity: 0.5;">${escapeHtml(item.label)}</div>` : ''}
    </div>`).join('');

  return `
<section style="padding: 60px 40px; ${bgStyle}">
  <div style="max-width: 1200px; margin: 0 auto;">
    ${data.title ? `<h2 style="font-size: 2rem; font-weight: 700; margin: 0 0 40px; text-align: center;">${escapeHtml(data.title)}</h2>` : ''}
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">${itemsHtml}</div>
  </div>
</section>`;
}

function renderBlock(block: Block): string {
  if (block.config.visible === false) return '';

  let html = '';
  switch (block.type) {
    case 'hero': html = renderHero(block.data, block.config); break;
    case 'gallery': html = renderGallery(block.data, block.config); break;
    case 'features': html = renderFeatures(block.data, block.config); break;
    case 'text': html = renderText(block.data, block.config); break;
    case 'metrics': html = renderMetrics(block.data, block.config); break;
  }

  if (block.children && block.children.length > 0) {
    html += block.children.map(renderBlock).join('');
  }

  return html;
}

export function renderToHtml(blocks: Block[]): string {
  const body = blocks.map(renderBlock).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HTML Weaver Preview</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    a { cursor: pointer; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}
