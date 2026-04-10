/**
 * Block Registry - Defines all available block types and their schemas
 * Production-grade block definitions
 */

import { BlockType, BlockConfig, BlockData, Theme } from '../types';

// Block Schema Definition
export interface BlockSchema {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  configSchema: ConfigSchemaField[];
  dataSchema: DataSchemaField[];
  defaultConfig: Partial<BlockConfig>;
  defaultData: Partial<BlockData>;
  render: (config: BlockConfig, data: BlockData, theme: Theme) => React.ReactNode;
}

export interface ConfigSchemaField {
  key: string;
  label: string;
  type: 'select' | 'boolean' | 'text' | 'number' | 'color';
  options?: string[];
  defaultValue: unknown;
  description?: string;
}

export interface DataSchemaField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'list' | 'rich-text';
  required: boolean;
  placeholder?: string;
  maxLength?: number;
}

// Hero Block
export const HeroBlock: BlockSchema = {
  type: 'hero',
  name: 'Hero Section',
  description: 'Large header with title, subtitle, and CTA',
  icon: 'Layout',
  configSchema: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: ['centered', 'split', 'full'],
      defaultValue: 'centered',
      description: 'How the hero content is arranged'
    },
    {
      key: 'spacing',
      label: 'Spacing',
      type: 'select',
      options: ['compact', 'normal', 'loose'],
      defaultValue: 'normal',
    },
    {
      key: 'animation',
      label: 'Animation',
      type: 'select',
      options: ['fade', 'slide', 'zoom', 'none'],
      defaultValue: 'fade',
    },
    {
      key: 'visible',
      label: 'Visible',
      type: 'boolean',
      defaultValue: true,
    }
  ],
  dataSchema: [
    { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter hero title', maxLength: 100 },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', required: false, placeholder: 'Enter subtitle', maxLength: 200 },
    { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Enter description', maxLength: 500 },
  ],
  defaultConfig: {
    layout: 'centered',
    spacing: 'normal',
    animation: 'fade',
    visible: true,
    theme: 'default'
  },
  defaultData: {
    title: 'Welcome to Our Product',
    subtitle: 'The best solution for your needs',
  },
  render: () => null // Implemented in component layer
};

// Features Block
export const FeaturesBlock: BlockSchema = {
  type: 'features',
  name: 'Features Grid',
  description: 'Showcase key features in a grid layout',
  icon: 'Grid',
  configSchema: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: ['grid-2', 'grid-3', 'carousel'],
      defaultValue: 'grid-3',
    },
    {
      key: 'spacing',
      label: 'Spacing',
      type: 'select',
      options: ['compact', 'normal', 'loose'],
      defaultValue: 'normal',
    },
    {
      key: 'visible',
      label: 'Visible',
      type: 'boolean',
      defaultValue: true,
    }
  ],
  dataSchema: [
    { key: 'title', label: 'Section Title', type: 'text', required: false, placeholder: 'Features', maxLength: 100 },
    { key: 'description', label: 'Section Description', type: 'textarea', required: false, placeholder: 'What makes us special', maxLength: 300 },
  ],
  defaultConfig: {
    layout: 'grid-3',
    spacing: 'normal',
    visible: true,
    theme: 'default'
  },
  defaultData: {
    title: 'Key Features',
    items: [
      { id: '1', title: 'Feature One', description: 'Description of feature one' },
      { id: '2', title: 'Feature Two', description: 'Description of feature two' },
      { id: '3', title: 'Feature Three', description: 'Description of feature three' },
    ]
  },
  render: () => null
};

// Gallery Block
export const GalleryBlock: BlockSchema = {
  type: 'gallery',
  name: 'Image Gallery',
  description: 'Display images in various layouts',
  icon: 'Image',
  configSchema: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: ['grid-2', 'grid-3', 'carousel', 'masonry'],
      defaultValue: 'grid-3',
    },
    {
      key: 'spacing',
      label: 'Spacing',
      type: 'select',
      options: ['compact', 'normal', 'loose'],
      defaultValue: 'normal',
    },
    {
      key: 'visible',
      label: 'Visible',
      type: 'boolean',
      defaultValue: true,
    }
  ],
  dataSchema: [
    { key: 'title', label: 'Gallery Title', type: 'text', required: false, placeholder: 'Our Work', maxLength: 100 },
  ],
  defaultConfig: {
    layout: 'grid-3',
    spacing: 'normal',
    visible: true,
    theme: 'default'
  },
  defaultData: {
    images: []
  },
  render: () => null
};

// Stats Block
export const StatsBlock: BlockSchema = {
  type: 'stats',
  name: 'Statistics',
  description: 'Display key metrics and numbers',
  icon: 'BarChart',
  configSchema: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: ['grid-2', 'grid-3', 'grid-4'],
      defaultValue: 'grid-4',
    },
    {
      key: 'visible',
      label: 'Visible',
      type: 'boolean',
      defaultValue: true,
    }
  ],
  dataSchema: [
    { key: 'title', label: 'Section Title', type: 'text', required: false, placeholder: 'By the Numbers', maxLength: 100 },
  ],
  defaultConfig: {
    layout: 'grid-4',
    visible: true,
    theme: 'default'
  },
  defaultData: {
    stats: [
      { label: 'Users', value: 10000, suffix: '+' },
      { label: 'Revenue', value: 99, suffix: '%' },
      { label: 'Countries', value: 50, suffix: '+' },
      { label: 'Rating', value: 4.9, suffix: '/5' },
    ]
  },
  render: () => null
};

// Text Block
export const TextBlock: BlockSchema = {
  type: 'text',
  name: 'Text Content',
  description: 'Rich text content block',
  icon: 'Type',
  configSchema: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: ['centered', 'full'],
      defaultValue: 'centered',
    },
    {
      key: 'visible',
      label: 'Visible',
      type: 'boolean',
      defaultValue: true,
    }
  ],
  dataSchema: [
    { key: 'title', label: 'Title', type: 'text', required: false, placeholder: 'Section Title', maxLength: 200 },
    { key: 'description', label: 'Content', type: 'rich-text', required: false, placeholder: 'Enter your content here...' },
  ],
  defaultConfig: {
    layout: 'centered',
    visible: true,
    theme: 'default'
  },
  defaultData: {},
  render: () => null
};

// Block Registry
export const BlockRegistry: Record<BlockType, BlockSchema> = {
  hero: HeroBlock,
  features: FeaturesBlock,
  gallery: GalleryBlock,
  stats: StatsBlock,
  text: TextBlock,
  cta: HeroBlock, // Placeholder - extend as needed
  testimonial: TextBlock, // Placeholder
  footer: TextBlock, // Placeholder
};

export function getBlockSchema(type: BlockType): BlockSchema {
  return BlockRegistry[type] || TextBlock;
}

export function getAllBlockTypes(): BlockType[] {
  return Object.keys(BlockRegistry) as BlockType[];
}
