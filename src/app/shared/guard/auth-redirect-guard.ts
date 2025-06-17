import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user';

export const authRedirectGuard: CanActivateFn = () => {
  const user = inject(UserService);
  const router = inject(Router);

  if (user.isLoggedIn()) {
    router.navigate(['', 'dashboard']);
    return false;
  }

  return true;
};
