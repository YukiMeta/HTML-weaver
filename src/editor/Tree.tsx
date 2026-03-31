import { useCallback } from 'react';
import type { Block } from '../core/schema';

interface TreeNodeProps {
  block: Block;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

function TreeNode({
  block,
  depth,
  selectedId,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleCollapse,
  isFirst,
  isLast,
}: TreeNodeProps) {
  const hasChildren = (block.children ?? []).length > 0;
  const isSelected = selectedId === block.id;
  const label = (block.data.title ?? block.type).slice(0, 30);

  return (
    <div className="tree-node" style={{ paddingLeft: depth > 0 ? 0 : undefined }}>
      <div
        className={`tree-node-row${isSelected ? ' selected' : ''}`}
        onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect(block.id);
        }}
      >
        <button
          className={`tree-toggle${hasChildren ? '' : ' invisible'}`}
          onClick={(e) => { e.stopPropagation(); onToggleCollapse(block.id); }}
          tabIndex={-1}
          aria-label={block.collapsed ? 'Expand' : 'Collapse'}
        >
          {hasChildren ? (block.collapsed ? '▶' : '▼') : '▶'}
        </button>
        <span className={`block-badge ${block.type}`}>{block.type}</span>
        <span className="tree-node-label" title={label}>{label}</span>
        <div className="tree-node-actions">
          {!isFirst && (
            <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); onMoveUp(block.id); }} title="Move up" tabIndex={-1}>↑</button>
          )}
          {!isLast && (
            <button className="tree-action-btn" onClick={(e) => { e.stopPropagation(); onMoveDown(block.id); }} title="Move down" tabIndex={-1}>↓</button>
          )}
          <button className="tree-action-btn danger" onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} title="Delete" tabIndex={-1}>✕</button>
        </div>
      </div>
      {hasChildren && !block.collapsed && (
        <div className="tree-children">
          {(block.children ?? []).map((child, idx) => (
            <TreeNode
              key={child.id}
              block={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onToggleCollapse={onToggleCollapse}
              isFirst={idx === 0}
              isLast={idx === (block.children ?? []).length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeProps {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onToggleCollapse: (id: string) => void;
}

export function Tree({
  blocks,
  selectedId,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleCollapse,
}: TreeProps) {
  const renderNodes = useCallback(() =>
    blocks.map((block, idx) => (
      <TreeNode
        key={block.id}
        block={block}
        depth={0}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onToggleCollapse={onToggleCollapse}
        isFirst={idx === 0}
        isLast={idx === blocks.length - 1}
      />
    )), [blocks, selectedId, onSelect, onDelete, onMoveUp, onMoveDown, onToggleCollapse]);

  if (blocks.length === 0) {
    return (
      <div style={{ padding: '16px', color: '#585b70', fontSize: '0.8rem', textAlign: 'center' }}>
        No blocks yet. Add a block to get started.
      </div>
    );
  }

  return <div role="tree">{renderNodes()}</div>;
}

export default Tree;
