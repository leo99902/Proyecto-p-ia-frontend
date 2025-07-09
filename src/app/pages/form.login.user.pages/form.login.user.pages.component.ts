// src/app/modules/auth/login/form.login.user.pages.component.ts

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login.service/login.service.service';
import { AuthService } from '../../services/auth.service/auth.service';
import { RecoverPasswordService } from '../../services/recover.password.service/recover.password.service';


@Component({
  selector: 'app-form-login-user',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './form.login.user.pages.component.html',
  styleUrl: './form.login.user.pages.component.scss',
  standalone: true
})
export class FormLoginUserPagesComponent {
  public name = '';
  public password = '';
  public recoverEmail = '';

  public router = inject(Router);
  public loginService = inject(LoginServiceService);
  public authService = inject(AuthService);
  public recoverPasswordService = inject(RecoverPasswordService);

  public modalAlertLogin = false;
  public modalMessage = '';


  openModal(): void {
    this.modalAlertLogin = true;
  }

  closeModal(): void {
    this.modalAlertLogin = false;
  }
  
  public iconosModal: any;

  constructor(private sanitizer: DomSanitizer) {
    this.iconosModal = {
      alert: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `),
      mail: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
        </svg>
      `)
    };
  }

  public httpHome(): void {
    this.loginService.loginUser(this.name, this.password).subscribe({
      next: (data: any) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.authService.setLoggedIn(true);
          this.router.navigate(['/home']);
        }
        this.modalIconoShow = this.iconosModal.mail; // <-- Agrega esta línea
      },
      error: (e) => {
        this.modalMessage = e.error.message;
        this.modalIconoShow = this.iconosModal.alert; // <-- Agrega esta línea
        this.openModal();
      }
    });
  }

  public forgotPasswordMode = false;

  toggleForgotPassword() {
    this.forgotPasswordMode = !this.forgotPasswordMode;
    this.password = '';
    this.name = '';
    this.recoverEmail = '';
  }



  public modalIconoShow = '';


  // Recuperar contraseña

  recoverPassword() {

    this.recoverPasswordService.recoverPassword({user: this.recoverEmail}).subscribe({
      next: (data: any) => {
        this.modalMessage = data.message;
        this.openModal();
      },
      error: (e) => {
        this.modalMessage = e.error.message;
        this.openModal();
      }
    });


  }
}