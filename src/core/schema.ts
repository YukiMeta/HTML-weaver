export type BlockType = 'hero' | 'gallery' | 'features' | 'text' | 'metrics';

export interface BlockConfig {
  layout?: string;
  theme?: string;
  visible?: boolean;
  align?: string;
}

export interface BlockDataItem {
  text: string;
  value?: number | string;
  imageUrl?: string;
  label?: string;
}

export interface BlockData {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: BlockDataItem[];
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  config: BlockConfig;
  data: BlockData;
  children?: Block[];
  collapsed?: boolean;
}

export interface FieldDescriptor {
  key: string;
  label: string;
  type: 'text' | 'select' | 'boolean' | 'number' | 'items';
  options?: string[];
  section: 'config' | 'data';
}

export interface BlockDefinition {
  defaultConfig: BlockConfig;
  defaultData: BlockData;
  schema: FieldDescriptor[];
}
