import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { EXPERIENCE } from '../../data/profileData';
import { UiService } from '../../core/uiService';
import { RevealDirective } from '../../directives/revealDirective';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">02 — Experience</span>
          <h2 class="h2">The <em>journey</em><br /><span class="outline">so far.</span></h2>
        </div>

        <ol #timeline class="timeline" [style.--fill]="fill()">
          @for (job of jobs; track job.period; let i = $index) {
            <li class="item" reveal [class.open]="openIndex() === i">
              <span class="node"></span>
              <div class="meta">
                <span class="period">{{ job.period }}</span>
                <span class="type">{{ job.type }}</span>
              </div>
              <div class="card">
                <button class="card__toggle" (click)="toggle(i)" [attr.aria-expanded]="openIndex() === i"
                        [attr.data-cursor]="openIndex() === i ? 'close' : 'open'">
                  <div class="card__head">
                    <div>
                      <h3>{{ job.role }}</h3>
                      <p class="company">{{ job.company }}</p>
                    </div>
                    <span class="plus" aria-hidden="true"></span>
                  </div>
                  <p class="summary">{{ job.summary }}</p>
                  <div class="details">
                    <div>
                      <ul>
                        @for (h of job.highlights; track h) { <li>{{ h }}</li> }
                      </ul>
                    </div>
                  </div>
                </button>
                <div class="tags">
                  @for (t of job.tags; track t) {
                    <button class="chip chip--btn" (click)="ui.selectSkill(t)" [attr.aria-label]="'See more about ' + t">{{ t }}</button>
                  }
                </div>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: [`
    .timeline { list-style: none; margin: 0; padding: 0 0 0 48px; position: relative; }
    .timeline::before, .timeline::after { content: ''; position: absolute; left: 11px; top: 8px; width: 2px; border-radius: 2px; }
    .timeline::before { bottom: 8px; background: var(--border); }
    .timeline::after { height: calc(var(--fill, 0) * (100% - 16px)); background: var(--grad); box-shadow: 0 0 18px var(--accent); }

    .item { position: relative; display: grid; grid-template-columns: 200px 1fr; gap: 32px; padding-bottom: 28px; }
    .node { position: absolute; left: -43px; top: 26px; width: 14px; height: 14px; border-radius: 50%;
      background: var(--bg); border: 2px solid var(--accent); z-index: 1; transition: transform .4s var(--ease), background .4s; }
    .item:hover .node, .item.open .node { transform: scale(1.4); background: var(--accent-2); border-color: var(--accent-2); }

    .meta { padding-top: 20px; display: flex; flex-direction: column; gap: 4px; }
    .period { font: 600 14px var(--f-mono); color: var(--text); }
    .type { font: 12px var(--f-mono); color: var(--text-3); }

    .card__toggle { display: block; width: 100%; text-align: left; padding: 0; }
    .chip--btn { cursor: pointer; transition: background .3s, color .3s, border-color .3s, transform .3s var(--ease); }
    .chip--btn:hover { background: var(--text); color: var(--bg); border-color: var(--text); transform: translateY(-2px); }
    .card { text-align: left; width: 100%; padding: 24px 28px; border-radius: var(--radius); border: 1px solid var(--border);
      background: var(--surface); transition: border-color .4s, background .4s, transform .5s var(--ease); }
    .card:hover { border-color: var(--border-strong); background: var(--surface-2); transform: translateX(6px); }
    .card__head { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
    h3 { margin: 0; font: 700 clamp(20px, 2.2vw, 28px)/1.2 var(--f-display); letter-spacing: -.02em; }
    .company { margin: 4px 0 0; color: var(--accent-2); font-weight: 500; }
    .summary { color: var(--text-2); margin: 14px 0 0; }

    .plus { position: relative; flex: none; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border-strong); transition: transform .5s var(--ease), background .4s; }
    .plus::before, .plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 1.5px; background: var(--text); transform: translate(-50%, -50%); }
    .plus::after { transform: translate(-50%, -50%) rotate(90deg); }
    .item.open .plus { transform: rotate(135deg); background: var(--accent); border-color: var(--accent); }

    .details { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .6s var(--ease); }
    .details > div { overflow: hidden; }
    .item.open .details { grid-template-rows: 1fr; }
    ul { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
    ul li { position: relative; padding-left: 26px; color: var(--text); font-size: 15px; }
    ul li::before { content: '↳'; position: absolute; left: 0; color: var(--accent); font-family: var(--f-mono); }

    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }

    @media (max-width: 760px) {
      .timeline { padding-left: 32px; }
      .timeline::before, .timeline::after { left: 5px; }
      .node { left: -33px; }
      .item { grid-template-columns: 1fr; gap: 10px; }
      .meta { padding-top: 18px; flex-direction: row; flex-wrap: wrap; gap: 12px; }
      .card { padding: 20px; }
      .card:hover { transform: none; }
    }
  `],
})
export class ExperienceComponent {
  @ViewChild('timeline', { static: true }) timeline!: ElementRef<HTMLOListElement>;

  readonly ui = inject(UiService);
  readonly jobs = EXPERIENCE;
  readonly openIndex = signal<number | null>(0);
  readonly fill = signal(0);

  constructor() {
    afterNextRender(() => this.onScroll());
  }

  toggle(i: number): void {
    this.openIndex.update((cur) => (cur === i ? null : i));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const r = this.timeline.nativeElement.getBoundingClientRect();
    const progress = (window.innerHeight * 0.6 - r.top) / r.height;
    this.fill.set(Math.max(0, Math.min(1, progress)));
  }
}
