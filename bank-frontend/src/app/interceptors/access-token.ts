import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  return next(req.clone({
    withCredentials: true,
    ...(accessToken ? {setHeaders: { Authorization: `Bearer ${accessToken}` }} : {}),
  })).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuth = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh');
      if (err.status !== 401 || isAuth) {
        return throwError(() => err);
      }

      return authService.refresh().pipe(
        catchError((refreshError) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
        switchMap(() => {
          const newAccessToken = authService.getAccessToken();
          if (!newAccessToken) {
            return throwError(() => err);
          }

          return next(req.clone({
            withCredentials: true,
            setHeaders: { Authorization: `Bearer ${newAccessToken}`}
          }));
        })
      )
    })
  );
};
