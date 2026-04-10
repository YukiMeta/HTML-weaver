'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Palette,
  Layout,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Block, BlockConfig, BlockData } from '@/lib/types';
import { getBlockSchema, BlockSchema } from '@/lib/blocks/registry';

interface ConfigPanelProps {
  block: Block | null;
  onUpdateConfig: (config: Partial<BlockConfig>) => void;
  onUpdateData: (data: Partial<BlockData>) => void;
}

export default function ConfigPanel({
  block,
  onUpdateConfig,
  onUpdateData,
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content');
  const [expandedSections, setExpandedSections] = useState<string[]>(['content']);

  if (!block) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">选择左侧大纲中的区块</p>
          <p className="text-xs mt-1">进行配置和编辑</p>
        </div>
      </div>
    );
  }

  const schema = getBlockSchema(block.type);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{schema.name}</h3>
          <p className="text-sm text-gray-500">{schema.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {[
            { id: 'content', label: '内容', icon: Type },
            { id: 'style', label: '样式', icon: Palette },
            { id: 'layout', label: '布局', icon: Layout },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {schema.dataSchema.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={(block.data[field.key] as string) || ''}
                    onChange={(e) =>
                      onUpdateData({ [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={(block.data[field.key] as string) || ''}
                    onChange={(e) =>
                      onUpdateData({ [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                )}

                {field.type === 'rich-text' && (
                  <textarea
                    value={(block.data[field.key] as string) || ''}
                    onChange={(e) =>
                      onUpdateData({ [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
                  />
                )}

                {field.type === 'image' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">点击上传图片</p>
                    <p className="text-xs text-gray-400 mt-1">或拖拽到这里</p>
                  </div>
                )}
              </div>
            ))}

            {/* AI Assist */}
            <div className="pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                <Sparkles className="w-4 h-4" />
                AI 优化这段内容
              </button>
            </div>
          </motion.div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                主题色
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'default', color: '#3b82f6', name: '默认' },
                  { id: 'warm', color: '#f59e0b', name: '暖色' },
                  { id: 'cool', color: '#06b6d4', name: '冷色' },
                  { id: 'dark', color: '#1f2937', name: '深色' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateConfig({ theme: theme.id })}
                    className={`p-2 rounded-lg border-2 text-center ${
                      block.config.theme === theme.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-xs">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                动画效果
              </label>
              <select
                value={block.config.animation}
                onChange={(e) =>
                  onUpdateConfig({ animation: e.target.value as BlockConfig['animation'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">无</option>
                <option value="fade">淡入</option>
                <option value="slide">滑入</option>
                <option value="zoom">缩放</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Layout Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                布局
              </label>
              <div className="grid grid-cols-2 gap-2">
                {schema.configSchema
                  .find((s) => s.key === 'layout')
                  ?.options?.map((layout) => (
                    <button
                      key={layout}
                      onClick={() => onUpdateConfig({ layout: layout as BlockConfig['layout'] })}
                      className={`p-3 rounded-lg border-2 text-sm text-left ${
                        block.config.layout === layout
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {layout === 'full' && '全宽'}
                      {layout === 'split' && '分栏'}
                      {layout === 'centered' && '居中'}
                      {layout === 'grid-2' && '两列网格'}
                      {layout === 'grid-3' && '三列网格'}
                      {layout === 'carousel' && '轮播'}
                    </button>
                  ))}
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                间距
              </label>
              <div className="flex gap-2">
                {(['compact', 'normal', 'loose'] as const).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => onUpdateConfig({ spacing })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm ${
                      block.config.spacing === spacing
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {spacing === 'compact' && '紧凑'}
                    {spacing === 'normal' && '正常'}
                    {spacing === 'loose' && '宽松'}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">显示区块</span>
              </div>
              <button
                onClick={() => onUpdateConfig({ visible: !block.config.visible })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  block.config.visible ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    block.config.visible ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
