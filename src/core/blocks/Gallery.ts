import type { BlockConfig, BlockData, FieldDescriptor } from '../schema';

export const defaultConfig: BlockConfig = {
  layout: '3col',
  theme: 'light',
  visible: true,
};

export const defaultData: BlockData = {
  title: 'Gallery',
  items: [
    { text: 'Image 1', imageUrl: '', label: 'Photo' },
    { text: 'Image 2', imageUrl: '', label: 'Photo' },
    { text: 'Image 3', imageUrl: '', label: 'Photo' },
  ],
};

export const schema: FieldDescriptor[] = [
  { key: 'title', label: 'Title', type: 'text', section: 'data' },
  { key: 'items', label: 'Gallery Items', type: 'items', section: 'data' },
  { key: 'layout', label: 'Layout', type: 'select', options: ['2col', '3col', '4col', 'masonry'], section: 'config' },
  { key: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark'], section: 'config' },
  { key: 'visible', label: 'Visible', type: 'boolean', section: 'config' },
];
