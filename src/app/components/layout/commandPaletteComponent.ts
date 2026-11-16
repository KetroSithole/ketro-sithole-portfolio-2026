import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { UiService } from '../../core/uiService';
import { PROFILE } from '../../data/profileData';
import { NAV_LINKS } from './navComponent';

interface Command { id: string; label: string; hint: string; icon: string; group: string; run: () => void; }

/** Spotlight-style command palette: ⌘K / Ctrl+K, fuzzy filter, full keyboard nav. */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ui.paletteOpen()) {
      <div class="backdrop" (click)="close()"></div>
      <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="search">
          <span class="search__icon">⌕</span>
          <input #input type="text" placeholder="Type a command or search…" [value]="query()"
                 (input)="onInput($event)" (keydown)="onKey($event)"
                 aria-controls="cmd-list" [attr.aria-activedescendant]="'cmd-' + cursor()" />
          <kbd>esc</kbd>
        </div>
        <ul id="cmd-list" class="list" role="listbox">
          @for (c of filtered(); track c.id; let i = $index) {
            @if (i === 0 || filtered()[i - 1].group !== c.group) {
              <li class="group" role="presentation">{{ c.group }}</li>
            }
            <li [id]="'cmd-' + i" role="option" class="item" [class.active]="i === cursor()"
                [attr.aria-selected]="i === cursor()" (mouseenter)="cursor.set(i)" (click)="exec(c)">
              <span class="item__icon">{{ c.icon }}</span>
              <span class="item__label">{{ c.label }}</span>
              <span class="item__hint">{{ c.hint }}</span>
            </li>
          } @empty {
            <li class="empty">No results for “{{ query() }}” — try “theme” or “work”.</li>
          }
        </ul>
        <div class="foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span class="secret">psst… try ↑↑↓↓←→←→BA</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; z-index: 900; background: color-mix(in srgb, var(--bg) 55%, transparent);
      backdrop-filter: blur(8px); animation: fade .25s ease both; }
    .palette { position: fixed; z-index: 901; left: 50%; top: 14vh; width: min(640px, calc(100vw - 32px));
      transform: translateX(-50%); border-radius: 20px; overflow: hidden;
      background: color-mix(in srgb, var(--bg-2) 92%, transparent); border: 1px solid var(--border-strong);
      box-shadow: 0 50px 120px -20px rgba(0,0,0,.7), var(--glow); animation: drop .35s var(--ease) both; }
    .search { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border); }
    .search__icon { font-size: 22px; color: var(--accent-2); }
    input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; color: var(--text); font: 500 18px var(--f-body); }
    input::placeholder { color: var(--text-3); }
    kbd { font: 11px var(--f-mono); padding: 3px 7px; border-radius: 6px; border: 1px solid var(--border-strong); color: var(--text-2); background: var(--surface); }
    .list { list-style: none; margin: 0; padding: 8px; max-height: 50vh; overflow-y: auto; }
    .group { padding: 12px 12px 6px; font: 500 11px var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-3); }
    .item { display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 12px; cursor: pointer; transition: background .15s; }
    .item.active { background: var(--surface-2); }
    .item.active .item__icon { background: var(--grad); color: #fff; border-color: transparent; }
    .item__icon { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; border: 1px solid var(--border); font-size: 15px; transition: background .2s; }
    .item__label { flex: 1; font-weight: 500; }
    .item__hint { font: 12px var(--f-mono); color: var(--text-3); }
    .empty { padding: 28px 12px; text-align: center; color: var(--text-3); }
    .foot { display: flex; gap: 18px; padding: 12px 20px; border-top: 1px solid var(--border); font: 12px var(--f-mono); color: var(--text-3); }
    .foot kbd { margin-right: 4px; }
    .secret { margin-left: auto; opacity: .6; }
    @media (max-width: 560px) { .secret { display: none; } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes drop { from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(.97); } }
  `],
})
export class CommandPaletteComponent {
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  readonly ui = inject(UiService);
  readonly query = signal('');
  readonly cursor = signal(0);

  private readonly commands: Command[] = [
    ...NAV_LINKS.map((l, i) => ({
      id: 'go-' + l.id, label: `Go to ${l.label}`, hint: `0${i + 1}`, icon: '→', group: 'Navigate',
      run: () => this.ui.scrollTo(l.id),
    })),
    { id: 'go-top', label: 'Back to top', hint: 'home', icon: '↑', group: 'Navigate', run: () => this.ui.scrollTo('top') },
    { id: 'theme', label: 'Toggle light / dark theme', hint: 'theme', icon: '◐', group: 'Actions', run: () => this.ui.toggleTheme() },
    { id: 'email', label: 'Copy email address', hint: PROFILE.email, icon: '✉', group: 'Actions', run: () => this.ui.copy(PROFILE.email) },
    { id: 'party', label: 'Party mode', hint: 'why not', icon: '✦', group: 'Actions', run: () => this.ui.party.update((v) => !v) },
    { id: 'gh', label: 'Open GitHub', hint: 'github', icon: '⌥', group: 'Links', run: () => window.open(PROFILE.links.github, '_blank', 'noopener') },
    { id: 'li', label: 'Open LinkedIn', hint: 'linkedin', icon: 'in', group: 'Links', run: () => window.open(PROFILE.links.linkedin, '_blank', 'noopener') },
    { id: 'yt', label: 'Open YouTube', hint: 'youtube', icon: '▶', group: 'Links', run: () => window.open(PROFILE.links.youtube, '_blank', 'noopener') },
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands;
    return this.commands.filter((c) => this.fuzzy(q, `${c.label} ${c.hint} ${c.group}`.toLowerCase()));
  });

  constructor() {
    effect(() => {
      if (this.ui.paletteOpen()) {
        this.query.set('');
        this.cursor.set(0);
        setTimeout(() => this.input?.nativeElement.focus());
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.paletteOpen.update((v) => !v);
    } else if (e.key === 'Escape' && this.ui.paletteOpen()) {
      this.close();
    }
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.cursor.set(0);
  }

  onKey(e: KeyboardEvent): void {
    const n = this.filtered().length;
    if (!n) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.cursor.update((c) => (c + 1) % n); this.scrollActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.cursor.update((c) => (c - 1 + n) % n); this.scrollActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); const c = this.filtered()[this.cursor()]; if (c) this.exec(c); }
  }

  exec(c: Command): void {
    this.close();
    setTimeout(() => c.run(), 60);
  }

  close(): void {
    this.ui.paletteOpen.set(false);
  }

  private scrollActive(): void {
    setTimeout(() => document.getElementById('cmd-' + this.cursor())?.scrollIntoView({ block: 'nearest' }));
  }

  /** Subsequence match: "gtw" matches "go to work". */
  private fuzzy(q: string, text: string): boolean {
    let i = 0;
    for (const ch of text) if (ch === q[i]) i++;
    return i === q.length;
  }
}
