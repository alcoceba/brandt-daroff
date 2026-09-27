import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Ear,
  ExternalLink,
  Move,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/core/Card';
import { getButtonClassName } from '@/components/core/buttonStyles';
import { Logo } from '@/components/core/Logo';
import type { StaticInfoContent } from './infoContentData';

export interface StaticInfoPageProps {
  content: StaticInfoContent;
  siteUrl: string;
  compiledCss: string;
}

export function StaticInfoPage({ content, siteUrl, compiledCss }: StaticInfoPageProps) {
  const {
    lang,
    locale,
    meta,
    schema,
    header,
    hero,
    toolCallout,
    warning,
    bppvSection,
    methodSection,
    stepsSection,
    protocolSection,
    footer,
  } = content;

  const canonicalUrl = `${siteUrl}/info/${lang}/`;
  const homeUrl = `${siteUrl}/`;
  const ogImageUrl = `${siteUrl}/og-${lang}.png`;

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: schema.webpageName,
        description: schema.webpageDescription,
        inLanguage: lang,
      },
      {
        '@type': 'HowTo',
        '@id': `${canonicalUrl}#howto`,
        name: schema.howtoName,
        description: schema.howtoDescription,
        totalTime: 'PT15M',
        supply: [
          {
            '@type': 'HowToSupply',
            name: schema.supplyName,
          },
        ],
        step: stepsSection.steps.map((step) => ({
          '@type': 'HowToStep',
          position: step.number,
          name: step.title,
          text: step.text,
        })),
      },
    ],
  };

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang alternates */}
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/info/en/`} />
        <link rel="alternate" hrefLang="ca" href={`${siteUrl}/info/ca/`} />
        <link rel="alternate" hrefLang="es" href={`${siteUrl}/info/es/`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/info/en/`} />

        {/* Open Graph */}
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={locale} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        {/* Icons and Theme */}
        <link rel="icon" type="image/svg+xml" href={`${siteUrl}/icon.svg`} />
        <link rel="apple-touch-icon" href={`${siteUrl}/icon-192.png`} />
        <meta name="theme-color" content="#020617" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

        {/* Compiled Tailwind CSS + theme variables */}
        <style dangerouslySetInnerHTML={{ __html: compiledCss }} />
      </head>

      <body className="app-gradient min-h-screen text-slate-100 antialiased selection:bg-brand-500/30 selection:text-white">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <a
              href={homeUrl}
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
              title={header.appName}
            >
              <Logo
                size={34}
                showWordmark={false}
                name={header.appName}
                tagline={header.appTagline}
              />
              <div className="leading-tight">
                <span className="block text-base font-bold text-white sm:text-lg">
                  {header.appName}
                </span>
                <span className="block text-xs font-medium text-slate-400">
                  {header.appTagline}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <nav
                aria-label="Languages"
                className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/60 p-1"
              >
                {(['en', 'ca', 'es'] as const).map((l) => {
                  const isActive = l === lang;
                  return (
                    <a
                      key={l}
                      href={`${siteUrl}/info/${l}/`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </a>
                  );
                })}
              </nav>

              <a
                href={homeUrl}
                className={getButtonClassName({
                  variant: 'outline',
                  size: 'md',
                  className: 'hidden sm:inline-flex text-xs py-2 px-3 min-h-[36px] font-medium border-slate-700',
                })}
              >
                {header.launchToolText}
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <article className="flex flex-col gap-8">
            {/* Clinical Hero Header */}
            <header className="flex flex-col gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-950/40 px-3 py-1 text-xs font-semibold text-brand-400">
                  <Activity className="h-3.5 w-3.5" />
                  {hero.badge}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                {hero.title}
              </h1>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                {hero.lead}
              </p>

              {/* Key Clinical Points */}
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {hero.keyPoints.map((point, idx) => (
                  <Card
                    key={idx}
                    variant="subtle"
                    className="flex flex-col gap-1 p-3.5 border-slate-800"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {point.label}
                    </span>
                    <span className="text-sm font-bold text-slate-100">
                      {point.value}
                    </span>
                  </Card>
                ))}
              </div>
            </header>

            {/* Safety & Medical Disclaimer Alert */}
            <aside aria-label="Avís mèdic i de seguretat">
              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-center gap-2.5 text-red-400">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <h2 className="text-base font-bold text-red-300 sm:text-lg">
                    {warning.disclaimerTitle}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-red-200/90">
                  {warning.disclaimerText}
                </p>

                <div className="mt-5 border-t border-red-500/30 pt-4">
                  <h3 className="text-sm font-bold text-red-300 sm:text-base">
                    {warning.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-red-200/90">
                    {warning.intro}
                  </p>
                  <ul className="mt-3 flex flex-col gap-1.5 pl-5 text-sm text-red-100 list-disc">
                    {warning.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Pathophysiology: What is BPPV */}
            <section aria-labelledby="bppv-heading">
              <Card variant="default" className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <Ear className="h-5 w-5" />
                  </span>
                  <h2 id="bppv-heading" className="text-xl font-bold text-white">
                    {bppvSection.title}
                  </h2>
                </div>
                <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  <p>{bppvSection.p1}</p>
                  <p>{bppvSection.p2}</p>
                </div>
              </Card>
            </section>

            {/* Mechanism & Indications */}
            <section aria-labelledby="method-heading">
              <Card variant="default" className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                    <Move className="h-5 w-5" />
                  </span>
                  <h2 id="method-heading" className="text-xl font-bold text-white">
                    {methodSection.title}
                  </h2>
                </div>
                <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  <p>{methodSection.p1}</p>
                  <p>{methodSection.p2}</p>
                </div>

                <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    {methodSection.indicationTitle}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">
                    {methodSection.indicationText}
                  </p>
                </div>
              </Card>
            </section>

            {/* Step-by-step Postural Protocol (5 Steps) */}
            <section aria-labelledby="steps-heading">
              <Card variant="default" className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <Compass className="h-5 w-5" />
                  </span>
                  <h2 id="steps-heading" className="text-xl font-bold text-white">
                    {stepsSection.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm text-slate-300 sm:text-base">
                  {stepsSection.intro}
                </p>

                <div className="mt-5 flex flex-col gap-3.5">
                  {stepsSection.steps.map((step) => (
                    <div
                      key={step.number}
                      className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 transition-colors hover:border-slate-600"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-brand-400 border border-slate-700">
                            {step.number}
                          </span>
                          <span className="text-sm font-bold text-white sm:text-base">
                            {step.title}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                          {step.duration}
                        </span>
                      </div>
                      <p className="pl-9 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {step.text}
                      </p>
                      {step.note && (
                        <p className="pl-9 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">Nota:</span> {step.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Protocol Administration & Practical Advice */}
            <section aria-labelledby="protocol-heading">
              <Card variant="default" className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <h2 id="protocol-heading" className="text-xl font-bold text-white">
                    {protocolSection.title}
                  </h2>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      {protocolSection.recommendedLabel}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">
                      {protocolSection.recommendedText}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {protocolSection.managementLabel}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">
                      {protocolSection.managementText}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {protocolSection.tipsLabel}
                  </span>
                  <ul className="mt-2.5 flex flex-col gap-2 pl-5 text-sm text-slate-300 list-disc">
                    {protocolSection.tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </section>

            {/* Interactive Session Assistant Utility Callout (Sober, clinical tool) */}
            <section aria-labelledby="tool-heading">
              <Card
                variant="default"
                className="border-slate-700/80 bg-slate-900/70 p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Clock className="h-5 w-5" />
                    </span>
                    <h2 id="tool-heading" className="text-lg font-bold text-white sm:text-xl">
                      {toolCallout.title}
                    </h2>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">
                    {toolCallout.description}
                  </p>

                  <div className="flex flex-col gap-2 py-1 text-xs text-slate-300 sm:text-sm">
                    {toolCallout.featurePoints.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <a
                      href={homeUrl}
                      className={getButtonClassName({
                        variant: 'primary',
                        size: 'md',
                        className: 'w-full sm:w-auto',
                      })}
                    >
                      {toolCallout.buttonText}
                    </a>
                  </div>
                </div>
              </Card>
            </section>
          </article>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/70 px-4 py-8 text-center text-xs text-slate-400">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-400">
              <a href={homeUrl} className="transition-colors hover:text-white">
                {footer.appLink}
              </a>
              <span>·</span>
              <a href={`${siteUrl}/llms-full.txt`} className="transition-colors hover:text-white">
                {footer.llmsLink}
              </a>
              <span>·</span>
              <a
                href="https://github.com/alcoceba/brandt-daroff"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-white"
              >
                {footer.githubLink}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
