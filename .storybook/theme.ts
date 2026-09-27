import { create } from '@storybook/theming/create';

export const brandtTheme = create({
  base: 'dark',
  brandTitle: 'Brandt-Daroff',
  brandUrl: './',
  brandImage: './icon.svg',
  brandTarget: '_self',

  // Accent & brand colors
  colorPrimary: '#22c55e',
  colorSecondary: '#16a34a',

  // UI Chrome
  appBg: '#020617',
  appContentBg: '#090d16',
  appPreviewBg: '#020617',
  appBorderColor: '#334155',
  appBorderRadius: 12,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  // Text colors
  textColor: '#f8fafc',
  textInverseColor: '#020617',
  textMutedColor: '#94a3b8',

  // Toolbar
  barTextColor: '#94a3b8',
  barSelectedColor: '#22c55e',
  barHoverColor: '#4ade80',
  barBg: '#0f172a',

  // Form inputs
  inputBg: '#1e293b',
  inputBorder: '#334155',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 8,

  buttonBg: '#1e293b',
  buttonBorder: '#334155',
});
