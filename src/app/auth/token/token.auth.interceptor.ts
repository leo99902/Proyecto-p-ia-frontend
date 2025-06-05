import { HttpInterceptorFn } from '@angular/common/http';

export const tokenAuthInterceptor: HttpInterceptorFn = (req, next) => {

    if (req.url.includes('/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    return next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }));
  } else {
    return next(req);
  }


  };
