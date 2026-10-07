import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AppToast } from './components/shared/notifications/app-toast/app-toast';
import { NavigationBar } from './components/shared/navigation-bar/navigation-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [NavigationBar, RouterOutlet, AppToast],
  selector: 'app-root',
  template: `
    <app-toast />
    @if (showNavigation()) {
      <app-navigation-bar />
    }
    <router-outlet />
  `,
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly title = signal('bread-bank');
  readonly showNavigation = signal(this.shouldShowNavigation(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.showNavigation.set(this.shouldShowNavigation(event.urlAfterRedirects));
      });
  }

  private shouldShowNavigation(url: string): boolean {
    const path = url.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
    return path !== '/' && path !== '/register';
  }
}
