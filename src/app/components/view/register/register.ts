import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFeatures } from '../../shared/auth-features/auth-features';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, AuthFeatures],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  step = signal(1);

  nextStep(isValid: boolean | null): void {
    if (isValid) this.step.set(2);
  }

  previousStep(): void {
    this.step.set(1);
  }
}
