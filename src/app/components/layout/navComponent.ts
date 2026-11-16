import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, afterNextRender, effect, inject, signal } from '@angular/core';
import { UiService } from '../../core/uiService';
import { PROFILE } from '../../data/profileData';
import { MagneticDirective } from '../../directives/magneticDirective';

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav" [class.scrolled]="scrolled()" [class.hidden]="hidden()">
      <a class="logo" href="#top" (click)="go($event, 'top')" aria-label="Back to top">
        <span class="logo__mark">K</span>
        <span class="logo__text">ketro<b>.</b>sithole</span>
      </a>

      <nav class="links" aria-label="Primary">
        @for (l of links; track l.id) {
          <a [href]="'#' + l.id" (click)="go($event, l.id)" [class.active]="active() === l.id">{{ l.label }}</a>
        }
      </nav>

      <div class="actions">
        <button magnetic class="kbd" (click)="ui.paletteOpen.set(true)" aria-label="Open command palette">
          <span>⌘</span>K
        </button>
        <button magnetic class="icon" (click)="ui.toggleTheme()"
                [attr.aria-label]="'Switch to ' + (ui.theme() === 'dark' ? 'light' : 'dark') + ' theme'">
          <span class="sun-moon" [class.light]="ui.theme() === 'light'"></span>
        </button>
        <button class="burger" [class.x]="menuOpen()" (click)="menuOpen.set(!menuOpen())"
                [attr.aria-expanded]="menuOpen()" aria-label="Toggle menu">
          <i></i><i></i>
        </button>
      </div>
    </header>

    <nav class="mobile" [class.open]="menuOpen()" [attr.aria-hidden]="!menuOpen()" aria-label="Mobile">
      @for (l of links; track l.id) {
        <a [href]="'#' + l.id" (click)="go($event, l.id)" [style.--i]="$index"
           [attr.tabindex]="menuOpen() ? 0 : -1">
          <span class="idx">0{{ $index + 1 }}</span>{{ l.label }}
        </a>
      }
      <p class="mobile__foot">{{ email }}</p>
    </nav>
  `,
  styles: [`
    .nav {
      position: fixed; top: 16px; left: 50%; z-index: 50;
      width: min(calc(100% - 32px), 1180px);
      transform: translateX(-50%);
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 10px 10px 10px 18px;
      border-radius: 99px;
      border: 1px solid transparent;
      transition: background .5s var(--ease), border-color .5s, transform .6s var(--ease), backdrop-filter .5s;
    }
    .nav.scrolled {
      background: color-mix(in srgb, var(--bg) 65%, transparent);
      border-color: var(--border);
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
    }
    .nav.hidden { transform: translate(-50%, -140%); }

    .logo { display: flex; align-items: center; gap: 10px; font-weight: 600; }
    .logo__mark {
      display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px;
      background: var(--grad); color: #fff; font: 800 18px var(--f-display);
      transition: transform .6s var(--ease);
    }
    .logo:hover .logo__mark { transform: rotate(-12deg) scale(1.08); }
    .logo__text { font-family: var(--f-mono); font-size: 14px; letter-spacing: -.02em; }
    .logo__text b { color: var(--accent-2); }

    .links { display: flex; gap: 4px; }
    .links a {
      position: relative; padding: 8px 14px; border-radius: 99px; font-size: 14px; color: var(--text-2);
      transition: color .3s, background .3s;
    }
    .links a:hover { color: var(--text); background: var(--surface-2); }
    .links a.active { color: var(--text); }
    .links a.active::after {
      content: ''; position: absolute; left: 50%; bottom: 2px; width: 4px; height: 4px; border-radius: 50%;
      background: var(--accent-2); transform: translateX(-50%); box-shadow: 0 0 10px var(--accent-2);
    }
    .mobile {
      position: fixed; inset: 0; z-index: 49; display: none;
      flex-direction: column; justify-content: center; gap: 6px; padding: 0 32px;
      background: var(--bg);
      clip-path: circle(0% at calc(100% - 44px) 44px);
      transition: clip-path .8s var(--ease);
    }
    .mobile.open { clip-path: circle(150% at calc(100% - 44px) 44px); }
    .mobile a {
      font: 800 clamp(40px, 11vw, 64px)/1.1 var(--f-display); letter-spacing: -.03em;
      opacity: 0; transform: translateY(30px);
      transition: opacity .6s var(--ease), transform .6s var(--ease);
      transition-delay: calc(var(--i) * 60ms + 150ms);
    }
    .mobile.open a { opacity: 1; transform: none; }
    .idx { font: 500 13px var(--f-mono); color: var(--accent-2); margin-right: 14px; vertical-align: top; }
    .mobile__foot { margin-top: 32px; font: 13px var(--f-mono); color: var(--text-3); }

    .actions { display: flex; align-items: center; gap: 6px; }
    .kbd, .icon {
      height: 40px; min-width: 40px; padding: 0 12px; border-radius: 99px; border: 1px solid var(--border);
      display: inline-flex; align-items: center; justify-content: center; gap: 2px;
      font: 500 13px var(--f-mono); color: var(--text-2); background: var(--surface);
      transition: transform .3s var(--ease), color .3s, border-color .3s;
    }
    .kbd:hover, .icon:hover { color: var(--text); border-color: var(--border-strong); }

    .sun-moon {
      width: 16px; height: 16px; border-radius: 50%;
      box-shadow: inset -5px -3px 0 0 var(--text);
      transition: box-shadow .5s var(--ease), transform .5s var(--ease);
      transform: rotate(-20deg);
    }
    .sun-moon.light { box-shadow: inset 0 0 0 8px var(--text); transform: scale(.65); }

    .burger { display: none; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); position: relative; }
    .burger i { position: absolute; left: 12px; right: 12px; height: 1.5px; background: var(--text); transition: transform .4s var(--ease); }
    .burger i:first-child { top: 16px; } .burger i:last-child { top: 22px; }
    .burger.x i:first-child { transform: translateY(3px) rotate(45deg); }
    .burger.x i:last-child { transform: translateY(-3px) rotate(-45deg); }

    @media (max-width: 860px) {
      .burger { display: block; }
      .kbd, .links { display: none; }
      .mobile { display: flex; }
    }
  `],
})
export class NavComponent implements OnDestroy {
  readonly ui = inject(UiService);
  readonly links = NAV_LINKS;
  readonly email = PROFILE.email;
  readonly scrolled = signal(false);
  readonly hidden = signal(false);
  readonly active = signal('');
  readonly menuOpen = signal(false);

  private lastY = 0;
  private io?: IntersectionObserver;

  constructor() {
    let wasOpen = false;
    effect(() => {
      const open = this.menuOpen();
      if (open || wasOpen) document.body.classList.toggle('no-scroll', open);
      wasOpen = open;
    });

    afterNextRender(() => {
      this.io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && this.active.set(e.target.id)),
        { rootMargin: '-45% 0px -50% 0px' },
      );
      this.links.forEach((l) => {
        const el = document.getElementById(l.id);
        if (el) this.io!.observe(el);
      });
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 40);
    this.hidden.set(y > 600 && y > this.lastY && !this.menuOpen());
    this.lastY = y;
  }

  go(e: Event, id: string): void {
    e.preventDefault();
    this.menuOpen.set(false);
    this.ui.scrollTo(id);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
