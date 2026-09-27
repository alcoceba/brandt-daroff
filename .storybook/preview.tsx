import type { Preview, StoryFn, StoryContext } from '@storybook/react';
import React, { useEffect } from 'react';
import '@/index.css';
import i18n from '@/i18n';

export const globalTypes = {
  locale: {
    name: 'Language',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'ca', title: 'Català' },
        { value: 'es', title: 'Castellano' },
      ],
      showName: true,
    },
  },
};

const withI18n = (Story: StoryFn, context: StoryContext) => {
  const locale = (context.globals.locale as string) || 'en';

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  return <Story />;
};

const withTheme = (Story: StoryFn) => {
  return (
    <div className="min-h-[200px] w-full p-4 flex items-center justify-center text-slate-100 font-sans">
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [withI18n, withTheme],
  parameters: {
    backgrounds: {
      default: 'app-dark',
      values: [
        { name: 'app-dark', value: '#020617' },
        { name: 'slate-900', value: '#0f172a' },
        { name: 'app-to', value: '#312e81' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobileSmall: {
          name: 'Mobile Small (iPhone SE)',
          styles: { width: '375px', height: '667px' },
        },
        mobileStandard: {
          name: 'Mobile Standard (iPhone 14/15)',
          styles: { width: '390px', height: '844px' },
        },
        mobileLarge: {
          name: 'Mobile Large (Pixel 7 / Pro)',
          styles: { width: '412px', height: '915px' },
        },
      },
      defaultViewport: 'mobileStandard',
    },
  },
};

export default preview;
