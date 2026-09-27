import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { LanguagePills } from './LanguagePills';

const meta: Meta<typeof LanguagePills> = {
  title: 'Core/LanguagePills',
  component: LanguagePills,
  tags: ['autodocs'],
  argTypes: {
    currentLanguage: {
      control: 'select',
      options: ['ca', 'es', 'en'],
    },
  },
  args: {
    currentLanguage: 'ca',
    onSelectLanguage: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LanguagePills>;

export const CatalanActive: Story = {
  args: {
    currentLanguage: 'ca',
  },
};

export const SpanishActive: Story = {
  args: {
    currentLanguage: 'es',
  },
};

export const EnglishActive: Story = {
  args: {
    currentLanguage: 'en',
  },
};

export const WithLinks: Story = {
  args: {
    currentLanguage: 'ca',
    getHref: (lang) => `/info/${lang}/`,
  },
};
