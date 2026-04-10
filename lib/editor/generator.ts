/**
 * AI Page Generator
 * Jobs Philosophy: User inputs topic, AI creates the page
 * No editing first. Generate first, then refine.
 */

import { Document, Block, BlockType, PageConfig, ID } from '../types';
import { getBlockSchema } from '../blocks/registry';

export interface GenerationPrompt {
  topic: string;
  style: 'professional' | 'creative' | 'minimal' | 'bold';
  tone: 'formal' | 'casual' | 'enthusiastic';
  purpose: 'landing' | 'presentation' | 'portfolio' | 'report';
}

export interface GeneratedPage {
  document: Document;
  suggestions: string[];
}

// Mock AI Generation - In production, this calls Claude API
export async function generatePage(prompt: GenerationPrompt): Promise<GeneratedPage> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  const documentId = generateId();
  const configId = generateId();

  const config: PageConfig = {
    id: configId,
    title: prompt.topic,
    description: `AI-generated ${prompt.purpose} page`,
    meta: {
      author: 'HTML-Weaver AI',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      tags: [prompt.style, prompt.tone, prompt.purpose],
    },
    theme: getThemeForStyle(prompt.style),
    layout: 'flow',
    shareFormat: 'web',
  };

  // AI generates appropriate blocks based on purpose
  const blocks = generateBlocksForPurpose(prompt);

  const document: Document = {
    id: documentId,
    config,
    blocks,
    history: [],
  };

  return {
    document,
    suggestions: generateSuggestions(prompt, blocks),
  };
}

// Generate appropriate block structure based on purpose
function generateBlocksForPurpose(prompt: GenerationPrompt): Block[] {
  const blocks: Block[] = [];

  switch (prompt.purpose) {
    case 'landing':
      blocks.push(
        createBlock('hero', {
          title: prompt.topic,
          subtitle: `The best solution for ${prompt.topic.toLowerCase()}`,
          description: 'Discover why thousands trust our platform.',
        }),
        createBlock('stats', {
          title: 'Trusted by Industry Leaders',
        }),
        createBlock('features', {
          title: 'Everything you need',
        }),
        createBlock('cta', {
          title: 'Ready to get started?',
        })
      );
      break;

    case 'presentation':
      blocks.push(
        createBlock('hero', {
          title: prompt.topic,
          subtitle: 'Quarterly Review 2025',
        }),
        createBlock('stats', {
          title: 'Key Metrics',
        }),
        createBlock('gallery', {
          title: 'Highlights',
        }),
        createBlock('text', {
          title: 'Looking Ahead',
        })
      );
      break;

    case 'portfolio':
      blocks.push(
        createBlock('hero', {
          title: prompt.topic,
          subtitle: 'Creative Portfolio',
        }),
        createBlock('gallery', {
          title: 'Selected Works',
        }),
        createBlock('text', {
          title: 'About',
        })
      );
      break;

    case 'report':
      blocks.push(
        createBlock('hero', {
          title: prompt.topic,
          subtitle: 'Executive Summary',
        }),
        createBlock('stats', {
          title: 'Performance Overview',
        }),
        createBlock('features', {
          title: 'Key Findings',
        }),
        createBlock('text', {
          title: 'Recommendations',
        })
      );
      break;

    default:
      blocks.push(
        createBlock('hero', { title: prompt.topic }),
        createBlock('text', { title: 'About' })
      );
  }

  return blocks;
}

// Helper: Create a block with data
function createBlock(type: BlockType, data: Partial<Block['data']> = {}): Block {
  const schema = getBlockSchema(type);
  const id = generateId();

  return {
    id,
    type,
    order: 0,
    config: {
      layout: schema.defaultConfig.layout || 'full',
      theme: schema.defaultConfig.theme || 'default',
      visible: true,
      spacing: schema.defaultConfig.spacing || 'normal',
      animation: schema.defaultConfig.animation || 'none',
    },
    data: {
      ...schema.defaultData,
      ...data,
    },
  };
}

// Helper: Get theme based on style
function getThemeForStyle(style: GenerationPrompt['style']) {
  const themes = {
    professional: {
      id: 'professional',
      name: 'Professional',
      colors: {
        primary: '#1e3a5f',
        secondary: '#64748b',
        background: '#ffffff',
        text: '#1e293b',
        accent: '#3b82f6',
      },
      fonts: { heading: 'Inter', body: 'Inter' },
      spacing: { section: '6rem', content: '1.5rem' },
    },
    creative: {
      id: 'creative',
      name: 'Creative',
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        background: '#faf5ff',
        text: '#1e1b4b',
        accent: '#f59e0b',
      },
      fonts: { heading: 'Poppins', body: 'Inter' },
      spacing: { section: '8rem', content: '2rem' },
    },
    minimal: {
      id: 'minimal',
      name: 'Minimal',
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        background: '#ffffff',
        text: '#111827',
        accent: '#000000',
      },
      fonts: { heading: 'system-ui', body: 'system-ui' },
      spacing: { section: '4rem', content: '1rem' },
    },
    bold: {
      id: 'bold',
      name: 'Bold',
      colors: {
        primary: '#dc2626',
        secondary: '#1f2937',
        background: '#111827',
        text: '#ffffff',
        accent: '#fbbf24',
      },
      fonts: { heading: 'Montserrat', body: 'Inter' },
      spacing: { section: '8rem', content: '2rem' },
    },
  };

  return themes[style];
}

// Generate AI suggestions for improvement
function generateSuggestions(prompt: GenerationPrompt, blocks: Block[]): string[] {
  const suggestions: string[] = [];

  if (blocks.length < 3) {
    suggestions.push('Add a gallery section to showcase visuals');
  }

  if (!blocks.some(b => b.type === 'stats')) {
    suggestions.push('Include statistics to build credibility');
  }

  if (prompt.purpose === 'landing' && !blocks.some(b => b.type === 'cta')) {
    suggestions.push('Add a clear call-to-action');
  }

  suggestions.push('Click any text to edit it directly');
  suggestions.push('Try different themes in the style panel');

  return suggestions;
}

// Utility: Generate unique ID
function generateId(): ID {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
