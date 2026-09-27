import { renderToStaticMarkup } from 'react-dom/server';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { StaticInfoPage } from './StaticInfoPage';
import { staticInfoContents } from './infoContentData';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {},
  });
}

export function renderStaticPage(
  lang: 'en' | 'ca' | 'es',
  options: { siteUrl: string; compiledCss: string }
): string {
  const content = staticInfoContents[lang];
  if (!content) {
    throw new Error(`Unsupported static page language: ${lang}`);
  }

  const html = renderToStaticMarkup(
    <StaticInfoPage
      content={content}
      siteUrl={options.siteUrl}
      compiledCss={options.compiledCss}
    />
  );

  return `<!DOCTYPE html>\n${html}`;
}

export function getAllStaticLanguages(): Array<'en' | 'ca' | 'es'> {
  return ['en', 'ca', 'es'];
}
