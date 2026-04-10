'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Layout,
  Type,
  Image,
  BarChart3,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Block, BlockType, ID } from '@/lib/types';
import { getAllBlockTypes, getBlockSchema } from '@/lib/blocks/registry';

interface OutlineTreeProps {
  blocks: Block[];
  selectedId: ID | null;
  expandedIds: ID[];
  onSelect: (id: ID) => void;
  onToggleExpand: (id: ID) => void;
  onAddBlock: (type: BlockType, parentId?: ID) => void;
  onRemoveBlock: (id: ID) => void;
  onMoveBlock: (id: ID, newParentId: ID | undefined, newIndex: number) => void;
  onToggleVisibility: (id: ID) => void;
}

const blockIcons: Record<BlockType, typeof Layout> = {
  hero: Layout,
  features: Layout,
  gallery: Image,
  text: Type,
  stats: BarChart3,
  cta: Layout,
  testimonial: Type,
  footer: Layout,
};

export default function OutlineTree({
  blocks,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
  onAddBlock,
  onRemoveBlock,
  onMoveBlock,
  onToggleVisibility,
}: OutlineTreeProps) {
  const [showAddMenu, setShowAddMenu] = useState<ID | null>(null);

  const renderBlock = (block: Block, depth: number = 0) => {
    const schema = getBlockSchema(block.type);
    const Icon = blockIcons[block.type];
    const isExpanded = expandedIds.includes(block.id);
    const isSelected = selectedId === block.id;
    const hasChildren = block.children && block.children.length > 0;

    return (
      <div key={block.id}>
        <motion.div
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`group flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => onSelect(block.id)}
        >
          {/* Expand/Collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(block.id);
            }}
            className={`w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 ${
              hasChildren ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            )}
          </button>

          {/* Drag Handle */}
          <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab" />

          {/* Icon */}
          <Icon className="w-4 h-4 text-gray-500" />

          {/* Label */}
          <span className="flex-1 text-sm font-medium truncate">
            {block.data.title || schema.name}
          </span>

          {/* Visibility Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(block.id);
            }}
            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 ${
              block.config.visible ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            {block.config.visible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Add Child */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddMenu(showAddMenu === block.id ? null : block.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-500"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Remove */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveBlock(block.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Add Menu */}
        <AnimatePresence>
          {showAddMenu === block.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-8 my-1"
              style={{ marginLeft: `${(depth + 1) * 16 + 12}px` }}
            >
              <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-lg grid grid-cols-2 gap-1">
                {getAllBlockTypes().map((type) => {
                  const typeSchema = getBlockSchema(type);
                  const TypeIcon = blockIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        onAddBlock(type, block.id);
                        setShowAddMenu(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded text-left"
                    >
                      <TypeIcon className="w-4 h-4" />
                      {typeSchema.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {block.children!.map((child) => renderBlock(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            大纲
          </h3>
          <button
            onClick={() => setShowAddMenu(showAddMenu === 'root' ? null : 'root')}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Root Add Menu */}
        <AnimatePresence>
          {showAddMenu === 'root' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg grid grid-cols-2 gap-1"
            >
              {getAllBlockTypes().map((type) => {
                const typeSchema = getBlockSchema(type);
                const TypeIcon = blockIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onAddBlock(type);
                      setShowAddMenu(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded text-left"
                  >
                    <TypeIcon className="w-4 h-4" />
                    {typeSchema.name}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blocks */}
        <div className="space-y-1">
          {blocks.map((block) => renderBlock(block))}
        </div>

        {/* Empty State */}
        {blocks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">点击 + 添加第一个区块</p>
            <p className="text-xs mt-1">或使用 AI 生成完整页面</p>
          </div>
        )}
      </div>
    </div>
  );
}
