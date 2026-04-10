/**
 * Core Types for HTML-Weaver
 * Production-grade type definitions
 */

// Unique identifier for all entities
export type ID = string;

// Block Types - Extensible union
export type BlockType =
  | 'hero'
  | 'features'
  | 'gallery'
  | 'text'
  | 'stats'
  | 'cta'
  | 'testimonial'
  | 'footer';

// Layout modes for dual rendering
export type LayoutMode = 'flow' | 'fixed';

// Share formats
export type ShareFormat = 'web' | 'card' | 'pdf' | 'ppt';

// Theme definitions
export interface Theme {
  id: ID;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    content: string;
  };
}

// Base Block Interface - All blocks extend this
export interface BaseBlock {
  id: ID;
  type: BlockType;
  config: BlockConfig;
  data: BlockData;
  children?: Block[];
  order: number;
  parentId?: ID;
}

// Block Configuration - High-frequency changes
export interface BlockConfig {
  layout: 'full' | 'split' | 'centered' | 'grid-2' | 'grid-3' | 'carousel';
  theme: string; // theme ID reference
  visible: boolean;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  spacing: 'compact' | 'normal' | 'loose';
}

// Block Data - Content that varies per type
export interface BlockData {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: DataItem[];
  image?: ImageData;
  images?: ImageData[];
  cta?: CTAData;
  stats?: StatData[];
  [key: string]: unknown; // Extensibility
}

export interface DataItem {
  id: ID;
  title: string;
  description?: string;
  icon?: string;
  value?: string | number;
}

export interface ImageData {
  src: string;
  alt: string;
  caption?: string;
}

export interface CTAData {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface StatData {
  label: string;
  value: string | number;
  suffix?: string;
  change?: number;
}

export type Block = BaseBlock;

// Page Configuration
export interface PageConfig {
  id: ID;
  title: string;
  description: string;
  meta: PageMeta;
  theme: Theme;
  layout: LayoutMode;
  shareFormat: ShareFormat;
}

export interface PageMeta {
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags: string[];
}

// Document - Top level container
export interface Document {
  id: ID;
  config: PageConfig;
  blocks: Block[];
  history: Version[];
}

// Version control
export interface Version {
  id: ID;
  timestamp: Date;
  description: string;
  blocks: Block[];
  config: PageConfig;
}

// Editor State
export interface EditorState {
  document: Document;
  selectedBlockId: ID | null;
  expandedBlockIds: ID[];
  previewMode: LayoutMode;
  isDirty: boolean;
  undoStack: Document[];
  redoStack: Document[];
}

// AI Generation Request
export interface AIGenerationRequest {
  outline: OutlineItem[];
  style: 'professional' | 'creative' | 'minimal' | 'bold';
  tone: 'formal' | 'casual' | 'enthusiastic';
  generateImages: boolean;
  generateAnimations: boolean;
}

export interface OutlineItem {
  id: ID;
  type: BlockType;
  title: string;
  notes?: string;
  children?: OutlineItem[];
}

// Export Options
export interface ExportOptions {
  format: 'html' | 'json' | 'zip';
  includeAssets: boolean;
  minify: boolean;
  fixedLayout?: {
    width: number;
    height: number;
  };
}

// Social Share Card
export interface ShareCard {
  title: string;
  description: string;
  image: string;
  url: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'wechat';
}
