import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return true;
    /* if (!this.authService.isLoggedIn()) {
      return true; // Allow access if not logged in
    } else {
      this.router.navigate(['/products']); // Redirect to a different page if already logged in
      return false;
    } */
  } 
}