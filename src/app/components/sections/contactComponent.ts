import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { PROFILE } from '../../data/profileData';
import { UiService } from '../../core/uiService';
import { MagneticDirective } from '../../directives/magneticDirective';
import { RevealDirective } from '../../directives/revealDirective';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MagneticDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="contact">
      <div class="container">
        <span class="eyebrow" reveal>06 — Contact</span>

        <h2 class="mega" reveal>
          <span class="mega__line">Let’s build</span>
          <span class="mega__line"><span class="outline">something</span></span>
          <span class="mega__line gradient-text">unforgettable.</span>
        </h2>

        <div class="cta" reveal>
          <button magnetic [magneticStrength]="0.25" class="orb" (click)="ui.copy(p.email, 'Email copied — talk soon ✦')" data-cursor="copy">
            <span class="orb__ring"></span>
            <span class="orb__text">Say<br />hello</span>
          </button>

          <div class="info">
            <a class="email" [href]="'mailto:' + p.email">{{ p.email }}<span class="arrow">↗</span></a>
            <div class="socials">
              @for (s of socials; track s.label) {
                <a magnetic class="social" [href]="s.url" target="_blank" rel="noopener">
                  {{ s.label }} <span>↗</span>
                </a>
              }
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="container footer__inner">
          <span>© {{ year }} {{ p.first }} {{ p.last }}</span>
          <span class="clock"><i></i>{{ p.location }} · {{ time() }}</span>
          <span class="built">Built with Angular · Signals · Canvas</span>
        </div>
      </footer>
    </section>
  `,
  styles: [`
    .contact { position: relative; padding: clamp(96px, 14vw, 180px) 0 0; overflow: hidden; }
    .contact::before { content: ''; position: absolute; left: 50%; bottom: -40%; width: 120vw; height: 80vh; transform: translateX(-50%);
      background: radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 35%, transparent), transparent 65%); z-index: -1; }

    .mega { margin: 28px 0 0; font: 800 clamp(48px, 11vw, 176px)/.9 var(--f-display); letter-spacing: -.05em; }
    .mega__line { display: block; }
    .outline { color: transparent; -webkit-text-stroke: 2px var(--text); transition: color .5s; }
    .mega:hover .outline { color: var(--text); }

    .cta { margin-top: 64px; display: flex; align-items: center; gap: clamp(32px, 6vw, 96px); flex-wrap: wrap; }
    .orb { position: relative; width: clamp(150px, 18vw, 210px); aspect-ratio: 1; border-radius: 50%;
      background: var(--grad); color: #fff; display: grid; place-items: center; flex: none;
      transition: transform .5s var(--ease), box-shadow .5s; box-shadow: 0 30px 80px -20px var(--accent); }
    .orb:hover { box-shadow: 0 30px 120px -10px var(--accent); }
    .orb__text { font: 700 clamp(20px, 2.2vw, 26px)/1.05 var(--f-display); text-align: center; }
    .orb__ring { position: absolute; inset: -14px; border-radius: 50%; border: 1px dashed var(--border-strong); animation: spin 18s linear infinite; }

    .info { display: flex; flex-direction: column; gap: 28px; min-width: 0; }
    .email { font: 600 clamp(22px, 3.4vw, 48px)/1.1 var(--f-display); letter-spacing: -.02em; word-break: break-all;
      background: linear-gradient(var(--text), var(--text)) no-repeat 0 100% / 0 2px; transition: background-size .6s var(--ease); padding-bottom: 6px; }
    .email:hover { background-size: 100% 2px; }
    .email .arrow { display: inline-block; margin-left: 10px; color: var(--accent-2); transition: transform .4s var(--ease); }
    .email:hover .arrow { transform: translate(4px, -4px); }

    .socials { display: flex; flex-wrap: wrap; gap: 10px; }
    .social { padding: 12px 20px; border: 1px solid var(--border-strong); border-radius: 99px; font-weight: 500;
      transition: background .3s, color .3s, transform .3s var(--ease); }
    .social span { color: var(--accent-2); transition: color .3s; }
    .social:hover { background: var(--text); color: var(--bg); }
    .social:hover span { color: var(--bg); }

    .footer { margin-top: clamp(80px, 12vw, 160px); border-top: 1px solid var(--border); padding: 28px 0; }
    .footer__inner { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; font: 13px var(--f-mono); color: var(--text-3); }
    .clock { display: inline-flex; align-items: center; gap: 8px; }
    .clock i { width: 7px; height: 7px; border-radius: 50%; background: var(--accent-2); animation: pulse 1.8s infinite; }
  `],
})
export class ContactComponent implements OnInit, OnDestroy {
  readonly ui = inject(UiService);
  readonly p = PROFILE;
  readonly year = new Date().getFullYear();
  readonly time = signal('');
  readonly socials = [
    { label: 'GitHub', url: PROFILE.links.github },
    { label: 'LinkedIn', url: PROFILE.links.linkedin },
    { label: 'YouTube', url: PROFILE.links.youtube },
  ];

  private timer?: ReturnType<typeof setInterval>;
  private readonly fmt = new Intl.DateTimeFormat('en-ZA', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: PROFILE.timezone,
  });

  ngOnInit(): void {
    const tick = () => this.time.set(this.fmt.format(new Date()) + ' SAST');
    tick();
    this.timer = setInterval(tick, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
