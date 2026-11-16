import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { UiService, prefersReducedMotion } from '../../core/uiService';

const ROW_A = ['Pipelines', 'Warehouses', 'Data Lakes', 'Streaming', 'Governance', 'Analytics', 'Reliability'];
const ROW_B = ['Python', 'SQL', 'Apache Spark', 'BigQuery', 'Dataform', 'Snowflake', 'Databricks', 'Looker', 'Azure', 'GCP'];

/** Two counter-scrolling bands. They speed up with scroll velocity, flip direction with scroll direction,
 *  slow down on hover, and every tech word is clickable. */
@Component({
  selector: 'app-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="band" (pointerenter)="hover = true" (pointerleave)="hover = false">
      <div class="row row--a" aria-hidden="true">
        <div #sliderA class="slider">
          @for (copy of [0, 1, 2]; track copy) {
            <div class="track">
              @for (w of rowA; track w) { <span class="word">{{ w }}</span><span class="star">✦</span> }
            </div>
          }
        </div>
      </div>
      <div class="row row--b">
        <div #sliderB class="slider">
          @for (copy of [0, 1, 2]; track copy) {
            <div class="track" [attr.aria-hidden]="copy > 0">
              @for (w of rowB; track w) {
                <button class="word word--mono" (click)="ui.selectSkill(w)" [attr.tabindex]="copy > 0 ? -1 : 0"
                        data-cursor="see">{{ w }}</button><span class="dot" aria-hidden="true">●</span>
              }
            </div>
          }
        </div>
      </div>
      <span class="hint" aria-hidden="true">scroll to speed up · click a tool</span>
    </div>
  `,
  styles: [`
    .band { position: relative; padding: 40px 0; overflow: hidden; transform: rotate(-2deg) scale(1.04); }
    .row { overflow: hidden; }
    .row--a { background: var(--text); color: var(--bg); padding: 18px 0; }
    .row--b { padding: 12px 0; border-block: 1px solid var(--border); background: color-mix(in srgb, var(--bg) 80%, transparent); }
    .slider { display: flex; width: max-content; will-change: transform; }
    .track { display: flex; align-items: center; gap: 36px; padding-right: 36px; }
    .word { font: 800 clamp(28px, 4.5vw, 56px)/1 var(--f-display); letter-spacing: -.02em; white-space: nowrap; text-transform: uppercase; }
    .word--mono { font: 500 clamp(16px, 2vw, 22px)/1 var(--f-mono); text-transform: none; color: var(--text-2);
      padding: 8px 14px; border-radius: 99px; border: 1px solid transparent; transition: color .3s, background .3s, border-color .3s; }
    .word--mono:hover { color: var(--bg); background: var(--text); }
    .star { font-size: clamp(20px, 3vw, 36px); color: var(--accent); display: inline-block; }
    .dot { font-size: 8px; color: var(--accent-2); }
    .hint { position: absolute; right: 24px; bottom: 10px; font: 11px var(--f-mono); letter-spacing: .12em; text-transform: uppercase;
      color: var(--text-3); opacity: 0; transition: opacity .4s; }
    .band:hover .hint { opacity: 1; }
  `],
})
export class MarqueeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sliderA', { static: true }) rowA$!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderB', { static: true }) rowB$!: ElementRef<HTMLDivElement>;

  readonly ui = inject(UiService);
  private readonly zone = inject(NgZone);

  readonly rowA = ROW_A;
  readonly rowB = ROW_B;
  hover = false;

  private raf = 0;
  private onScroll = () => {};

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;
    this.zone.runOutsideAngular(() => {
      const a = this.rowA$.nativeElement;
      const b = this.rowB$.nativeElement;
      let xa = 0;
      let xb = 0;
      let dir = 1;
      let boost = 0;
      let speed = 1;
      let lastY = window.scrollY;

      this.onScroll = () => {
        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        if (dy !== 0) dir = dy > 0 ? 1 : -1;
        boost = Math.min(30, boost + Math.abs(dy) * 0.25);
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });

      const wrap = (x: number, w: number) => (x <= -w ? x + w : x > 0 ? x - w : x);
      const stars = a.querySelectorAll<HTMLElement>('.star');

      const loop = () => {
        speed += ((this.hover ? 0.15 : 1) - speed) * 0.08;
        boost *= 0.92;
        const v = (1 + boost) * speed * dir;
        const wa = (a.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
        const wb = (b.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
        if (wa) xa = wrap(xa - v, wa);
        if (wb) xb = wrap(xb + v * 0.8, wb);
        a.style.transform = `translate3d(${xa}px,0,0)`;
        b.style.transform = `translate3d(${xb}px,0,0)`;
        const spin = `rotate(${xa * 0.8}deg)`;
        stars.forEach((s) => (s.style.transform = spin));
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('scroll', this.onScroll);
  }
}
