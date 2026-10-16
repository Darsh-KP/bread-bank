import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(AuthService).getAccessToken();

  if (!accessToken) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true,
  }));
};
