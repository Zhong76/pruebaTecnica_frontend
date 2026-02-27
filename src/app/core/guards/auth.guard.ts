import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const raw = localStorage.getItem('session');
  if (!raw) {
    router.navigateByUrl('/login');
    return false;
  }
  try {
    const session = JSON.parse(raw);
    if (!session?.token) {
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  } catch {
    router.navigateByUrl('/login');
    return false;
  }
};