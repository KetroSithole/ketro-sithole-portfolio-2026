import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CASE_STUDIES, CaseStudy, EXPERIENCE, Experience, SKILLS } from '../../data/profileData';
import { UiService } from '../../core/uiService';
import { RevealDirective } from '../../directives/revealDirective';

const ORBITS = [
  { r: 34, dur: 38, items: ['Python', 'SQL', 'Apache Spark', 'dbt'] },
  { r: 54, dur: 56, items: ['BigQuery', 'Dataform', 'Snowflake', 'Databricks', 'Looker'] },
  { r: 74, dur: 80, items: ['GCP', 'Azure', 'Docker', 'Kubernetes', 'Go', 'Power BI'] },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="section">
      <div class="container">
        <div class="section-head" reveal>
          <span class="eyebrow">04 — Toolkit</span>
          <h2 class="h2">Full-spectrum<br /><em>craft.</em></h2>
        </div>

        <div class="layout">
          <div class="orbit" reveal [class.frozen]="!!selected()">
            <button class="core" (click)="shuffle()" data-cursor="spin" aria-label="Pick a random skill">
              <span class="core__k">K</span>
              <span class="core__t">tap to shuffle</span>
            </button>
            @for (o of orbits; track o.r) {
              <div class="ring" [style.--r]="o.r" [style.--dur]="o.dur + 's'">
                @for (it of o.items; track it; let i = $index) {
                  <div class="sat" [style.--a]="(360 / o.items.length) * i + 'deg'">
                    <div class="sat__fix">
                      <button class="sat__label" tabindex="-1" [class.on]="isSelected(it)" (click)="pick(it)">{{ it }}</button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <div class="panel" reveal [revealDelay]="150">
            <div class="tabs" role="tablist">
              @for (g of groups; track g.id) {
                <button role="tab" class="tab" [class.active]="activeId() === g.id"
                        [attr.aria-selected]="activeId() === g.id" (click)="selectTab(g.id)">
                  <span class="tab__icon">{{ g.icon }}</span>{{ g.label }}
                  <span class="tab__count">{{ g.items.length }}</span>
                </button>
              }
            </div>

            @if (active(); as g) {
              <div class="chips" role="tabpanel">
                @for (s of g.items; track s; let i = $index) {
                  <button class="skill" [style.--i]="i" [class.on]="isSelected(s)" (click)="pick(s)"
                          [attr.aria-pressed]="isSelected(s)">{{ s }}</button>
                }
              </div>
            }

            <div class="usage" [class.show]="!!selected()" aria-live="polite">
              @if (selected(); as s) {
                <div class="usage__head">
                  <span class="usage__name">{{ s }}</span>
                  <button class="usage__x" (click)="ui.selectedSkill.set(null)" aria-label="Clear selection">✕</button>
                </div>
                @if (usage().jobs.length || usage().cases.length) {
                  <p class="usage__lead">Where I’ve used it:</p>
                  <ul>
                    @for (j of usage().jobs; track j.period) {
                      <li><button (click)="ui.scrollTo('experience')"><b>{{ j.company }}</b><span>{{ j.role }} · {{ j.period }}</span><i>↗</i></button></li>
                    }
                    @for (c of usage().cases; track c.id) {
                      <li><button (click)="ui.scrollTo('work')"><b>{{ c.title }}</b><span>Case study · {{ c.client }}</span><i>↗</i></button></li>
                    }
                  </ul>
                } @else {
                  <p class="usage__lead">Part of my everyday toolkit — ask me about it.</p>
                }
              } @else {
                <p class="usage__hint">↑ Pick any skill — here or in the orbit — to see where I’ve used it.</p>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .layout { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 96px); align-items: center; }

    .orbit { position: relative; width: 100%; aspect-ratio: 1; max-width: 560px; margin: 0 auto; }
    .core { position: absolute; left: 50%; top: 50%; z-index: 2; width: 22%; aspect-ratio: 1; transform: translate(-50%, -50%);
      border-radius: 50%; background: var(--grad); display: grid; place-items: center; align-content: center;
      box-shadow: 0 0 80px color-mix(in srgb, var(--accent) 60%, transparent); color: #fff;
      transition: transform .5s var(--ease), box-shadow .5s; }
    .core:hover { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 120px var(--accent); }
    .core:active { transform: translate(-50%, -50%) scale(.94); }
    .core__k { font: 800 clamp(28px, 4vw, 48px)/1 var(--f-display); }
    .core__t { font: 500 9px var(--f-mono); letter-spacing: .06em; opacity: .85; }
    .core::after { content: ''; position: absolute; inset: -14px; border-radius: 50%; border: 1px dashed var(--border-strong); animation: spin 20s linear infinite; pointer-events: none; }

    .ring { position: absolute; left: 50%; top: 50%; width: calc(var(--r) * 1%); aspect-ratio: 1;
      transform: translate(-50%, -50%); border-radius: 50%; border: 1px solid var(--border);
      animation: orbit var(--dur) linear infinite; pointer-events: none; }
    .orbit:hover .ring, .orbit:hover .sat__label,
    .orbit.frozen .ring, .orbit.frozen .sat__label { animation-play-state: paused; }
    .sat { position: absolute; inset: 0; transform: rotate(var(--a)); pointer-events: none; }
    .sat__fix { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%) rotate(calc(-1 * var(--a))); pointer-events: auto; }
    .sat__label {
      display: block; white-space: nowrap; padding: 7px 14px; border-radius: 99px; cursor: pointer;
      font: 500 12px var(--f-mono); background: var(--bg-2); border: 1px solid var(--border-strong); color: var(--text);
      animation: counter var(--dur) linear infinite; transition: background .3s, color .3s, scale .3s var(--ease), box-shadow .3s;
    }
    .sat__label:hover { background: var(--accent); color: #fff; scale: 1.12; }
    .sat__label.on { background: var(--accent-2); color: #000; border-color: transparent; scale: 1.18;
      box-shadow: 0 0 30px var(--accent-2); }

    @keyframes orbit { to { transform: translate(-50%, -50%) rotate(360deg); } }
    @keyframes counter { to { rotate: -360deg; } }

    .tabs { display: flex; flex-direction: column; gap: 4px; }
    .tab { display: flex; align-items: center; gap: 14px; text-align: left; padding: 16px 20px; border-radius: 16px;
      font: 600 clamp(18px, 2vw, 24px) var(--f-display); color: var(--text-3); letter-spacing: -.01em;
      transition: color .3s, background .3s, padding .4s var(--ease); }
    .tab:hover { color: var(--text-2); background: var(--surface); }
    .tab.active { color: var(--text); background: var(--surface-2); padding-left: 28px; }
    .tab__icon { width: 24px; text-align: center; color: var(--accent-2); }
    .tab__count { margin-left: auto; font: 500 12px var(--f-mono); color: var(--text-3); }

    .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; min-height: 110px; align-content: flex-start; }
    .skill { padding: 12px 18px; border-radius: 14px; border: 1px solid var(--border); background: var(--surface);
      font-weight: 500; animation: pop .6s var(--ease) both; animation-delay: calc(var(--i) * 45ms);
      transition: transform .3s var(--ease), border-color .3s, background .3s, color .3s; }
    .skill:hover { transform: translateY(-4px); border-color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
    .skill.on { background: var(--accent-2); color: #000; border-color: transparent; transform: translateY(-4px); box-shadow: 0 10px 30px -8px var(--accent-2); }
    @keyframes pop { from { opacity: 0; transform: translateY(16px) scale(.9); } to { opacity: 1; transform: none; } }

    .usage { margin-top: 24px; padding: 20px; border-radius: var(--radius); border: 1px dashed var(--border-strong); min-height: 96px;
      transition: border-color .4s, background .4s; }
    .usage.show { border-style: solid; border-color: color-mix(in srgb, var(--accent-2) 50%, transparent);
      background: color-mix(in srgb, var(--accent-2) 6%, transparent); animation: pop .5s var(--ease) both; }
    .usage__head { display: flex; justify-content: space-between; align-items: center; }
    .usage__name { font: 800 26px var(--f-display); letter-spacing: -.02em; }
    .usage__x { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-strong); font-size: 12px; transition: transform .4s var(--ease); }
    .usage__x:hover { transform: rotate(90deg); }
    .usage__lead { margin: 6px 0 10px; color: var(--text-2); font-size: 14px; }
    .usage__hint { margin: 0; color: var(--text-3); font: 13px var(--f-mono); }
    .usage ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .usage li button { width: 100%; display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: baseline; text-align: left;
      padding: 10px 12px; border-radius: 10px; transition: background .3s; }
    .usage li button:hover { background: var(--surface-2); }
    .usage li b { font-weight: 600; }
    .usage li span { color: var(--text-3); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .usage li i { font-style: normal; color: var(--accent-2); }

    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .orbit { max-width: 440px; }
      .sat__label { font-size: 10px; padding: 5px 10px; }
    }
    @media (max-width: 520px) { .usage li button { grid-template-columns: 1fr auto; } .usage li span { grid-column: 1; } }
  `],
})
export class SkillsComponent {
  readonly ui = inject(UiService);
  readonly groups = SKILLS;
  readonly orbits = ORBITS;
  readonly activeId = signal(SKILLS[0].id);
  readonly active = computed(() => this.groups.find((g) => g.id === this.activeId()));
  readonly selected = this.ui.selectedSkill;

  readonly usage = computed(() => {
    const s = this.selected();
    if (!s) return { jobs: [] as Experience[], cases: [] as CaseStudy[] };
    const n = norm(s);
    return {
      jobs: EXPERIENCE.filter((j) => j.tags.some((t) => norm(t) === n)),
      cases: CASE_STUDIES.filter((c) => c.tags.some((t) => norm(t) === n)),
    };
  });

  constructor() {
    // When a skill is chosen from anywhere on the page, jump to the tab that contains it.
    effect(() => {
      const s = this.selected();
      if (!s) return;
      const g = this.groups.find((grp) => grp.items.some((i) => norm(i) === norm(s)));
      if (g) this.activeId.set(g.id);
    });
  }

  isSelected(s: string): boolean {
    const cur = this.selected();
    return !!cur && norm(cur) === norm(s);
  }

  pick(s: string): void {
    this.ui.selectedSkill.set(this.isSelected(s) ? null : s);
  }

  selectTab(id: string): void {
    this.activeId.set(id);
    const s = this.selected();
    const g = this.groups.find((grp) => grp.id === id);
    if (s && g && !g.items.some((i) => norm(i) === norm(s))) this.ui.selectedSkill.set(null);
  }

  shuffle(): void {
    const all = this.orbits.flatMap((o) => o.items);
    let next = all[Math.floor(Math.random() * all.length)];
    if (this.isSelected(next)) next = all[(all.indexOf(next) + 1) % all.length];
    this.ui.selectedSkill.set(next);
  }
}
