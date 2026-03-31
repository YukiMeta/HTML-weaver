import type { BlockConfig, BlockData, FieldDescriptor } from '../schema';

export const defaultConfig: BlockConfig = {
  layout: '3col',
  theme: 'light',
  visible: true,
};

export const defaultData: BlockData = {
  title: 'Key Features',
  subtitle: 'Everything you need to succeed',
  items: [
    { text: 'Fast Performance', value: '', label: '⚡' },
    { text: 'Easy to Use', value: '', label: '🎯' },
    { text: 'Fully Customizable', value: '', label: '🎨' },
  ],
};

export const schema: FieldDescriptor[] = [
  { key: 'title', label: 'Title', type: 'text', section: 'data' },
  { key: 'subtitle', label: 'Subtitle', type: 'text', section: 'data' },
  { key: 'items', label: 'Feature Items', type: 'items', section: 'data' },
  { key: 'layout', label: 'Layout', type: 'select', options: ['2col', '3col'], section: 'config' },
  { key: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark', 'blue'], section: 'config' },
  { key: 'visible', label: 'Visible', type: 'boolean', section: 'config' },
];
