import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  // injection
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const userService = inject(UserService);

  // get variable

  const isExpiredToken = tokenService.isExpiredToken();
  const isUservalid = tokenService.getUserId() > 0;
  const user = userService.getUserLocal();
  const isAdminRole = user.role.id === 2 ? true : false;
  console.log('👉 ~ isAdminRole:', isAdminRole);
  console.log('👉 ~ user:', user.role.id);
  if (!isExpiredToken && isUservalid && isAdminRole) return true;

  router.navigate(['']);
  return false;
};
