/**
 * Document State Management
 * Production-grade state management with undo/redo, versioning, and persistence
 */

'use client';

import { useCallback, useReducer, useEffect } from 'react';
import {
  Block,
  BlockType,
  Document,
  EditorState,
  PageConfig,
  ID,
  Version,
} from '../types';
import { getBlockSchema } from '../blocks/registry';

// Action Types
export type EditorAction =
  | { type: 'SELECT_BLOCK'; payload: ID | null }
  | { type: 'EXPAND_BLOCK'; payload: ID }
  | { type: 'COLLAPSE_BLOCK'; payload: ID }
  | { type: 'ADD_BLOCK'; payload: { type: BlockType; parentId?: ID; index?: number } }
  | { type: 'REMOVE_BLOCK'; payload: ID }
  | { type: 'MOVE_BLOCK'; payload: { id: ID; newParentId?: ID; newIndex: number } }
  | { type: 'UPDATE_BLOCK_CONFIG'; payload: { id: ID; config: Partial<Block['config']> } }
  | { type: 'UPDATE_BLOCK_DATA'; payload: { id: ID; data: Partial<Block['data']> } }
  | { type: 'UPDATE_PAGE_CONFIG'; payload: Partial<PageConfig> }
  | { type: 'SET_PREVIEW_MODE'; payload: 'flow' | 'fixed' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_VERSION'; payload: { description: string } }
  | { type: 'LOAD_VERSION'; payload: ID }
  | { type: 'IMPORT_DOCUMENT'; payload: Document }
  | { type: 'RESET_DOCUMENT' };

// Utility: Generate ID
function generateId(): ID {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Utility: Create empty block
function createBlock(type: BlockType, parentId?: ID): Block {
  const schema = getBlockSchema(type);
  return {
    id: generateId(),
    type,
    parentId,
    order: 0,
    config: {
      layout: schema.defaultConfig.layout || 'full',
      theme: schema.defaultConfig.theme || 'default',
      visible: schema.defaultConfig.visible ?? true,
      spacing: schema.defaultConfig.spacing || 'normal',
      animation: schema.defaultConfig.animation || 'none',
    },
    data: schema.defaultData || {},
    children: [],
  };
}

// Initial State
function createInitialDocument(): Document {
  return {
    id: generateId(),
    config: {
      id: generateId(),
      title: 'Untitled Document',
      description: '',
      meta: {
        author: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: [],
      },
      theme: {
        id: 'default',
        name: 'Default',
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          background: '#ffffff',
          text: '#1e293b',
          accent: '#8b5cf6',
        },
        fonts: {
          heading: 'system-ui',
          body: 'system-ui',
        },
        spacing: {
          section: '6rem',
          content: '1.5rem',
        },
      },
      layout: 'flow',
      shareFormat: 'web',
    },
    blocks: [],
    history: [],
  };
}

const initialState: EditorState = {
  document: createInitialDocument(),
  selectedBlockId: null,
  expandedBlockIds: [],
  previewMode: 'flow',
  isDirty: false,
  undoStack: [],
  redoStack: [],
};

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload };

    case 'EXPAND_BLOCK':
      return {
        ...state,
        expandedBlockIds: [...state.expandedBlockIds, action.payload],
      };

    case 'COLLAPSE_BLOCK':
      return {
        ...state,
        expandedBlockIds: state.expandedBlockIds.filter((id) => id !== action.payload),
      };

    case 'ADD_BLOCK': {
      const newBlock = createBlock(action.payload.type, action.payload.parentId);
      const newBlocks = [...state.document.blocks];

      if (action.payload.parentId) {
        // Add as child
        const parentIndex = newBlocks.findIndex((b) => b.id === action.payload.parentId);
        if (parentIndex >= 0) {
          newBlocks[parentIndex].children = [
            ...(newBlocks[parentIndex].children || []),
            newBlock,
          ];
        }
      } else {
        // Add at root level
        const insertIndex = action.payload.index ?? newBlocks.length;
        newBlocks.splice(insertIndex, 0, newBlock);
      }

      return {
        ...state,
        document: {
          ...state.document,
          blocks: newBlocks,
          config: {
            ...state.document.config,
            meta: {
              ...state.document.config.meta,
              updatedAt: new Date(),
            },
          },
        },
        selectedBlockId: newBlock.id,
        isDirty: true,
        undoStack: [...state.undoStack, state.document],
        redoStack: [],
      };
    }

    case 'REMOVE_BLOCK': {
      const removeBlockRecursive = (blocks: Block[]): Block[] => {
        return blocks
          .filter((b) => b.id !== action.payload)
          .map((b) => ({
            ...b,
            children: b.children ? removeBlockRecursive(b.children) : undefined,
          }));
      };

      return {
        ...state,
        document: {
          ...state.document,
          blocks: removeBlockRecursive(state.document.blocks),
        },
        selectedBlockId: null,
        isDirty: true,
        undoStack: [...state.undoStack, state.document],
        redoStack: [],
      };
    }

    case 'MOVE_BLOCK': {
      // Implementation for drag-and-drop reordering
      const { id, newParentId, newIndex } = action.payload;

      // Find and remove block from current position
      let movedBlock: Block | null = null;
      const removeBlock = (blocks: Block[]): Block[] => {
        return blocks
          .map((b) => {
            if (b.id === id) {
              movedBlock = b;
              return null;
            }
            if (b.children) {
              return { ...b, children: removeBlock(b.children) };
            }
            return b;
          })
          .filter((b): b is Block => b !== null);
      };

      const newBlocks = removeBlock(state.document.blocks);

      // Insert block at new position
      const insertBlock = (blocks: Block[]): Block[] => {
        if (!newParentId) {
          // Insert at root level
          const result = [...blocks];
          if (movedBlock) {
            result.splice(newIndex, 0, { ...movedBlock, parentId: undefined });
          }
          return result;
        }

        return blocks.map((b) => {
          if (b.id === newParentId) {
            const children = [...(b.children || [])];
            if (movedBlock) {
              children.splice(newIndex, 0, { ...movedBlock, parentId: newParentId });
            }
            return { ...b, children };
          }
          if (b.children) {
            return { ...b, children: insertBlock(b.children) };
          }
          return b;
        });
      };

      return {
        ...state,
        document: {
          ...state.document,
          blocks: insertBlock(newBlocks),
        },
        isDirty: true,
        undoStack: [...state.undoStack, state.document],
        redoStack: [],
      };
    }

    case 'UPDATE_BLOCK_CONFIG': {
      const updateBlockConfig = (blocks: Block[]): Block[] => {
        return blocks.map((b) => {
          if (b.id === action.payload.id) {
            return { ...b, config: { ...b.config, ...action.payload.config } };
          }
          if (b.children) {
            return { ...b, children: updateBlockConfig(b.children) };
          }
          return b;
        });
      };

      return {
        ...state,
        document: {
          ...state.document,
          blocks: updateBlockConfig(state.document.blocks),
          config: {
            ...state.document.config,
            meta: {
              ...state.document.config.meta,
              updatedAt: new Date(),
            },
          },
        },
        isDirty: true,
      };
    }

    case 'UPDATE_BLOCK_DATA': {
      const updateBlockData = (blocks: Block[]): Block[] => {
        return blocks.map((b) => {
          if (b.id === action.payload.id) {
            return { ...b, data: { ...b.data, ...action.payload.data } };
          }
          if (b.children) {
            return { ...b, children: updateBlockData(b.children) };
          }
          return b;
        });
      };

      return {
        ...state,
        document: {
          ...state.document,
          blocks: updateBlockData(state.document.blocks),
          config: {
            ...state.document.config,
            meta: {
              ...state.document.config.meta,
              updatedAt: new Date(),
            },
          },
        },
        isDirty: true,
      };
    }

    case 'UPDATE_PAGE_CONFIG':
      return {
        ...state,
        document: {
          ...state.document,
          config: { ...state.document.config, ...action.payload },
        },
        isDirty: true,
        undoStack: [...state.undoStack, state.document],
        redoStack: [],
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload,
        document: {
          ...state.document,
          config: { ...state.document.config, layout: action.payload },
        },
      };

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const previousDocument = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        document: previousDocument,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [state.document, ...state.redoStack],
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const nextDocument = state.redoStack[0];
      return {
        ...state,
        document: nextDocument,
        undoStack: [...state.undoStack, state.document],
        redoStack: state.redoStack.slice(1),
      };
    }

    case 'SAVE_VERSION': {
      const newVersion: Version = {
        id: generateId(),
        timestamp: new Date(),
        description: action.payload.description,
        blocks: [...state.document.blocks],
        config: { ...state.document.config },
      };

      return {
        ...state,
        document: {
          ...state.document,
          history: [...state.document.history, newVersion],
          config: {
            ...state.document.config,
            meta: {
              ...state.document.config.meta,
              version: state.document.config.meta.version + 1,
              updatedAt: new Date(),
            },
          },
        },
        isDirty: false,
      };
    }

    case 'LOAD_VERSION': {
      const version = state.document.history.find((v) => v.id === action.payload);
      if (!version) return state;

      return {
        ...state,
        document: {
          ...state.document,
          blocks: [...version.blocks],
          config: { ...version.config },
        },
        undoStack: [],
        redoStack: [],
        isDirty: true,
      };
    }

    case 'IMPORT_DOCUMENT':
      return {
        ...initialState,
        document: action.payload,
        isDirty: true,
      };

    case 'RESET_DOCUMENT':
      return {
        ...initialState,
        document: createInitialDocument(),
      };

    default:
      return state;
  }
}

// Custom Hook for Editor State
export function useEditorState() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    if (state.isDirty) {
      const timeout = setTimeout(() => {
        localStorage.setItem('html-weaver-draft', JSON.stringify(state.document));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [state.document, state.isDirty]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('html-weaver-draft');
    if (saved) {
      try {
        const document = JSON.parse(saved);
        dispatch({ type: 'IMPORT_DOCUMENT', payload: document });
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        dispatch({ type: 'SAVE_VERSION', payload: { description: 'Manual save' } });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { state, dispatch };
}

// Utility Hooks
export function useSelectedBlock(state: EditorState): Block | null {
  const findBlock = (blocks: Block[], id: ID): Block | null => {
    for (const block of blocks) {
      if (block.id === id) return block;
      if (block.children) {
        const found = findBlock(block.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return state.selectedBlockId ? findBlock(state.document.blocks, state.selectedBlockId) : null;
}

export function useBlockPath(state: EditorState, blockId: ID): number[] {
  const findPath = (blocks: Block[], id: ID, path: number[]): number[] | null => {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === id) return [...path, i];
      if (blocks[i].children) {
        const found = findPath(blocks[i].children!, id, [...path, i]);
        if (found) return found;
      }
    }
    return null;
  };

  return findPath(state.document.blocks, blockId, []) || [];
}
