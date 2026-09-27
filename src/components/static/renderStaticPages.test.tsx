import { describe, expect, it } from 'vitest';
import { getAllStaticLanguages, renderStaticPage } from './renderStaticPages';
import { staticInfoContents } from './infoContentData';

describe('renderStaticPages', () => {
  it('returns all supported static languages', () => {
    const languages = getAllStaticLanguages();
    expect(languages).toEqual(['en', 'ca', 'es']);
  });

  it.each(['en', 'ca', 'es'] as const)('renders full static HTML for %s with SEO and components', (lang) => {
    const siteUrl = 'https://alcoceba.github.io/brandt-daroff';
    const compiledCss = '.app-gradient { background: #000; }';

    const html = renderStaticPage(lang, { siteUrl, compiledCss });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain(`<html lang="${lang}">`);
    expect(html).toContain('class="app-gradient');
    expect(html).toContain('application/ld+json');
    expect(html).toContain(staticInfoContents[lang].meta.twitterTitle);
    expect(html).toContain(staticInfoContents[lang].warning.disclaimerTitle);
    expect(html).toContain(staticInfoContents[lang].warning.title);
    expect(html).toContain(staticInfoContents[lang].methodSection.title);
    expect(html).toContain(staticInfoContents[lang].stepsSection.title);
    expect(html).not.toContain('MedicalWebPage');
    expect(html).not.toContain('Guia clínica');
    expect(html).not.toContain('Guía clínica');
    expect(html).not.toContain('Clinical Patient Guide');
    expect(html).toContain('data-goatcounter="https://alcoceba.goatcounter.com/count"');
    expect(html).toContain('//gc.zgo.at/count.js');
    expect(html).toContain(compiledCss);
  });

  it('throws error for unsupported language', () => {
    expect(() =>
      renderStaticPage('fr' as unknown as 'en', {
        siteUrl: 'https://example.com',
        compiledCss: '',
      })
    ).toThrow(/Unsupported static page language/);
  });
});
