import { Link } from 'react-router-dom';
import { Bolt, Sparkles } from 'lucide-react';
import type { LearningRecommendationData } from '@/types/student/analytics';

type LearningRecommendationProps = LearningRecommendationData;

export function LearningRecommendation({
  title,
  body,
  primaryCta,
  primaryHref,
  secondaryCta,
}: LearningRecommendationProps) {
  return (
    <section className="glass-ai ghost-border relative overflow-hidden rounded-sm p-8">
      <div className="absolute right-0 top-0 p-6">
        <Sparkles className="h-10 w-10 text-primary/20" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2">
          <Bolt className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Suggested next step</span>
        </div>

        <h3 className="font-headline text-2xl font-bold text-on-surface">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">{body}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={primaryHref}
            className="rounded-sm bg-primary px-6 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
          >
            {primaryCta}
          </Link>
          <button
            type="button"
            className="rounded-sm border border-on-surface/20 bg-transparent px-6 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-white/10"
          >
            {secondaryCta}
          </button>
        </div>
      </div>
    </section>
  );
}
