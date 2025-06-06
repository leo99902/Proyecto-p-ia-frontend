import { HttpInterceptorFn } from '@angular/common/http';

export const tokenAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // No agregar el token en la petición de login
  if (req.url.includes('/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    return next(req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    }));
  } else {
    return next(req);
  }
};