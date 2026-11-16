import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * 3D perspective tilt that follows the pointer.
 * Also exposes --mx / --my (0–100%) so CSS can paint a moving glare.
 */
@Directive({ selector: '[tilt]', standalone: true })
export class TiltDirective {
  @Input() tiltMax = 10;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const node = this.el.nativeElement;
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * this.tiltMax * 2;
    const ry = (px - 0.5) * this.tiltMax * 2;
    node.style.transition = 'transform 0.1s linear';
    node.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    node.style.setProperty('--mx', `${px * 100}%`);
    node.style.setProperty('--my', `${py * 100}%`);
  }

  @HostListener('pointerleave')
  onLeave(): void {
    const node = this.el.nativeElement;
    node.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    node.style.transform = '';
  }
}
