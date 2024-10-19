import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {

  constructor(public authService: AuthService, private router: Router) {}

  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}