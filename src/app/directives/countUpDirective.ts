import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { prefersReducedMotion } from '../core/uiService';

/** Animates a number from 0 → countTo when it scrolls into view. */
@Directive({ selector: '[countTo]', standalone: true, exportAs: 'countUp' })
export class CountUpDirective implements OnInit, OnDestroy {
  @Input({ required: true }) countTo!: number;
  @Input() countPrefix = '';
  @Input() countSuffix = '';
  @Input() countDuration = 1800;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private io?: IntersectionObserver;
  private raf = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.render(prefersReducedMotion() ? this.countTo : 0);
    if (prefersReducedMotion()) return;

    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          this.io?.disconnect();
          this.play();
        },
        { threshold: 0.6 },
      );
      this.io.observe(node);
    });
  }

  /** (Re)plays the count from zero — public so templates can trigger it on click. */
  play(): void {
    cancelAnimationFrame(this.raf);
    this.zone.runOutsideAngular(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / this.countDuration);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        this.render(Math.round(eased * this.countTo));
        if (t < 1) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    cancelAnimationFrame(this.raf);
  }

  private render(n: number): void {
    this.el.nativeElement.textContent = `${this.countPrefix}${n}${this.countSuffix}`;
  }
}
