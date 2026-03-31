import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Tree } from './editor/Tree';
import { BlockPanel } from './editor/BlockPanel';
import { Preview } from './editor/Preview';
import type { Block, BlockType, BlockData, BlockConfig } from './core/schema';
import * as HeroDef from './core/blocks/Hero';
import * as GalleryDef from './core/blocks/Gallery';
import * as FeaturesDef from './core/blocks/Features';
import { templates } from './templates/index';
import type { Template } from './templates/index';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const BLOCK_TYPES: { type: BlockType; label: string; color: string }[] = [
  { type: 'hero', label: 'Hero', color: '#9d4edd' },
  { type: 'gallery', label: 'Gallery', color: '#2196f3' },
  { type: 'features', label: 'Features', color: '#0ea5e9' },
  { type: 'text', label: 'Text', color: '#6c7068' },
  { type: 'metrics', label: 'Metrics', color: '#f59e0b' },
];

function createBlock(type: BlockType): Block {
  switch (type) {
    case 'hero':
      return { id: uid(), type, config: { ...HeroDef.defaultConfig }, data: { ...HeroDef.defaultData } };
    case 'gallery':
      return { id: uid(), type, config: { ...GalleryDef.defaultConfig }, data: { ...GalleryDef.defaultData } };
    case 'features':
      return { id: uid(), type, config: { ...FeaturesDef.defaultConfig }, data: { ...FeaturesDef.defaultData } };
    case 'text':
      return { id: uid(), type, config: { visible: true }, data: { title: 'Text Block', description: 'Your content here.' } };
    case 'metrics':
      return { id: uid(), type, config: { theme: 'light', visible: true }, data: { title: 'Metrics', items: [{ text: 'Metric', value: '100', label: '' }] } };
  }
}

function updateBlockInTree(blocks: Block[], id: string, updater: (b: Block) => Block): Block[] {
  return blocks.map(block => {
    if (block.id === id) return updater(block);
    if (block.children && block.children.length > 0) {
      return { ...block, children: updateBlockInTree(block.children, id, updater) };
    }
    return block;
  });
}

function deleteBlockInTree(blocks: Block[], id: string): Block[] {
  return blocks
    .filter(b => b.id !== id)
    .map(b => b.children && b.children.length > 0
      ? { ...b, children: deleteBlockInTree(b.children, id) }
      : b
    );
}

function moveBlock(blocks: Block[], id: string, direction: 'up' | 'down'): Block[] {
  const idx = blocks.findIndex(b => b.id === id);
  if (idx === -1) {
    return blocks.map(b => b.children && b.children.length > 0
      ? { ...b, children: moveBlock(b.children, id, direction) }
      : b
    );
  }
  const newBlocks = [...blocks];
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= newBlocks.length) return blocks;
  [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
  return newBlocks;
}

function findBlockById(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children) {
      const found = findBlockById(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

interface TemplateModalProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

function TemplateModal({ onSelect, onClose }: TemplateModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Choose a Template</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="template-grid">
          {templates.map(t => (
            <button key={t.id} className="template-card" onClick={() => { onSelect(t); onClose(); }}>
              <div className="template-color" style={{ background: t.color }} />
              <div className="template-info">
                <p className="template-name">{t.name}</p>
                <p className="template-desc">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const selectedBlock = selectedId ? findBlockById(blocks, selectedId) : null;

  const handleAddBlock = useCallback((type: BlockType) => {
    const block = createBlock(type);
    setBlocks(prev => [...prev, block]);
    setSelectedId(block.id);
    setShowDropdown(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setBlocks(prev => deleteBlockInTree(prev, id));
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  const handleMoveUp = useCallback((id: string) => {
    setBlocks(prev => moveBlock(prev, id, 'up'));
  }, []);

  const handleMoveDown = useCallback((id: string) => {
    setBlocks(prev => moveBlock(prev, id, 'down'));
  }, []);

  const handleToggleCollapse = useCallback((id: string) => {
    setBlocks(prev => updateBlockInTree(prev, id, b => ({ ...b, collapsed: !b.collapsed })));
  }, []);

  const handleUpdate = useCallback((id: string, data: Partial<BlockData>, config: Partial<BlockConfig>) => {
    setBlocks(prev => updateBlockInTree(prev, id, b => ({
      ...b,
      data: { ...b.data, ...data },
      config: { ...b.config, ...config },
    })));
  }, []);

  const handleTemplateSelect = useCallback((template: Template) => {
    const newBlocks = template.blocks.map(b => ({ ...b, id: uid() }));
    setBlocks(newBlocks);
    setSelectedId(null);
  }, []);

  const handleClear = useCallback(() => {
    setBlocks([]);
    setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    function handle() { setShowDropdown(false); }
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, [showDropdown]);

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🧶 HTML Weaver</span>
        <div className="header-actions">
          <button className="header-btn" onClick={() => setShowTemplates(true)}>Templates</button>
          <button className="header-btn" onClick={handleClear}>Clear</button>
        </div>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-toolbar">
            <div className="add-block-wrapper">
              <button
                className="sidebar-btn"
                onClick={e => { e.stopPropagation(); setShowDropdown(v => !v); }}
              >
                + Add Block
              </button>
              {showDropdown && (
                <div className="add-block-dropdown" onClick={e => e.stopPropagation()}>
                  {BLOCK_TYPES.map(bt => (
                    <button
                      key={bt.type}
                      className="dropdown-item"
                      onClick={() => handleAddBlock(bt.type)}
                    >
                      <span className="block-badge-sm" style={{ background: bt.color }} />
                      {bt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="tree-scroll">
            <Tree
              blocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onToggleCollapse={handleToggleCollapse}
            />
          </div>
        </aside>

        <Preview blocks={blocks} />

        <BlockPanel
          block={selectedBlock ?? null}
          onUpdate={handleUpdate}
        />
      </div>

      {showTemplates && (
        <TemplateModal
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default App;
