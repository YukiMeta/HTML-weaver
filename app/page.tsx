'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layout,
  Settings,
  Undo,
  Redo,
  Download,
  Save,
  ChevronDown,
  FileText,
  Printer,
  Share2,
} from 'lucide-react';
import { useEditorState, useSelectedBlock } from '@/lib/editor/state';
import { generatePage, GenerationPrompt } from '@/lib/editor/generator';
import { getExperienceConfig, UserLevel } from '@/lib/editor/progressive';
import GenerationModal from '@/components/editor/GenerationModal';
import OutlineTree from '@/components/editor/OutlineTree';
import ConfigPanel from '@/components/editor/ConfigPanel';
import Preview from '@/components/editor/Preview';

export default function EditorPage() {
  // State
  const { state, dispatch } = useEditorState();
  const selectedBlock = useSelectedBlock(state);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevel>('advanced');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const experience = getExperienceConfig(userLevel);

  // Handlers
  const handleGenerate = useCallback(
    async (prompt: GenerationPrompt) => {
      setIsGenerating(true);
      try {
        const result = await generatePage(prompt);
        dispatch({ type: 'IMPORT_DOCUMENT', payload: result.document });
        setShowGenerationModal(false);
      } finally {
        setIsGenerating(false);
      }
    },
    [dispatch]
  );

  const handleExport = useCallback(() => {
    const html = generateExportHTML(state.document);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.document.config.title || 'page'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [state.document]);

  // Generate simple HTML export
  function generateExportHTML(document: typeof state.document): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.config.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="max-w-5xl mx-auto px-4 py-16">
    ${document.blocks
      .filter((b) => b.config.visible)
      .map(
        (block) => `
      <div class="py-12">
        ${block.data.title ? `<h2 class="text-3xl font-bold mb-4">${block.data.title}</h2>` : ''}
        ${block.data.subtitle ? `<p class="text-xl text-gray-600 mb-8">${block.data.subtitle}</p>` : ''}
        ${block.data.description ? `<p class="text-gray-700">${block.data.description}</p>` : ''}
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowGenerationModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">HTML-Weaver</span>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          {/* Document Title */}
          <input
            type="text"
            value={state.document.config.title}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_PAGE_CONFIG',
                payload: { title: e.target.value },
              })
            }
            className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 w-64"
          />

          {/* Level Selector */}
          <select
            value={userLevel}
            onChange={(e) => setUserLevel(e.target.value as UserLevel)}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            <option value="beginner">入门模式</option>
            <option value="advanced">高级模式</option>
            <option value="pro">专业模式</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generate Button */}
          <button
            onClick={() => setShowGenerationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            AI 生成
            <span className="text-xs opacity-70">⌘N</span>
          </button>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.undoStack.length === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.redoStack.length === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Save Status */}
          <div
            className={`text-xs ${state.isDirty ? 'text-amber-600' : 'text-green-600'}`}
          >
            {state.isDirty ? '未保存' : '已保存'}
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
              导出
              <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4" />
                    导出 HTML
                  </button>
                  {experience.features.printMode && (
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Printer className="w-4 h-4" />
                      打印 / PDF
                    </button>
                  )}
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Share2 className="w-4 h-4" />
                    分享链接
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Outline Tree */}
        {experience.ui.showTreeByDefault && (
          <div className="w-72 bg-white border-r border-gray-200 flex-shrink-0">
            <OutlineTree
              blocks={state.document.blocks}
              selectedId={state.selectedBlockId}
              expandedIds={state.expandedBlockIds}
              onSelect={(id) => dispatch({ type: 'SELECT_BLOCK', payload: id })}
              onToggleExpand={(id) => {
                // Handle expand/collapse
              }}
              onAddBlock={(type, parentId) =>
                dispatch({ type: 'ADD_BLOCK', payload: { type, parentId } })
              }
              onRemoveBlock={(id) => dispatch({ type: 'REMOVE_BLOCK', payload: id })}
              onMoveBlock={(id, newParentId, newIndex) =>
                dispatch({ type: 'MOVE_BLOCK', payload: { id, newParentId, newIndex } })
              }
              onToggleVisibility={(id) =>
                dispatch({
                  type: 'UPDATE_BLOCK_CONFIG',
                  payload: { id, config: { visible: !selectedBlock?.config.visible } },
                })
              }
            />
          </div>
        )}

        {/* Center - Preview */}
        <div className="flex-1 bg-gray-100">
          <Preview
            document={state.document}
            onBlockClick={(id) => dispatch({ type: 'SELECT_BLOCK', payload: id })}
            selectedBlockId={state.selectedBlockId}
          />
        </div>

        {/* Right Sidebar - Config Panel */}
        {experience.ui.showConfigPanel && (
          <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
            <ConfigPanel
              block={selectedBlock}
              onUpdateConfig={(config) => {
                if (selectedBlock) {
                  dispatch({
                    type: 'UPDATE_BLOCK_CONFIG',
                    payload: { id: selectedBlock.id, config },
                  });
                }
              }}
              onUpdateData={(data) => {
                if (selectedBlock) {
                  dispatch({
                    type: 'UPDATE_BLOCK_DATA',
                    payload: { id: selectedBlock.id, data },
                  });
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Generation Modal */}
      <GenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
