import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  // injection
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Create variable
  const isExpiredToken = tokenService.isExpiredToken();
  const isUservalid = tokenService.getUserId() > 0;
  if (isExpiredToken || !isUservalid) {
    router.navigate(['auth/login']);
    return false;
  }
  return true;
};
