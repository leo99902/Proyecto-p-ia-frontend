// src/app/modules/auth/login/form.login.user.pages.component.ts

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

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

  public httpHome(): void {
    // Se usan 'this.name' y 'this.password' directamente de los [(ngModel)]
    this.loginService.loginUser(this.name, this.password).subscribe({
      next: (data: any) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.authService.setLoggedIn(true);
          this.router.navigate(['/home']);
        }
      },
      error: (e) => {
        // Asegúrate de que siempre haya un mensaje, incluso si la API no lo proporciona
        this.modalMessage = e.error?.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.';
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




  // Recuperar contraseña

  recoverPassword() {

    this.recoverPasswordService.recoverPassword({user: this.recoverEmail}).subscribe({
      next: (data: any) => {
        this.modalMessage = data?.message || 'Solicitud enviada. Revisa tu correo.';
        this.openModal();
      },
      error: (e) => {
        this.modalMessage = e.error?.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.';
        this.openModal();
      }
    });


  }
}