import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verifica si está en el navegador antes de acceder a localStorage
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;

  // Si no hay token, redirige al login y detiene la navegación
  if (!token) {
    if (isBrowser) {
      router.navigate(['/']);
      console.log('No puede entrar sin usuario y contrasena goty')
    }
    return false;
  }

  // Si hay token, permite la navegación
  return true;
};