import { Component } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  imports: [MatMenu, MatMenuItem, MatMenuTrigger],
  selector: 'app-navigation-bar',
  styleUrl: './navigation-bar.css',
  templateUrl: './navigation-bar.html',
})
export class NavigationBar {}
