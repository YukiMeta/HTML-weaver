/**
 * Progressive Experience Architecture
 *
 * Level 1 (Beginner): Input → Generate → Simple Edit → Export
 *   - One-line topic input
 *   - Style presets (no config panels)
 *   - Direct text editing (click to edit)
 *   - One-click export
 *
 * Level 2 (Advanced): Outline Editor → Fine-tune → Version Management
 *   - Tree structure editing
 *   - Config panels for each block
 *   - Layout/theme switching
 *   - Version history
 *
 * Level 3 (Pro): Code Editor → Custom Logic → Advanced Export
 *   - Raw config editing
 *   - Custom CSS/JS injection
 *   - Print mode (for legacy needs)
 *   - Batch operations
 */

import { ReactNode } from 'react';
import { Document, Block, ID } from '../types';

export type UserLevel = 'beginner' | 'advanced' | 'pro';

export interface ExperienceConfig {
  level: UserLevel;
  features: {
    // Level 1: Always available
    simpleInput: boolean;
    stylePresets: boolean;
    directEdit: boolean;
    oneClickExport: boolean;

    // Level 2: Advanced features
    outlineEditor: boolean;
    configPanels: boolean;
    layoutSwitching: boolean;
    versionHistory: boolean;

    // Level 3: Pro features
    codeEditor: boolean;
    customLogic: boolean;
    printMode: boolean;
    batchOperations: boolean;
  };
  ui: {
    showTreeByDefault: boolean;
    showConfigPanel: boolean;
    showCodeToggle: boolean;
    simplifiedToolbar: boolean;
  };
}

export function getExperienceConfig(level: UserLevel): ExperienceConfig {
  const configs: Record<UserLevel, ExperienceConfig> = {
    beginner: {
      level: 'beginner',
      features: {
        simpleInput: true,
        stylePresets: true,
        directEdit: true,
        oneClickExport: true,
        outlineEditor: false,
        configPanels: false,
        layoutSwitching: false,
        versionHistory: false,
        codeEditor: false,
        customLogic: false,
        printMode: false,
        batchOperations: false,
      },
      ui: {
        showTreeByDefault: false,
        showConfigPanel: false,
        showCodeToggle: false,
        simplifiedToolbar: true,
      },
    },
    advanced: {
      level: 'advanced',
      features: {
        simpleInput: true,
        stylePresets: true,
        directEdit: true,
        oneClickExport: true,
        outlineEditor: true,
        configPanels: true,
        layoutSwitching: true,
        versionHistory: true,
        codeEditor: false,
        customLogic: false,
        printMode: true, // Available but not prominent
        batchOperations: false,
      },
      ui: {
        showTreeByDefault: true,
        showConfigPanel: true,
        showCodeToggle: false,
        simplifiedToolbar: false,
      },
    },
    pro: {
      level: 'pro',
      features: {
        simpleInput: true,
        stylePresets: true,
        directEdit: true,
        oneClickExport: true,
        outlineEditor: true,
        configPanels: true,
        layoutSwitching: true,
        versionHistory: true,
        codeEditor: true,
        customLogic: true,
        printMode: true,
        batchOperations: true,
      },
      ui: {
        showTreeByDefault: true,
        showConfigPanel: true,
        showCodeToggle: true,
        simplifiedToolbar: false,
      },
    },
  };

  return configs[level];
}

// Progressive Feature Gate
export function canUseFeature(
  config: ExperienceConfig,
  feature: keyof ExperienceConfig['features']
): boolean {
  return config.features[feature];
}

// Feature Promotion Prompts
export function getFeaturePromotion(
  currentLevel: UserLevel,
  targetFeature: string
): string | null {
  const promotions: Record<string, Record<UserLevel, string | null>> = {
    outlineEditor: {
      beginner: 'Unlock tree editing by switching to Advanced mode',
      advanced: null,
      pro: null,
    },
    printMode: {
      beginner: 'Print mode available in Advanced mode',
      advanced: null,
      pro: null,
    },
    codeEditor: {
      beginner: 'Code editing available in Pro mode',
      advanced: 'Code editing available in Pro mode',
      pro: null,
    },
  };

  return promotions[targetFeature]?.[currentLevel] || null;
}

// Smart Default Level Detection
export function detectUserLevel(
  document: Document,
  interactionHistory: UserInteraction[]
): UserLevel {
  // If user has custom code or complex config → Pro
  if (document.blocks.some(b => b.data._customCode)) {
    return 'pro';
  }

  // If user frequently uses outline editor → Advanced
  const outlineEdits = interactionHistory.filter(
    i => i.type === 'outline_edit'
  ).length;
  if (outlineEdits > 5) {
    return 'advanced';
  }

  // Default to beginner for new users
  return 'beginner';
}

export interface UserInteraction {
  type: string;
  timestamp: Date;
  data?: unknown;
}
