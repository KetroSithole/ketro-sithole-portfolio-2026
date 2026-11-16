import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../../data/profileData';
import { RevealDirective } from '../../directives/revealDirective';
import { CountUpDirective } from '../../directives/countUpDirective';
import { TiltDirective } from '../../directives/tiltDirective';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, CountUpDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">01 — About</span>
          <h2 class="h2">Where <em>data</em> meets<br /><span class="outline">decisions.</span></h2>
        </div>

        <div class="grid">
          <div class="copy">
            <p class="big" reveal>
              I build the platforms between <mark class="m1">raw records</mark> and the <mark class="m2">people</mark> who rely on them —
              pipelines that are <i>secure</i>, <i class="i2">scalable</i> and <i class="i3">boringly reliable</i>.
            </p>
            @for (para of p.about; track $index) {
              <p class="para" reveal [revealDelay]="120 * ($index + 1)">{{ para }}</p>
            }

            <div class="principles" reveal [revealDelay]="300">
              @for (pr of principles; track pr.t) {
                <div class="pr" [style.--c]="pr.c">
                  <span class="pr__n">{{ pr.n }}</span>
                  <div><b>{{ pr.t }}</b><span>{{ pr.d }}</span></div>
                </div>
              }
            </div>
          </div>

          <div class="stats">
            @for (s of p.stats; track s.label) {
              <button class="stat" [style.--c]="colors[$index % colors.length]" tilt [tiltMax]="6" reveal [revealDelay]="$index * 110"
                      (click)="counter.play(); burst($event)" data-cursor="replay" [attr.aria-label]="s.label + ' — replay'">
                <span class="stat__dot" aria-hidden="true"></span>
                <span class="stat__num" [countTo]="s.value" [countSuffix]="s.suffix"
                      [countPrefix]="s.prefix ?? ''" #counter="countUp"></span>
                <span class="stat__label">{{ s.label }}</span>
                <span class="stat__glare"></span>
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(40px, 6vw, 96px); align-items: start; }
    .big { font-size: clamp(24px, 2.8vw, 38px); line-height: 1.25; letter-spacing: -.02em; margin: 0 0 32px; font-weight: 500; }
    .big { isolation: isolate; }
    .big mark { color: #fff; white-space: nowrap; padding: 0 .18em; border-radius: .2em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
    .big mark.m1 { background: linear-gradient(120deg, var(--accent), color-mix(in srgb, var(--accent) 60%, var(--accent-3))); }
    .big mark.m2 { background: linear-gradient(120deg, var(--accent-2), color-mix(in srgb, var(--accent-2) 60%, var(--accent))); color: #04140f; }
    .big i { font-family: var(--f-display); font-style: normal; color: var(--accent-2); }
    .big i.i2 { color: var(--accent); }
    .big i.i3 { color: var(--accent-3); }
    .para { color: var(--text); opacity: .82; margin: 0 0 20px; max-width: 620px; }

    .principles { margin-top: 40px; display: grid; gap: 10px; }
    .pr { position: relative; display: flex; gap: 20px; padding: 20px 24px; border-radius: 16px; overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
      background: color-mix(in srgb, var(--c) 10%, transparent); transition: transform .4s var(--ease), background .3s; }
    .pr::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); box-shadow: 0 0 16px var(--c); }
    .pr:hover { transform: translateX(6px); background: color-mix(in srgb, var(--c) 18%, transparent); }
    .pr__n { font: 700 13px var(--f-mono); color: var(--c); padding-top: 3px; }
    .pr b { display: block; font-weight: 700; }
    .pr span:not(.pr__n) { color: var(--text-2); font-size: 15px; }

    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; position: sticky; top: 120px; }
    .stat:active { scale: .97; }
    .stat:hover { border-color: var(--c); box-shadow: 0 20px 60px -20px var(--c); }
    :host ::ng-deep .ripple { position: absolute; width: 20px; height: 20px; margin: -10px 0 0 -10px; border-radius: 50%;
      background: var(--c, var(--accent-2)); pointer-events: none; animation: ripple .8s var(--ease) forwards; }
    @keyframes ripple { to { transform: scale(30); opacity: 0; } }
    .stat {
      text-align: left; transition: border-color .3s, box-shadow .4s, scale .2s;
      position: relative; overflow: hidden; aspect-ratio: 1; padding: 24px; border-radius: var(--radius);
      border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
      background:
        radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--c) 30%, transparent), transparent 60%),
        color-mix(in srgb, var(--c) 8%, var(--bg-2));
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .stat__dot { position: absolute; top: 20px; right: 20px; width: 10px; height: 10px; border-radius: 50%;
      background: var(--c); box-shadow: 0 0 14px var(--c); }
    .stat__num { font: 800 clamp(44px, 6vw, 80px)/1 var(--f-display); letter-spacing: -.04em; color: var(--c);
      text-shadow: 0 0 40px color-mix(in srgb, var(--c) 45%, transparent); }
    .stat__label { color: var(--text); opacity: .85; font-size: 14px; font-weight: 500; }
    .stat__glare { position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(300px circle at var(--mx, -100%) var(--my, -100%), rgba(255,255,255,.1), transparent 50%); }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .stats { position: static; }
    }
    @media (max-width: 420px) { .stat { aspect-ratio: auto; min-height: 150px; } }
  `],
})
export class AboutComponent {
  readonly p = PROFILE;
  /** One accent per stat card — kept bright enough to read in both themes. */
  readonly colors = ['#8b6dff', '#00d4b8', '#ff4d8d', '#ffb020'];
  readonly principles = [
    { n: '01', t: 'Trust is the product', d: 'Governed, tested, auditable data — or it isn’t done.', c: '#8b6dff' },
    { n: '02', t: 'Automate the boring parts', d: 'CI/CD, orchestration and monitoring before heroics.', c: '#00d4b8' },
    { n: '03', t: 'Built to scale and to last', d: 'Clean models and pipelines the next engineer can own.', c: '#ff4d8d' },
  ];

  /** Paints a ripple from the click point inside the stat card. */
  burst(e: MouseEvent): void {
    const card = e.currentTarget as HTMLElement;
    const r = card.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = `${e.clientX - r.left}px`;
    dot.style.top = `${e.clientY - r.top}px`;
    dot.style.opacity = '0.35';
    card.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
  }
}
