import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal,
} from '@angular/core';
import { PROFILE } from '../../data/profileData';
import { UiService, prefersReducedMotion } from '../../core/uiService';
import { MagneticDirective } from '../../directives/magneticDirective';
import { TiltDirective } from '../../directives/tiltDirective';

interface Particle { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number; }

const CODE = [
  `<span class="tok-k">const</span> <span class="tok-v">ketro</span> = {`,
  `  <span class="tok-p">role</span>: <span class="tok-s">'Senior Data Engineer'</span>,`,
  `  <span class="tok-p">based</span>: <span class="tok-s">'Cape Town, ZA'</span>,`,
  `  <span class="tok-p">superpower</span>: <span class="tok-s">'raw data → trusted decisions'</span>,`,
  `  <span class="tok-p">hackathons</span>: <span class="tok-n">7</span>,`,
  `  <span class="tok-p">stack</span>: [<span class="tok-s">'BigQuery'</span>, <span class="tok-s">'Spark'</span>, <span class="tok-s">'Azure'</span>],`,
  `  <span class="tok-p">available</span>: <span class="tok-k">true</span>,`,
  `};`,
  ``,
  `<span class="tok-c">// let's build something unforgettable</span>`,
].join('\n');

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="hero">
      <canvas #canvas class="field" aria-hidden="true"></canvas>
      <div class="vignette" aria-hidden="true"></div>

      <div class="container hero__inner">
        <div class="hero__copy">
          <div class="badge">
            <span class="pulse"></span>
            Open to senior roles · {{ p.location }}
          </div>

          <h1 class="name" [attr.aria-label]="p.first + ' ' + p.last">
            <span class="line" aria-hidden="true">
              @for (ch of firstChars; track $index) {
                <span class="ch" [style.--d]="$index">{{ ch }}</span>
              }
            </span>
            <span class="line line--outline" aria-hidden="true">
              @for (ch of lastChars; track $index) {
                <span class="ch" [style.--d]="$index + firstChars.length">{{ ch }}</span>
              }
            </span>
          </h1>

          <p class="role">
            <span class="prompt">&gt;</span>
            <span class="typed">{{ typed() }}</span><span class="caret"></span>
          </p>

          <p class="lede">{{ p.statement }}</p>

          <div class="ctas">
            <button magnetic class="btn btn--primary" (click)="ui.scrollTo('work')" data-cursor="view">
              Explore my work <span class="arrow">→</span>
            </button>
            <button magnetic class="btn btn--ghost" (click)="ui.scrollTo('contact')">
              Let’s talk
            </button>
          </div>
        </div>

        <div class="hero__card" tilt [tiltMax]="8">
          <div class="card__bar">
            <i></i><i></i><i></i>
            <span>ketro.ts</span>
          </div>
          <pre class="card__code" [innerHTML]="code"></pre>
          <div class="card__glare"></div>
        </div>
      </div>

      <span class="field-hint" aria-hidden="true">✦ click anywhere to send a shockwave</span>

      <button class="scroll-cue" (click)="ui.scrollTo('about')" aria-label="Scroll to about">
        <span class="mouse"><i></i></span>
        <span class="cue-text">scroll</span>
      </button>
    </section>
  `,
  styles: [`
    .hero { position: relative; min-height: 100svh; display: flex; align-items: center; overflow: hidden; padding: 120px 0 80px; }
    .field { position: absolute; inset: 0; width: 100%; height: 100%; }
    .vignette { position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at center, transparent 30%, var(--bg) 85%); }

    .hero__inner { position: relative; display: grid; grid-template-columns: 1.35fr 1fr; gap: 48px; align-items: center; }

    .badge {
      display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 12px;
      border: 1px solid var(--border); border-radius: 99px; background: var(--surface);
      backdrop-filter: blur(10px); font: 500 13px var(--f-mono); color: var(--text-2);
      animation: rise 1s var(--ease) both 1.6s;
    }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-2); animation: pulse 1.8s infinite; }

    .name { margin: 28px 0 0; font-family: var(--f-display); font-weight: 800; line-height: .86; letter-spacing: -.045em;
      font-size: clamp(64px, 13.5vw, 196px); }
    .line { display: block; white-space: nowrap; }
    .ch {
      display: inline-block; transform-origin: bottom;
      animation: drop 1.1s var(--ease) both; animation-delay: calc(var(--d) * 55ms + 1.1s);
      transition: transform .5s var(--ease), color .3s;
    }
    .ch:hover { transform: translateY(-14px) rotate(-6deg); color: var(--accent-2); }
    .line--outline .ch { color: transparent; -webkit-text-stroke: 2px var(--text); }
    .line--outline .ch:hover { color: var(--accent); -webkit-text-stroke-color: var(--accent); }

    .role { margin: 28px 0 0; font: 500 clamp(18px, 2.2vw, 26px) var(--f-mono); display: flex; align-items: center; gap: 12px; min-height: 1.6em;
      animation: rise 1s var(--ease) both 1.8s; }
    .prompt { color: var(--accent-2); }
    .typed { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .caret { width: 3px; height: 1.1em; background: var(--accent-2); animation: blink 1s steps(1) infinite; margin-left: -8px; }

    .lede { max-width: 540px; margin: 20px 0 0; color: var(--text-2); font-size: clamp(16px, 1.4vw, 19px);
      animation: rise 1s var(--ease) both 1.95s; }

    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 40px; animation: rise 1s var(--ease) both 2.1s; }

    .hero__card {
      position: relative; border-radius: var(--radius); overflow: hidden;
      background: color-mix(in srgb, var(--bg-2) 70%, transparent);
      border: 1px solid var(--border); backdrop-filter: blur(16px);
      box-shadow: 0 40px 120px -30px rgba(0,0,0,.6), var(--glow);
      transform-style: preserve-3d;
      animation: card-in 1.4s var(--ease) both 1.5s;
    }
    .card__bar { display: flex; align-items: center; gap: 7px; padding: 14px 18px; border-bottom: 1px solid var(--border); }
    .card__bar i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
    .card__bar i:nth-child(2) { background: #febc2e; } .card__bar i:nth-child(3) { background: #28c840; }
    .card__bar span { margin-left: auto; font: 12px var(--f-mono); color: var(--text-3); }
    .card__code { margin: 0; padding: 24px 22px 28px; font: 14px/1.85 var(--f-mono); color: var(--text); overflow-x: auto; }
    .card__glare { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .4s;
      background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.12), transparent 40%); }
    .hero__card:hover .card__glare { opacity: 1; }

    .field-hint { position: absolute; left: var(--gutter); bottom: 32px; font: 11px var(--f-mono); letter-spacing: .14em;
      text-transform: uppercase; color: var(--text-3); animation: rise 1s var(--ease) both 2.6s; pointer-events: none; }
    @media (max-width: 760px) { .field-hint { display: none; } }
    .scroll-cue { position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%); display: flex; flex-direction: column;
      align-items: center; gap: 10px; color: var(--text-3); font: 11px var(--f-mono); letter-spacing: .2em; text-transform: uppercase;
      animation: rise 1s var(--ease) both 2.4s; }
    .mouse { width: 22px; height: 34px; border: 1.5px solid var(--text-3); border-radius: 12px; display: flex; justify-content: center; padding-top: 6px; }
    .mouse i { width: 3px; height: 7px; border-radius: 2px; background: var(--accent-2); animation: wheel 1.6s var(--ease) infinite; }

    @keyframes drop { from { opacity: 0; transform: translateY(110%) rotate(8deg) scaleY(1.4); filter: blur(10px); } to { opacity: 1; transform: none; filter: none; } }
    @keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @keyframes card-in { from { opacity: 0; transform: perspective(1000px) rotateY(-25deg) rotateX(10deg) translateY(60px); } to { opacity: 1; transform: none; } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes wheel { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(10px); opacity: 0; } }

    @media (max-width: 1024px) {
      .hero__inner { grid-template-columns: 1fr; }
      .hero__card { max-width: 520px; }
    }
    @media (max-width: 560px) {
      .card__code { font-size: 12px; }
      .scroll-cue { display: none; }
    }
  `],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly ui = inject(UiService);
  private readonly zone = inject(NgZone);

  readonly p = PROFILE;
  readonly firstChars = [...PROFILE.first.toUpperCase()];
  readonly lastChars = [...PROFILE.last.toUpperCase()];
  readonly code = CODE;
  readonly typed = signal('');

  private typeTimer?: ReturnType<typeof setTimeout>;
  private teardown: () => void = () => {};

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.startField());
    this.typeTimer = setTimeout(() => this.typeLoop(), 1900);
  }

  ngOnDestroy(): void {
    clearTimeout(this.typeTimer);
    this.teardown();
  }

  /** Types, holds, deletes and cycles through the role list. */
  private typeLoop(): void {
    const roles = this.p.roles;
    let i = 0;
    let j = 0;
    let deleting = false;
    const step = () => {
      const word = roles[i];
      if (!deleting) {
        j++;
        this.typed.set(word.slice(0, j));
        if (j === word.length) {
          deleting = true;
          this.typeTimer = setTimeout(step, 2000);
          return;
        }
      } else {
        j--;
        this.typed.set(word.slice(0, j));
        if (j === 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      }
      this.typeTimer = setTimeout(step, deleting ? 32 : 68);
    };
    step();
  }

  /** Interactive "data constellation": particles drift, link up, and flee the cursor. */
  private startField(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 130;
    const REPEL = 170;
    let w = 0;
    let h = 0;
    let pts: Particle[] = [];
    let rgb = '160, 140, 255';
    let frame = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    const waves: { x: number; y: number; r: number }[] = [];
    const hero = canvas.parentElement as HTMLElement;

    const readColor = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || rgb;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(160, Math.floor((w * h) / 10000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        bx: (Math.random() - 0.5) * 0.35,
        by: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const draw = () => {
      if (frame++ % 30 === 0) readColor();
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL && d > 0.1) {
          const f = (REPEL - d) / REPEL;
          p.vx += (dx / d) * f * 0.9;
          p.vy += (dy / d) * f * 0.9;
        }
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.bx + p.vx;
        p.y += p.by + p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      }

      ctx.lineWidth = 0.8;
      for (let a = 0; a < pts.length; a++) {
        const pa = pts[a];
        for (let b = a + 1; b < pts.length; b++) {
          const pb = pts[b];
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.35;
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(pa.x - mouse.x, pa.y - mouse.y);
        if (md < REPEL + 60) {
          ctx.strokeStyle = `rgba(0, 224, 198, ${(1 - md / (REPEL + 60)) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (let k = waves.length - 1; k >= 0; k--) {
        const wv = waves[k];
        wv.r += 9;
        const life = 1 - wv.r / 420;
        if (life <= 0) { waves.splice(k, 1); continue; }
        ctx.strokeStyle = `rgba(0, 224, 198, ${life * 0.7})`;
        ctx.lineWidth = 2 * life + 0.5;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of pts) {
        ctx.fillStyle = `rgba(${rgb}, 0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button, .hero__card, .name')) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      waves.push({ x, y, r: 0 });
      for (const p of pts) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 380) {
          const f = (1 - d / 380) * 14;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
    };

    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(canvas);

    resize();
    readColor();
    window.addEventListener('resize', resize);
    if (reduced) {
      draw();
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      hero.addEventListener('pointerdown', onDown);
      raf = requestAnimationFrame(loop);
    }

    this.teardown = () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
    };
  }
}
