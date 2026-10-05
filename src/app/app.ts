import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBar } from './components/shared/navigation-bar/navigation-bar';

@Component({
  imports: [NavigationBar, RouterOutlet],
  selector: 'app-root',
  template: '<app-navigation-bar></app-navigation-bar> <router-outlet />',
})
export class App {
  protected readonly title = signal('bread-bank');
}
