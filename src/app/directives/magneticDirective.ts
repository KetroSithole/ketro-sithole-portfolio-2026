import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/** Pulls the element toward the cursor while hovered — a tactile "magnet" feel. */
@Directive({ selector: '[magnetic]', standalone: true })
export class MagneticDirective {
  @Input() magneticStrength = 0.35;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const node = this.el.nativeElement;
    const r = node.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * this.magneticStrength;
    const y = (e.clientY - (r.top + r.height / 2)) * this.magneticStrength;
    node.style.transform = `translate(${x}px, ${y}px)`;
  }

  @HostListener('pointerleave')
  onLeave(): void {
    this.el.nativeElement.style.transform = '';
  }
}
