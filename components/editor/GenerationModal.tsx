'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, FileText, Layout, Settings } from 'lucide-react';
import { GenerationPrompt } from '@/lib/editor/generator';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: GenerationPrompt) => void;
  isGenerating: boolean;
}

const styles = [
  { id: 'professional', label: '商务', icon: FileText, desc: '简洁、可信、专业' },
  { id: 'creative', label: '创意', icon: Sparkles, desc: '大胆、独特、吸睛' },
  { id: 'minimal', label: '极简', icon: Layout, desc: '干净、克制、优雅' },
  { id: 'bold', label: '醒目', icon: Wand2, desc: '强烈、冲击、记忆' },
] as const;

const purposes = [
  { id: 'landing', label: '落地页', desc: '产品推广、转化导向' },
  { id: 'presentation', label: '汇报', desc: '数据展示、成果汇报' },
  { id: 'portfolio', label: '作品集', desc: '作品展示、个人品牌' },
  { id: 'report', label: '报告', desc: '数据分析、研究总结' },
] as const;

export default function GenerationModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: GenerationModalProps) {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<GenerationPrompt['style']>('professional');
  const [selectedPurpose, setSelectedPurpose] = useState<GenerationPrompt['purpose']>('landing');
  const [step, setStep] = useState<'topic' | 'style' | 'purpose'>('topic');

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    onGenerate({
      topic: topic.trim(),
      style: selectedStyle,
      tone: selectedStyle === 'professional' ? 'formal' : 'casual',
      purpose: selectedPurpose,
    });
  }, [topic, selectedStyle, selectedPurpose, onGenerate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 'topic' && topic.trim()) {
      setStep('style');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">创建新页面</h2>
            <p className="text-white/80 mt-1">告诉我想做什么，AI 帮你生成</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Step 1: Topic */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                你想做什么页面？
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="例如：Q4 季度销售汇报、我的设计作品集、新产品发布页面..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              {step === 'topic' && topic.trim() && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setStep('style')}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  下一步 →
                </motion.button>
              )}
            </div>

            {/* Step 2: Style */}
            {step !== 'topic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  选择风格
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          setSelectedStyle(style.id);
                          setStep('purpose');
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedStyle === style.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-gray-600" />
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{style.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Purpose */}
            {step === 'purpose' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  用途
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {purposes.map((purpose) => (
                    <button
                      key={purpose.id}
                      onClick={() => setSelectedPurpose(purpose.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPurpose === purpose.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{purpose.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{purpose.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            {topic.trim() && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    生成页面
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
