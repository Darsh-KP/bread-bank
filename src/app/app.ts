import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppToast } from './components/shared/notifications/app-toast/app-toast';
import { NavigationBar } from './components/shared/navigation-bar/navigation-bar';

@Component({
  imports: [RouterOutlet, AppToast],
  selector: 'app-root',
  template: `
    <app-toast />
    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('bread-bank');
}
