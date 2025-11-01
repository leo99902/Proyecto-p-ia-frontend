// src/app/modules/layout/header.navigation.component.component.ts

import { Component, inject, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common'; // Asegúrate de incluir NgFor
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs'; // Necesario para gestionar la desuscripción
import { takeUntil } from 'rxjs/operators'; // Operador para desuscripción
import { AuthService, MenuItem } from '../../services/auth.service/auth.service';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgIf,  // Necesario para *ngIf
    NgFor  // <-- ¡NECESARIO PARA *ngFor!
  ],
  templateUrl: './header.navigation.component.component.html',
  styleUrls: ['./header.navigation.component.component.scss']
})
export class HeaderNavigationComponentComponent implements OnInit, OnDestroy {
  public navVisible = false;
  public showModal = false;
  public timerCount = 60;
  private timerInterval: any;
  private destroy$ = new Subject<void>(); // Subject para manejar la desuscripción

  public rute = inject(Router);
  public authService = inject(AuthService); // <-- ¡INYECTA EL AUTHSERVICE!

  public isLoggedIn: boolean = false; // Estado del login para mostrar/ocultar elementos
  public menuItems$: Observable<MenuItem[]>; // Observable que contendrá los menús filtrados

  @Output() toggleChatbot = new EventEmitter<void>();

  constructor() {
    // Escuchar cambios en el estado de login desde el AuthService
    this.authService.isLoggedIn$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      // Opcional: Si el usuario cierra sesión y la navegación estaba abierta, ciérrala.
      if (!isLoggedIn) {
        this.closeNav();
      }
    });

    // Asignar el Observable de menús desde el AuthService
    this.menuItems$ = this.authService.userMenus$.pipe(
      takeUntil(this.destroy$) // Desuscribirse cuando el componente se destruye
    );
  }

  ngOnInit(): void {
    // Si necesitas alguna inicialización adicional al cargar el componente
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeNav() {
    this.navVisible = false;
  }

  onChatbotClick(): void {
    this.toggleChatbot.emit();
  }

  public showLogoutModal() {
    this.showModal = true;
    this.timerCount = 60;
    this.startTimer();
  }

  public confirmLogout() {
    this.stopTimer();
    this.performLogout();
  }

  public cancelLogout() {
    this.stopTimer();
    this.showModal = false;
  }

  private performLogout() {
    this.authService.logout(); // <-- ¡Llama al método logout del AuthService!
    this.showModal = false;
    this.navVisible = false;
    this.rute.navigate(['/']); // Redirigir al inicio/login
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
}