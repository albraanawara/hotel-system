import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem("token");

  if (token) {
    return true; // مسموح
  } else {
    router.navigate(['/']); // يرجعه للـ login
    return false;
  }
};
