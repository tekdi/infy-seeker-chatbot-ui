import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);

  let isloggedIn= sessionStorage.getItem("isloggedIn");

  if(isloggedIn=='false'){
    alert("Please Sign In, redirecting to Sign In page.");
    _router.navigate(['sign-in']);
    return false;
  }
  
  return true;
};
