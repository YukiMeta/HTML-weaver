import type { Block } from '../core/schema';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
  blocks: Block[];
}

export const templates: Template[] = [
  {
    id: 'report',
    name: 'Q4 业绩汇报',
    description: '季度业绩汇报模板，包含指标展示和特性列表',
    color: '#667eea',
    blocks: [
      {
        id: uid(),
        type: 'hero',
        config: { theme: 'gradient', layout: 'center', visible: true },
        data: {
          title: 'Q4 业绩汇报',
          subtitle: '2024年第四季度业绩总结',
          description: '本报告展示了第四季度的核心业务指标与重要成果。',
          buttonText: '查看详情',
          buttonUrl: '#',
        },
      },
      {
        id: uid(),
        type: 'metrics',
        config: { theme: 'light', visible: true },
        data: {
          title: '核心指标',
          items: [
            { text: '营收增长', value: '128%', label: '同比' },
            { text: '活跃用户', value: '2.4M', label: '月活' },
            { text: '客户满意度', value: '98%', label: 'NPS' },
            { text: '新增客户', value: '1,240', label: '本季度' },
          ],
        },
      },
      {
        id: uid(),
        type: 'features',
        config: { layout: '3col', theme: 'blue', visible: true },
        data: {
          title: '重点成果',
          subtitle: '本季度取得的重要里程碑',
          items: [
            { text: '完成产品迭代升级', label: '🚀', value: '' },
            { text: '拓展海外市场', label: '🌍', value: '' },
            { text: '建立战略合作关系', label: '🤝', value: '' },
          ],
        },
      },
    ],
  },
  {
    id: 'portfolio',
    name: '个人主页',
    description: '展示个人作品和技能的主页模板',
    color: '#764ba2',
    blocks: [
      {
        id: uid(),
        type: 'hero',
        config: { theme: 'dark', layout: 'left', visible: true },
        data: {
          title: '你好，我是张伟',
          subtitle: '全栈开发工程师 & UI设计师',
          description: '热爱技术，专注于构建优雅高效的数字产品。',
          buttonText: '联系我',
          buttonUrl: 'mailto:zhang@example.com',
        },
      },
      {
        id: uid(),
        type: 'gallery',
        config: { layout: '3col', theme: 'light', visible: true },
        data: {
          title: '作品集',
          items: [
            { text: '电商平台', imageUrl: '', label: 'Web' },
            { text: '移动应用', imageUrl: '', label: 'iOS/Android' },
            { text: '品牌设计', imageUrl: '', label: 'Design' },
          ],
        },
      },
      {
        id: uid(),
        type: 'features',
        config: { layout: '3col', theme: 'light', visible: true },
        data: {
          title: '技能栈',
          subtitle: '我擅长的技术和工具',
          items: [
            { text: 'React & TypeScript', label: '⚛️', value: '' },
            { text: 'Node.js & Python', label: '🐍', value: '' },
            { text: 'UI/UX Design', label: '🎨', value: '' },
          ],
        },
      },
    ],
  },
  {
    id: 'landing',
    name: '产品展示',
    description: '产品推广落地页模板',
    color: '#f093fb',
    blocks: [
      {
        id: uid(),
        type: 'hero',
        config: { theme: 'gradient', layout: 'center', visible: true },
        data: {
          title: '下一代协作工具',
          subtitle: '重新定义团队工作方式',
          description: '集成AI能力，让您的团队效率提升10倍。',
          buttonText: '免费试用',
          buttonUrl: '#signup',
        },
      },
      {
        id: uid(),
        type: 'features',
        config: { layout: '3col', theme: 'light', visible: true },
        data: {
          title: '为什么选择我们',
          subtitle: '专为现代团队打造的协作平台',
          items: [
            { text: '实时协作', label: '⚡', value: '' },
            { text: 'AI 智能辅助', label: '🤖', value: '' },
            { text: '企业级安全', label: '🔐', value: '' },
          ],
        },
      },
      {
        id: uid(),
        type: 'gallery',
        config: { layout: '2col', theme: 'dark', visible: true },
        data: {
          title: '产品截图',
          items: [
            { text: '仪表板视图', imageUrl: '', label: 'Dashboard' },
            { text: '协作工作区', imageUrl: '', label: 'Workspace' },
          ],
        },
      },
    ],
  },
];
