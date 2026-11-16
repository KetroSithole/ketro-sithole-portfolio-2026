import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

/** Global UI state shared across the app, powered by signals. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly theme = signal<Theme>(this.readTheme());
  readonly paletteOpen = signal(false);
  readonly party = signal(false);
  readonly toast = signal<string | null>(null);
  /** Skill picked anywhere on the page (timeline tag, case study, marquee) — the Toolkit section reacts. */
  readonly selectedSkill = signal<string | null>(null);

  selectSkill(name: string): void {
    this.selectedSkill.set(name);
    this.scrollTo('skills');
  }

  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.dataset['theme'] = t;
      try { localStorage.setItem('kt-theme', t); } catch { /* storage unavailable */ }
    });
    effect(() => document.body.classList.toggle('party', this.party()));
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  scrollTo(id: string): void {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  notify(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2400);
  }

  async copy(text: string, message = 'Copied to clipboard ✓'): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.notify(message);
    } catch {
      this.notify(text);
    }
  }

  private readTheme(): Theme {
    try {
      const saved = localStorage.getItem('kt-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* storage unavailable */ }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
