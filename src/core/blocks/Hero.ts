import type { BlockConfig, BlockData, FieldDescriptor } from '../schema';

export const defaultConfig: BlockConfig = {
  theme: 'light',
  layout: 'center',
  visible: true,
};

export const defaultData: BlockData = {
  title: 'Welcome to Our Platform',
  subtitle: 'Build beautiful HTML pages with ease',
  description: 'A powerful editor for creating stunning web content.',
  buttonText: 'Get Started',
  buttonUrl: '#',
  imageUrl: '',
};

export const schema: FieldDescriptor[] = [
  { key: 'title', label: 'Title', type: 'text', section: 'data' },
  { key: 'subtitle', label: 'Subtitle', type: 'text', section: 'data' },
  { key: 'description', label: 'Description', type: 'text', section: 'data' },
  { key: 'buttonText', label: 'Button Text', type: 'text', section: 'data' },
  { key: 'buttonUrl', label: 'Button URL', type: 'text', section: 'data' },
  { key: 'imageUrl', label: 'Image URL', type: 'text', section: 'data' },
  { key: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark', 'gradient'], section: 'config' },
  { key: 'layout', label: 'Layout', type: 'select', options: ['center', 'left', 'split'], section: 'config' },
  { key: 'visible', label: 'Visible', type: 'boolean', section: 'config' },
];
