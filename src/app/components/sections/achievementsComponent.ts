import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ACHIEVEMENTS, EDUCATION } from '../../data/profileData';
import { RevealDirective } from '../../directives/revealDirective';
import { TiltDirective } from '../../directives/tiltDirective';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="awards" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">05 — Recognition</span>
          <h2 class="h2">Proof, <span class="outline">not</span><br /><em>promises.</em></h2>
        </div>

        <div class="awards">
          @for (a of awards; track a.label; let i = $index) {
            <div class="award-wrap" reveal [revealDelay]="i * 100">
              <button class="award" tilt [tiltMax]="8" [class.flipped]="flipped().has(i)" (click)="flip(i)"
                      [attr.aria-pressed]="flipped().has(i)" [attr.data-cursor]="flipped().has(i) ? 'back' : 'flip'">
                <span class="award__inner">
                  <span class="face front">
                    <span class="award__big">{{ a.big }}</span>
                    <span>
                      <span class="award__label">{{ a.label }}</span>
                      <span class="award__meta">{{ a.meta }}</span>
                    </span>
                    <span class="flip-hint" aria-hidden="true">↻</span>
                    <span class="shine" aria-hidden="true"></span>
                  </span>
                  <span class="face back">
                    <span class="back__big" aria-hidden="true">{{ a.big }}</span>
                    <span class="back__text">{{ a.back }}</span>
                    <span class="award__meta">{{ a.meta }}</span>
                  </span>
                </span>
              </button>
            </div>
          }
        </div>

        <div class="edu" reveal>
          <h3 class="edu__title">Education &amp; certification</h3>
          <ul>
            @for (e of education; track e.title) {
              <li>
                <span class="edu__name">{{ e.title }}</span>
                <span class="edu__place">{{ e.place }}</span>
                <span class="edu__detail">{{ e.detail }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .awards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .award-wrap { display: flex; }
    .award { flex: 1; display: grid; min-height: 260px; padding: 0; text-align: left; perspective: 1200px; }
    .award__inner { display: grid; transform-style: preserve-3d; transition: transform .9s var(--ease); }
    .award.flipped .award__inner { transform: rotateY(180deg); }
    .face { grid-area: 1 / 1; position: relative; overflow: hidden; isolation: isolate; padding: 26px; border-radius: var(--radius);
      border: 1px solid var(--border); background: var(--surface); backface-visibility: hidden; -webkit-backface-visibility: hidden;
      display: flex; flex-direction: column; justify-content: space-between; gap: 16px; }
    .front::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0; transition: opacity .5s;
      background: radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 60%); }
    .award:hover .front::before { opacity: 1; }
    .back { transform: rotateY(180deg); background: var(--grad); border-color: transparent; color: #fff; }
    .back .award__meta { color: rgba(255,255,255,.75); }
    .back__big { position: absolute; right: -10px; bottom: -24px; font: 800 120px/1 var(--f-display); opacity: .15; letter-spacing: -.05em; z-index: -1; }
    .back__text { font-size: 17px; font-weight: 500; line-height: 1.45; }
    .award__big { font: 800 clamp(44px, 5vw, 68px)/1 var(--f-display); letter-spacing: -.04em;
      background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .award__label { display: block; font-weight: 600; font-size: 18px; line-height: 1.3; }
    .award__meta { display: block; margin-top: 6px; font: 12px var(--f-mono); color: var(--text-3); }
    .flip-hint { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
      border: 1px solid var(--border-strong); color: var(--text-2); font-size: 14px; transition: transform .6s var(--ease), background .3s, color .3s; }
    .award:hover .flip-hint { transform: rotate(180deg); background: var(--text); color: var(--bg); }
    .shine { position: absolute; top: 0; left: -60%; width: 40%; height: 100%; pointer-events: none;
      background: linear-gradient(100deg, transparent, rgba(255,255,255,.12), transparent); transform: skewX(-20deg);
      transition: left .9s var(--ease); }
    .award:hover .shine { left: 130%; }

    .edu { margin-top: 64px; border-top: 1px solid var(--border); }
    .edu__title { font: 500 13px var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-3); margin: 28px 0 8px; }
    ul { list-style: none; margin: 0; padding: 0; }
    li { display: grid; grid-template-columns: 1.4fr 1fr 1.4fr; gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--border);
      align-items: baseline; transition: padding .4s var(--ease), background .4s; }
    li:hover { padding-left: 16px; background: linear-gradient(90deg, var(--surface-2), transparent); }
    .edu__name { font: 700 clamp(17px, 1.8vw, 22px) var(--f-display); }
    .edu__place { color: var(--accent-2); font-size: 15px; }
    .edu__detail { color: var(--text-2); font-size: 15px; }

    @media (max-width: 1024px) { .awards { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 680px) {
      li { grid-template-columns: 1fr; gap: 4px; }
      .award { min-height: 200px; }
    }
    @media (max-width: 460px) { .awards { grid-template-columns: 1fr; } }
  `],
})
export class AchievementsComponent {
  readonly awards = ACHIEVEMENTS;
  readonly education = EDUCATION;
  readonly flipped = signal<ReadonlySet<number>>(new Set());

  flip(i: number): void {
    this.flipped.update((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }
}
