'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Block, Document } from '@/lib/types';
import { getBlockSchema } from '@/lib/blocks/registry';

interface PreviewProps {
  document: Document;
  onBlockClick?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

// Simple block renderer for preview
function BlockPreview({
  block,
  isSelected,
  onClick,
}: {
  block: Block;
  isSelected: boolean;
  onClick?: () => void;
}) {
  const schema = getBlockSchema(block.type);

  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: block.config.animation === 'slide' ? 30 : 0,
      scale: block.config.animation === 'zoom' ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: block.config.animation === 'none' ? 0 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Spacing classes
  const spacingClasses = {
    compact: 'py-8',
    normal: 'py-16',
    loose: 'py-24',
  };

  if (!block.config.visible) return null;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      className={`relative ${spacingClasses[block.config.spacing]} px-8 transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
      } ${onClick ? 'cursor-pointer hover:bg-gray-50/50' : ''}`}
      style={{
        backgroundColor: block.config.theme === 'dark' ? '#1f2937' : 'transparent',
      }}
    >
      {/* Block Type Label (only in edit mode) */}
      {onClick && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-900/10 text-xs text-gray-500 rounded opacity-0 hover:opacity-100 transition-opacity">
          {schema.name}
        </div>
      )}

      {/* Block Content */}
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        {block.type === 'hero' && (
          <div
            className={`text-center ${
              block.config.layout === 'split' ? 'md:text-left md:grid md:grid-cols-2 md:gap-12 items-center' : ''
            }`}
          >
            <div>
              {block.data.title && (
                <h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{
                    color: block.config.theme === 'dark' ? '#fff' : '#111',
                  }}
                >
                  {block.data.title}
                </h1>
              )}
              {block.data.subtitle && (
                <p
                  className="text-xl md:text-2xl mb-6"
                  style={{
                    color: block.config.theme === 'dark' ? '#9ca3af' : '#6b7280',
                  }}
                >
                  {block.data.subtitle}
                </p>
              )}
              {block.data.description && (
                <p
                  className="text-base mb-8 max-w-2xl mx-auto"
                  style={{
                    color: block.config.theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  {block.data.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {block.type === 'features' && (
          <div>
            {block.data.title && (
              <h2 className="text-3xl font-bold text-center mb-4">{block.data.title}</h2>
            )}
            {block.data.description && (
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                {block.data.description}
              </p>
            )}
            <div
              className={`grid gap-6 ${
                block.config.layout === 'grid-2'
                  ? 'md:grid-cols-2'
                  : block.config.layout === 'grid-3'
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-3'
              }`}
            >
              {block.data.items?.map((item, index) => (
                <div key={item.id || index} className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {block.type === 'stats' && (
          <div>
            {block.data.title && (
              <h2 className="text-3xl font-bold text-center mb-12">{block.data.title}</h2>
            )}
            <div
              className={`grid gap-8 ${
                block.config.layout === 'grid-2'
                  ? 'md:grid-cols-2'
                  : block.config.layout === 'grid-4'
                  ? 'md:grid-cols-4'
                  : 'md:grid-cols-4'
              }`}
            >
              {block.data.stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text */}
        {block.type === 'text' && (
          <div className={`${block.config.layout === 'centered' ? 'text-center max-w-3xl mx-auto' : ''}`}>
            {block.data.title && (
              <h2 className="text-3xl font-bold mb-4">{block.data.title}</h2>
            )}
            {block.data.description && (
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                {block.data.description}
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        {block.type === 'gallery' && (
          <div>
            {block.data.title && (
              <h2 className="text-3xl font-bold text-center mb-8">{block.data.title}</h2>
            )}
            <div
              className={`grid gap-4 ${
                block.config.layout === 'grid-2'
                  ? 'md:grid-cols-2'
                  : block.config.layout === 'grid-3'
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-3'
              }`}
            >
              {block.data.images?.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">图片 {index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
              {(!block.data.images || block.data.images.length === 0) && (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-400">图片占位 {i}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Preview({
  document,
  onBlockClick,
  selectedBlockId,
}: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll selected block into view
  useEffect(() => {
    if (selectedBlockId && containerRef.current) {
      const element = containerRef.current.querySelector(
        `[data-block-id="${selectedBlockId}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedBlockId]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto bg-white"
      style={{ fontFamily: document.config.theme.fonts.body }}
    >
      {/* Page Header */}
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <div>
          <h1 className="text-lg font-semibold">{document.config.title}</h1>
          <p className="text-sm text-gray-500">{document.config.description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>v{document.config.meta.version}</span>
          <span>·</span>
          <span>{document.blocks.length} 区块</span>
        </div>
      </div>

      {/* Blocks */}
      <div className="divide-y divide-gray-100">
        {document.blocks.map((block) => (
          <div key={block.id} data-block-id={block.id}>
            <BlockPreview
              block={block}
              isSelected={selectedBlockId === block.id}
              onClick={onBlockClick ? () => onBlockClick(block.id) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {document.blocks.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">页面为空</p>
            <p className="text-sm">点击左上角的 + 或 AI 生成来创建内容</p>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <div className="border-t border-gray-200 px-8 py-6 text-center text-sm text-gray-400">
        使用 HTML-Weaver 生成
      </div>
    </div>
  );
}
