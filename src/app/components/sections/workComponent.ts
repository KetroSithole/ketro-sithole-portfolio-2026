import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { CASE_STUDIES } from '../../data/profileData';
import { UiService } from '../../core/uiService';
import { RevealDirective } from '../../directives/revealDirective';
import { TiltDirective } from '../../directives/tiltDirective';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="work" class="section">
      <div class="container">
        <div class="section-head head" reveal>
          <div>
            <span class="eyebrow">03 — Selected work</span>
            <h2 class="h2">Things I’ve<br /><em>shipped.</em></h2>
          </div>
          <p class="head__note">Case studies from banking, retail and research. <b>Click any tile</b> to open the full story.</p>
        </div>

        <div class="bento">
          @for (c of cases; track c.id; let i = $index) {
            <article [class]="'tile tile--' + c.size" [style.--h]="c.hue" reveal [revealDelay]="(i % 3) * 120">
              <div class="tile__inner" tilt [tiltMax]="5" data-cursor="open"
                   role="button" tabindex="0" [attr.aria-label]="'Open case study: ' + c.title"
                   (click)="open(i)" (keydown.enter)="open(i)" (keydown.space)="$event.preventDefault(); open(i)">
                <div class="mesh" aria-hidden="true"><i></i><i></i><i></i></div>
                <div class="grid-lines" aria-hidden="true"></div>

                <header class="tile__top">
                  <span class="num">0{{ i + 1 }}</span>
                  <span class="year">{{ c.year }}</span>
                </header>

                <div class="tile__body">
                  <span class="client">{{ c.client }}</span>
                  <h3>{{ c.title }}</h3>
                  <p class="blurb">{{ c.blurb }}</p>
                  <div class="foot">
                    <span class="impact">{{ c.impact }}</span>
                    <div class="tags">
                      @for (t of c.tags; track t) { <span class="chip">{{ t }}</span> }
                    </div>
                  </div>
                </div>

                <span class="go" aria-hidden="true">↗</span>
                <span class="glare" aria-hidden="true"></span>
              </div>
            </article>
          }
        </div>
      </div>

      @if (current(); as c) {
        <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="c.title" [style.--h]="c.hue">
          <div class="modal__backdrop" (click)="close()"></div>
          <div class="modal__panel">
            <div class="modal__hero">
              <div class="mesh" aria-hidden="true"><i></i><i></i><i></i></div>
              <button class="close" (click)="close()" aria-label="Close case study">✕</button>
              <span class="client">{{ c.client }} · {{ c.year }}</span>
              <h3 class="modal__title">{{ c.title }}</h3>
              <p class="modal__impact">{{ c.impact }}</p>
            </div>

            <div class="modal__body">
              <div class="block block--intro"><p>{{ c.blurb }}</p></div>
              <div class="block">
                <h4><span>01</span>Challenge</h4>
                <p>{{ c.challenge }}</p>
              </div>
              <div class="block">
                <h4><span>02</span>Approach</h4>
                <ol>
                  @for (a of c.approach; track a; let j = $index) {
                    <li [style.--i]="j">{{ a }}</li>
                  }
                </ol>
              </div>
              <div class="block">
                <h4><span>03</span>Outcome</h4>
                <p class="outcome">{{ c.outcome }}</p>
              </div>
              <div class="block">
                <h4><span>04</span>Stack <small>click a tool to see where else I’ve used it</small></h4>
                <div class="tags">
                  @for (t of c.tags; track t) {
                    <button class="chip chip--btn" (click)="pickSkill(t)">{{ t }}</button>
                  }
                </div>
              </div>
            </div>

            <nav class="modal__nav" aria-label="Case studies">
              <button (click)="step(-1)"><span class="k">←</span> {{ neighbour(-1).title }}</button>
              <span class="count">{{ (index() ?? 0) + 1 }} / {{ cases.length }}</span>
              <button (click)="step(1)">{{ neighbour(1).title }} <span class="k">→</span></button>
            </nav>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: end; gap: 32px; flex-wrap: wrap; }
    .head__note { max-width: 380px; color: var(--text-2); margin: 0; }
    .head__note b { color: var(--text); }

    .bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(260px, auto); gap: 16px; }
    .tile--xl { grid-column: span 3; grid-row: span 2; }
    .tile--tall { grid-column: span 1; grid-row: span 2; }
    .tile--wide { grid-column: span 2; }
    .tile--sq { grid-column: span 1; }
    .tile { display: flex; }

    .tile__inner {
      position: relative; flex: 1; overflow: hidden; isolation: isolate; cursor: pointer;
      border-radius: calc(var(--radius) + 4px); border: 1px solid var(--border);
      background: hsl(var(--h) 40% 8% / .6);
      padding: 24px; display: flex; flex-direction: column; justify-content: space-between;
      transform-style: preserve-3d; transition: border-color .4s;
    }
    .tile__inner:hover, .tile__inner:focus-visible { border-color: hsl(var(--h) 80% 65% / .6); }
    .tile__inner:active { scale: .985; }
    :host-context([data-theme='light']) .tile__inner { background: hsl(var(--h) 60% 96%); }

    .mesh { position: absolute; inset: 0; z-index: -2; opacity: .55; transition: opacity .6s, transform 1.2s var(--ease); }
    .mesh i { position: absolute; border-radius: 50%; filter: blur(50px); }
    .mesh i:nth-child(1) { width: 70%; height: 70%; right: -20%; top: -25%; background: hsl(var(--h) 90% 60%); animation: drift 14s ease-in-out infinite alternate; }
    .mesh i:nth-child(2) { width: 50%; height: 50%; left: -10%; bottom: -20%; background: hsl(calc(var(--h) + 60) 90% 55%); animation: drift 18s ease-in-out infinite alternate-reverse; }
    .mesh i:nth-child(3) { width: 30%; height: 30%; left: 40%; top: 30%; background: hsl(calc(var(--h) - 40) 90% 65%); opacity: .6; animation: drift 11s ease-in-out infinite alternate; }
    .tile__inner:hover .mesh { opacity: .9; transform: scale(1.15); }

    .grid-lines { position: absolute; inset: 0; z-index: -1; opacity: .25;
      background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 40px 40px; mask-image: radial-gradient(ellipse at 70% 20%, #000 10%, transparent 70%); }

    .tile__top { display: flex; justify-content: space-between; font: 500 13px var(--f-mono); color: var(--text-2); }
    .num { color: var(--text); }

    .client { font: 500 12px var(--f-mono); text-transform: uppercase; letter-spacing: .12em; color: hsl(var(--h) 90% 75%); }
    :host-context([data-theme='light']) .client { color: hsl(var(--h) 70% 38%); }
    h3 { margin: 10px 0 0; font: 800 clamp(24px, 2.6vw, 34px)/1.05 var(--f-display); letter-spacing: -.03em; }
    .tile--xl h3 { font-size: clamp(36px, 5.2vw, 76px); }
    .blurb { margin: 14px 0 0; color: var(--text-2); font-size: 15px; max-width: 520px;
      max-height: 0; opacity: 0; overflow: hidden; transition: max-height .7s var(--ease), opacity .5s; }
    .tile--xl .blurb, .tile--wide .blurb, .tile--tall .blurb, .tile__inner:hover .blurb { max-height: 200px; opacity: 1; }
    .tile--xl .blurb { font-size: 17px; }

    .foot { margin-top: 18px; display: flex; flex-direction: column; gap: 12px; }
    .impact { font: 600 14px var(--f-mono); color: var(--text); }
    .impact::before { content: '▲ '; color: var(--accent-2); }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }

    .go { position: absolute; top: 20px; right: 20px; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center;
      background: var(--text); color: var(--bg); font-size: 22px; transform: scale(0) rotate(-90deg); transition: transform .6s var(--ease); }
    .tile__inner:hover .go, .tile__inner:focus-visible .go { transform: scale(1) rotate(0); }
    .tile__inner:hover .year { opacity: 0; }
    .year { transition: opacity .3s; }

    .glare { position: absolute; inset: 0; pointer-events: none; z-index: 2;
      background: radial-gradient(420px circle at var(--mx, -100%) var(--my, -100%), rgba(255,255,255,.12), transparent 45%); }

    /* ── Case-study modal ─────────────────────────── */
    .modal { position: fixed; inset: 0; z-index: 800; display: flex; justify-content: flex-end; }
    .modal__backdrop { position: absolute; inset: 0; background: color-mix(in srgb, var(--bg) 60%, transparent);
      backdrop-filter: blur(10px); animation: fade .4s ease both; }
    .modal__panel { position: relative; width: min(760px, 100%); height: 100%; overflow-y: auto; overscroll-behavior: contain;
      background: var(--bg-2); border-left: 1px solid var(--border-strong);
      box-shadow: -40px 0 120px -20px rgba(0,0,0,.6); animation: slide .7s var(--ease) both;
      display: flex; flex-direction: column; }
    .modal__hero { position: relative; isolation: isolate; overflow: hidden; padding: 96px 40px 40px; border-bottom: 1px solid var(--border);
      background: hsl(var(--h) 40% 10% / .7); }
    :host-context([data-theme='light']) .modal__hero { background: hsl(var(--h) 60% 94%); }
    .modal__hero .mesh { opacity: .8; }
    .modal__title { font-size: clamp(40px, 6vw, 72px); margin-top: 12px; animation: up .8s var(--ease) both .15s; }
    .modal__impact { margin: 16px 0 0; font: 600 15px var(--f-mono); }
    .modal__impact::before { content: '▲ '; color: var(--accent-2); }
    .close { position: absolute; top: 24px; right: 24px; width: 48px; height: 48px; border-radius: 50%;
      background: var(--text); color: var(--bg); font-size: 18px; transition: transform .5s var(--ease); }
    .close:hover { transform: rotate(90deg) scale(1.08); }

    .modal__body { padding: 16px 40px 40px; flex: 1; }
    .block { padding: 28px 0; border-bottom: 1px solid var(--border); animation: up .8s var(--ease) both; }
    .block:nth-child(2) { animation-delay: .2s; } .block:nth-child(3) { animation-delay: .28s; }
    .block:nth-child(4) { animation-delay: .36s; } .block:nth-child(5) { animation-delay: .44s; }
    .block:last-child { border-bottom: 0; }
    .block--intro p { font-size: clamp(19px, 2vw, 23px); line-height: 1.45; color: var(--text); margin: 0; }
    h4 { margin: 0 0 14px; font: 500 13px var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-2);
      display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
    h4 span { color: hsl(var(--h) 90% 70%); }
    h4 small { letter-spacing: 0; text-transform: none; color: var(--text-3); font-size: 12px; }
    .block p { margin: 0; color: var(--text-2); }
    .outcome { color: var(--text) !important; font-size: 18px; }
    ol { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; counter-reset: s; }
    ol li { counter-increment: s; position: relative; padding: 14px 16px 14px 52px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); }
    ol li::before { content: counter(s); position: absolute; left: 14px; top: 13px; width: 26px; height: 26px; border-radius: 50%;
      display: grid; place-items: center; font: 600 12px var(--f-mono); background: hsl(var(--h) 80% 60%); color: #fff; }
    .chip--btn { cursor: pointer; font-size: 13px; padding: 8px 14px; transition: background .3s, color .3s, border-color .3s, transform .3s var(--ease); }
    .chip--btn:hover { background: var(--text); color: var(--bg); border-color: var(--text); transform: translateY(-2px); }

    .modal__nav { position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 16px 24px; border-top: 1px solid var(--border); background: color-mix(in srgb, var(--bg-2) 85%, transparent); backdrop-filter: blur(12px); }
    .modal__nav button { padding: 10px 16px; border-radius: 99px; border: 1px solid var(--border); font-size: 14px; font-weight: 500;
      max-width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background .3s, border-color .3s; }
    .modal__nav button:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .k { color: var(--accent-2); }
    .count { font: 13px var(--f-mono); color: var(--text-3); }

    @keyframes drift { to { transform: translate(-20%, 15%) scale(1.2); } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes slide { from { transform: translateX(100%); } }
    @keyframes up { from { opacity: 0; transform: translateY(24px); } }

    @media (max-width: 1024px) {
      .bento { grid-template-columns: repeat(2, 1fr); }
      .tile--xl, .tile--wide { grid-column: span 2; }
      .tile--xl { grid-row: span 1; min-height: 420px; }
      .tile--tall { grid-row: span 1; }
    }
    @media (max-width: 620px) {
      .bento { grid-template-columns: 1fr; }
      .tile--xl, .tile--wide, .tile--tall, .tile--sq { grid-column: span 1; }
      .blurb { max-height: 200px; opacity: 1; }
      .modal__hero { padding: 88px 20px 28px; }
      .modal__body { padding: 8px 20px 24px; }
      .modal__nav { padding: 12px 16px; }
    }
  `],
})
export class WorkComponent {
  private readonly ui = inject(UiService);

  readonly cases = CASE_STUDIES;
  readonly index = signal<number | null>(null);
  readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : this.cases[i];
  });

  constructor() {
    let wasOpen = false;
    effect(() => {
      const isOpen = this.index() !== null;
      if (isOpen || wasOpen) document.body.classList.toggle('no-scroll', isOpen);
      wasOpen = isOpen;
    });
  }

  open(i: number): void {
    this.index.set(i);
  }

  close(): void {
    this.index.set(null);
  }

  step(dir: 1 | -1): void {
    const i = this.index();
    if (i === null) return;
    this.index.set((i + dir + this.cases.length) % this.cases.length);
    document.querySelector('.modal__panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  neighbour(dir: 1 | -1) {
    const i = this.index() ?? 0;
    return this.cases[(i + dir + this.cases.length) % this.cases.length];
  }

  pickSkill(name: string): void {
    this.close();
    setTimeout(() => this.ui.selectSkill(name), 50);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.index() === null || this.ui.paletteOpen()) return;
    if (e.key === 'Escape') this.close();
    else if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'ArrowLeft') this.step(-1);
  }
}
