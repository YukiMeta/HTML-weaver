import { useCallback } from 'react';
import type { Block, BlockData, BlockConfig, FieldDescriptor, BlockDataItem } from '../core/schema';
import * as HeroDef from '../core/blocks/Hero';
import * as GalleryDef from '../core/blocks/Gallery';
import * as FeaturesDef from '../core/blocks/Features';

function getSchema(type: Block['type']): FieldDescriptor[] {
  switch (type) {
    case 'hero': return HeroDef.schema;
    case 'gallery': return GalleryDef.schema;
    case 'features': return FeaturesDef.schema;
    default: return [];
  }
}

interface ItemsEditorProps {
  items: BlockDataItem[];
  onChange: (items: BlockDataItem[]) => void;
}

function ItemsEditor({ items, onChange }: ItemsEditorProps) {
  function updateItem(idx: number, key: keyof BlockDataItem, value: string) {
    const next = items.map((it, i) => i === idx ? { ...it, [key]: value } : it);
    onChange(next);
  }

  function deleteItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function addItem() {
    onChange([...items, { text: 'New item', label: '', value: '' }]);
  }

  return (
    <div>
      <div className="items-list">
        {items.map((item, idx) => (
          <div className="item-card" key={idx}>
            <div className="item-card-header">
              <span className="item-index">#{idx + 1}</span>
              <button className="item-delete-btn" onClick={() => deleteItem(idx)} title="Delete item">✕</button>
            </div>
            <div className="field-row">
              <label className="field-label">Text</label>
              <input className="field-input" value={item.text} onChange={e => updateItem(idx, 'text', e.target.value)} />
            </div>
            <div className="field-row">
              <label className="field-label">Label / Icon</label>
              <input className="field-input" value={item.label ?? ''} onChange={e => updateItem(idx, 'label', e.target.value)} />
            </div>
            <div className="field-row">
              <label className="field-label">Value</label>
              <input className="field-input" value={String(item.value ?? '')} onChange={e => updateItem(idx, 'value', e.target.value)} />
            </div>
            <div className="field-row">
              <label className="field-label">Image URL</label>
              <input className="field-input" value={item.imageUrl ?? ''} onChange={e => updateItem(idx, 'imageUrl', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <button className="add-item-btn" onClick={addItem}>+ Add Item</button>
    </div>
  );
}

interface BlockPanelProps {
  block: Block | null;
  onUpdate: (id: string, data: Partial<BlockData>, config: Partial<BlockConfig>) => void;
}

export function BlockPanel({ block, onUpdate }: BlockPanelProps) {
  const schema = block ? getSchema(block.type) : [];

  const handleDataChange = useCallback((key: string, value: string | boolean) => {
    if (!block) return;
    onUpdate(block.id, { [key]: value }, {});
  }, [block, onUpdate]);

  const handleConfigChange = useCallback((key: string, value: string | boolean) => {
    if (!block) return;
    onUpdate(block.id, {}, { [key]: value });
  }, [block, onUpdate]);

  const handleItemsChange = useCallback((items: BlockDataItem[]) => {
    if (!block) return;
    onUpdate(block.id, { items }, {});
  }, [block, onUpdate]);

  if (!block) {
    return (
      <div className="block-panel">
        <div className="panel-header">
          <p className="panel-title">Properties</p>
        </div>
        <div className="panel-empty">
          <span>📋</span>
          <span>Select a block to edit</span>
        </div>
      </div>
    );
  }

  const dataFields = schema.filter(f => f.section === 'data' && f.type !== 'items');
  const itemsFields = schema.filter(f => f.section === 'data' && f.type === 'items');
  const configFields = schema.filter(f => f.section === 'config');

  function renderField(field: FieldDescriptor) {
    const isData = field.section === 'data';
    const rawValue = isData
      ? (block!.data as Record<string, unknown>)[field.key]
      : (block!.config as Record<string, unknown>)[field.key];

    if (field.type === 'text' || field.type === 'number') {
      return (
        <div className="field-row" key={field.key}>
          <label className="field-label">{field.label}</label>
          <input
            className="field-input"
            value={String(rawValue ?? '')}
            onChange={e => isData
              ? handleDataChange(field.key, e.target.value)
              : handleConfigChange(field.key, e.target.value)
            }
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="field-row" key={field.key}>
          <label className="field-label">{field.label}</label>
          <select
            className="field-select"
            value={String(rawValue ?? '')}
            onChange={e => isData
              ? handleDataChange(field.key, e.target.value)
              : handleConfigChange(field.key, e.target.value)
            }
          >
            {(field.options ?? []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'boolean') {
      return (
        <div className="field-row" key={field.key}>
          <div className="field-checkbox-row">
            <input
              className="field-checkbox"
              type="checkbox"
              id={`field-${field.key}`}
              checked={Boolean(rawValue)}
              onChange={e => isData
                ? handleDataChange(field.key, e.target.checked)
                : handleConfigChange(field.key, e.target.checked)
              }
            />
            <label className="field-label" htmlFor={`field-${field.key}`} style={{ margin: 0 }}>{field.label}</label>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="block-panel">
      <div className="panel-header">
        <p className="panel-title">Properties</p>
        <span className="panel-block-type">
          <span className={`block-badge ${block.type}`}>{block.type}</span>
          {block.data.title ?? block.type}
        </span>
      </div>
      <div className="panel-scroll">
        {dataFields.length > 0 && (
          <div className="field-section">
            <p className="field-section-title">Content</p>
            {dataFields.map(renderField)}
          </div>
        )}
        {itemsFields.length > 0 && (
          <div className="field-section">
            <p className="field-section-title">{itemsFields[0].label}</p>
            <ItemsEditor
              items={block.data.items ?? []}
              onChange={handleItemsChange}
            />
          </div>
        )}
        {configFields.length > 0 && (
          <div className="field-section">
            <p className="field-section-title">Settings</p>
            {configFields.map(renderField)}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockPanel;
