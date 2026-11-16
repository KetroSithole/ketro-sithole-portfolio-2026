import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

/** Custom two-part cursor: a precise dot + a lagging ring that morphs over interactive elements. */
@Component({
  selector: 'app-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #ring class="ring"><span #label class="label"></span></div>
    <div #dot class="dot"></div>
  `,
  styles: [`
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 1000; }
    .dot, .ring { position: fixed; top: 0; left: 0; border-radius: 50%; will-change: transform; opacity: 0; transition: opacity .3s; }
    :host(.on) .dot, :host(.on) .ring { opacity: 1; }
    .dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; background: var(--text); }
    .ring {
      width: 40px; height: 40px; margin: -20px 0 0 -20px;
      border: 1px solid var(--border-strong);
      display: grid; place-items: center;
      transition: width .4s var(--ease), height .4s var(--ease), margin .4s var(--ease),
                  background .4s, border-color .4s, opacity .3s;
      mix-blend-mode: difference;
    }
    .ring.hover { width: 72px; height: 72px; margin: -36px 0 0 -36px; background: #fff; border-color: transparent; }
    .ring.labelled { width: 96px; height: 96px; margin: -48px 0 0 -48px; background: var(--accent); mix-blend-mode: normal; border-color: transparent; }
    .ring.down { width: 28px; height: 28px; margin: -14px 0 0 -14px; }
    .label { font: 600 11px/1 var(--f-mono); letter-spacing: .12em; text-transform: uppercase; color: #fff; opacity: 0; transition: opacity .3s; }
    .ring.labelled .label { opacity: 1; }
    @media (pointer: coarse) { :host { display: none; } }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  @ViewChild('dot', { static: true }) dot!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ring!: ElementRef<HTMLDivElement>;
  @ViewChild('label', { static: true }) label!: ElementRef<HTMLSpanElement>;

  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private teardown: () => void = () => {};

  ngOnInit(): void {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('has-cursor');

    this.zone.runOutsideAngular(() => {
      const target = { x: -100, y: -100 };
      const pos = { x: -100, y: -100 };
      let raf = 0;
      const dot = this.dot.nativeElement;
      const ring = this.ring.nativeElement;
      const label = this.label.nativeElement;
      const host = this.host.nativeElement;

      const move = (e: PointerEvent) => {
        target.x = e.clientX;
        target.y = e.clientY;
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        host.classList.add('on');
      };
      const over = (e: Event) => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, input, [data-cursor]');
        const text = el?.dataset['cursor'] ?? '';
        ring.classList.toggle('hover', !!el && !text);
        ring.classList.toggle('labelled', !!text);
        label.textContent = text;
      };
      const down = () => ring.classList.add('down');
      const up = () => ring.classList.remove('down');
      const leave = () => host.classList.remove('on');

      const loop = () => {
        pos.x += (target.x - pos.x) * 0.16;
        pos.y += (target.y - pos.y) * 0.16;
        ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerover', over, { passive: true });
      window.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      document.documentElement.addEventListener('pointerleave', leave);

      this.teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', over);
        window.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
        document.documentElement.removeEventListener('pointerleave', leave);
        document.body.classList.remove('has-cursor');
      };
    });
  }

  ngOnDestroy(): void {
    this.teardown();
  }
}
