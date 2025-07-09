import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';
import { ChangePasswordService } from '../../../services/change.password.service/change.password.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

@Component({
  selector: 'app-nav',
  imports: [NgIf, FormsModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  showMenu = false;

  // Modal de cierre de sesión
  showModal = false;
  timerCount = 60;
  private timerInterval: any;

  // Estado para la modal de cambiar contraseña
  showChangePasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = '';

  userName = '';

  public router = inject(Router);
  public authService = inject(AuthService);
  public changePasswordService = inject(ChangePasswordService);

  constructor() {
    const token = this.authService.getToken?.() || localStorage.getItem('token');
    if (token) {
      const payload = decodeJwt(token);
      this.userName = payload.name || payload.username || payload.email || 'Usuario';
    } else {
      this.userName = 'Usuario';
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  cambiarContrasena() {
    this.showMenu = false;
    this.showChangePasswordModal = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  submitChangePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas nuevas no coinciden.';
      return;
    }

    // Envía los campos con los nombres correctos
    this.changePasswordService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        this.passwordSuccess = res?.message || '¡Contraseña cambiada exitosamente!';
        setTimeout(() => this.closeChangePasswordModal(), 1500);
      },
      error: (err) => {
        this.passwordError = err.error?.message || 'Error al cambiar la contraseña.';
      }
    });
  }

  cerrarSesion() {
    this.showMenu = false;
    this.showModal = true;
    this.timerCount = 60;
    this.startTimer();
  }

  confirmLogout() {
    this.stopTimer();
    this.performLogout();
  }

  cancelLogout() {
    this.stopTimer();
    this.showModal = false;
  }

  private performLogout() {
    this.authService.logout();
    this.showModal = false;
    this.router.navigate(['/']);
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timerCount--;
      if (this.timerCount <= 0) {
        this.stopTimer();
        this.performLogout();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.showMenu = false;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}