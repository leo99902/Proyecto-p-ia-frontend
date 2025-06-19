// src/app/modules/auth/login/form.login.user.pages.component.ts

import { Component, inject } from '@angular/core'; // Elimina 'NgModule', 'signal' si no los usas
import { FormsModule } from '@angular/forms'; // Para ngModel
import { NgIf } from '@angular/common';      // Para *ngIf

import { Router } from '@angular/router';
import { GetListUserService } from '../../services/get.list.user.service/get.list.user.service.service';
import { LoginServiceService } from '../../services/login.service/login.service.service';
import { AuthService } from '../../services/auth.service/auth.service';

@Component({
  selector: 'app-form-login-user',
  imports: [
    FormsModule,
    NgIf
    // Si usas componentes de Angular Material en este HTML (ej. MatButton, MatInput), impórtalos aquí.
  ],
  templateUrl: './form.login.user.pages.component.html',
  styleUrl: './form.login.user.pages.component.scss',
  standalone: true
})
export class FormLoginUserPagesComponent {
  public name = '';
  public password = '';

  public router = inject(Router);
  public getUser = inject(GetListUserService); // No usado en este código, pero se mantiene si lo necesitas
  public loginService = inject(LoginServiceService);
  public authService = inject(AuthService); // <-- ¡INYECTA EL AUTHSERVICE AQUÍ USANDO inject()!

  public valueInputs = {
    valueName: 'leo', // Si estos son valores por defecto, puedes eliminarlos si solo usas this.name/password
    valuePassword: ''
  };

  public users: any = { id: 123, nme: 'jose' }; // No usado en este código, se mantiene
  public usuarios: any; // No usado en este código, se mantiene

  public modalAlertLogin = false;
  public modalMessage = '';

  openModal() {
    this.modalAlertLogin = true;
  }

  closeModal() {
    this.modalAlertLogin = false;
  }

  public httpHome(): void {
    this.valueInputs.valueName = this.name;
    this.valueInputs.valuePassword = this.password;

    // Llamada al servicio de login
    this.loginService.loginUser(this.valueInputs.valueName, this.valueInputs.valuePassword).subscribe({
      next: (data: any) => {
        if (data.token) {
          localStorage.setItem('token', data.token);

          // ¡IMPORTANTE! Notifica al AuthService que el usuario está logueado.
          // Esto hará que el AuthService decodifique el token y prepare la lista de menús.
          this.authService.setLoggedIn(true); // <-- ¡AÑADE ESTA LÍNEA!

          this.router.navigate(['/home']); // Redirige a tu página principal después del login
        }
      },
      error: (e) => {
        this.modalMessage = e.error.message;
        this.openModal();
      }
    });
  }
}