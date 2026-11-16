import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { UiService, prefersReducedMotion } from './core/uiService';
import { CursorComponent } from './components/layout/cursorComponent';
import { NavComponent } from './components/layout/navComponent';
import { HeroComponent } from './components/sections/heroComponent';
import { MarqueeComponent } from './components/sections/marqueeComponent';
import { AboutComponent } from './components/sections/aboutComponent';
import { ExperienceComponent } from './components/sections/experienceComponent';
import { WorkComponent } from './components/sections/workComponent';
import { SkillsComponent } from './components/sections/skillsComponent';
import { AchievementsComponent } from './components/sections/achievementsComponent';
import { ContactComponent } from './components/sections/contactComponent';
import { CommandPaletteComponent } from './components/layout/commandPaletteComponent';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CursorComponent, NavComponent, HeroComponent, MarqueeComponent, AboutComponent, ExperienceComponent,
    WorkComponent, SkillsComponent, AchievementsComponent, ContactComponent, CommandPaletteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preloader" [class.done]="loaded()" aria-hidden="true">
      <div class="preloader__inner">
        <span class="preloader__count">{{ progress() }}</span>
        <span class="preloader__label">loading pipelines</span>
      </div>
      <div class="preloader__bar"><i [style.transform]="'scaleX(' + progress() / 100 + ')'"></i></div>
    </div>

    <div class="scroll-progress" [style.transform]="'scaleX(' + scroll() + ')'" aria-hidden="true"></div>
    <div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="grain" aria-hidden="true"></div>

    <app-cursor />
    <app-nav />

    <main>
      <app-hero />
      <app-marquee />
      <app-about />
      <app-experience />
      <app-work />
      <app-skills />
      <app-achievements />
      <app-contact />
    </main>

    <app-command-palette />

    @if (ui.toast(); as message) {
      <div class="toast" role="status">{{ message }}</div>
    }
  `,
  styles: [`
    .preloader { position: fixed; inset: 0; z-index: 2000; background: var(--bg); display: grid; place-items: center;
      transition: clip-path 1s cubic-bezier(.76,0,.24,1); clip-path: inset(0 0 0 0); }
    .preloader.done { clip-path: inset(0 0 100% 0); pointer-events: none; }
    .preloader__inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .preloader__count { font: 800 clamp(80px, 18vw, 220px)/1 var(--f-display); letter-spacing: -.05em;
      background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; font-variant-numeric: tabular-nums; }
    .preloader__label { font: 500 12px var(--f-mono); letter-spacing: .3em; text-transform: uppercase; color: var(--text-3); }
    .preloader__bar { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
    .preloader__bar i { display: block; height: 100%; background: var(--grad); transform-origin: left; transition: transform .1s linear; }

    .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; background: var(--grad);
      transform-origin: left; box-shadow: 0 0 12px var(--accent); }

    .toast { position: fixed; left: 50%; bottom: 32px; z-index: 950; transform: translateX(-50%);
      padding: 14px 22px; border-radius: 99px; background: var(--text); color: var(--bg); font-weight: 600; font-size: 15px;
      box-shadow: 0 20px 60px -10px rgba(0,0,0,.5); animation: toast .5s var(--ease) both; white-space: nowrap; }
    @keyframes toast { from { opacity: 0; transform: translate(-50%, 20px) scale(.95); } }
  `],
})
export class AppComponent implements OnInit {
  readonly ui = inject(UiService);
  readonly progress = signal(0);
  readonly loaded = signal(false);
  readonly scroll = signal(0);

  private konami: string[] = [];

  ngOnInit(): void {
    if (prefersReducedMotion()) {
      this.progress.set(100);
      this.loaded.set(true);
      return;
    }
    document.body.classList.add('no-scroll');
    const timer = setInterval(() => {
      const next = Math.min(100, this.progress() + Math.ceil(Math.random() * 9));
      this.progress.set(next);
      if (next === 100) {
        clearInterval(timer);
        setTimeout(() => {
          this.loaded.set(true);
          document.body.classList.remove('no-scroll');
        }, 250);
      }
    }, 45);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scroll.set(max > 0 ? window.scrollY / max : 0);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    this.konami = [...this.konami, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
    if (this.konami.join() === KONAMI.join()) {
      this.ui.party.update((v) => !v);
      this.ui.notify(this.ui.party() ? '🎉 Party mode unlocked' : 'Party’s over — back to work');
      this.konami = [];
    }
  }
}
