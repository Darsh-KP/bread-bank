import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFeatures } from '../../shared/auth-features/auth-features';

@Component({
  imports: [RouterLink, AuthFeatures],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {}
