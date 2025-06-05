import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const authGuard: CanActivateFn = (route, state) => {
  
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (!token || token === null || token === undefined) {
    // If no token is found, redirect to the login page
     router.navigate.url("");
    return false;
  } 
  
  return true;
};
