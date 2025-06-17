import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user';

export const authTokenRefreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const user = inject(UserService);

  if (!user.isLoggedIn()) {
    return next(req);
  }

  if (req.url.endsWith('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return auth.refresh().pipe(switchMap(() => next(req.clone())));
      }
      return throwError(() => err);
    })
  );
};
