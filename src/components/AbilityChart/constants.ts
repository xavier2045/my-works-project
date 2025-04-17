// 常量配置
export const NUCLEUS_COLORS = [
  'hsla(30, 40%, 75%, 0.5)',   // 暖棕色
  'hsla(200, 40%, 75%, 0.5)',  // 淡蓝色
  'hsla(280, 40%, 75%, 0.5)',  // 淡紫色
  'hsla(150, 40%, 75%, 0.5)',  // 淡绿色
  'hsla(60, 40%, 75%, 0.5)',   // 淡黄色
  'hsla(340, 40%, 75%, 0.5)'   // 淡粉色
];

export const DEFAULT_ABILITIES = [
  { name: '演讲', percentage: '11%', icon: 'path_to_icon_1' },
  { name: '医学', percentage: '41%', icon: 'path_to_icon_2' },
  { name: '设计', percentage: '19%', icon: 'path_to_icon_3' },
  { name: '市场', percentage: '8%', icon: 'path_to_icon_4' },
  { name: '前端', percentage: '12%', icon: 'path_to_icon_5' },
  { name: '摄影', percentage: '9%', icon: 'path_to_icon_6' }
]; 

export const DEFAULT_ICONS = [
  `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`, // 信息图标
  `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z"/></svg>`, // 医疗图标
  `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h4V7h2v4h4v2h-4v4h-2v-4H7z"/></svg>`, // 设计图标
  `<svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`, // 趋势图标
  `<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`, // 代码图标
  `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/></svg>` // 摄影图标
];