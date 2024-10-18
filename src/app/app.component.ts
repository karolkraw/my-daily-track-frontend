import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-daily-track';
  constructor(public authService: AuthService) {}
  logout(): void {
    //this.authService.logout();
  }
  isLoggedIn(): boolean {
    return true;
    //return this.authService.isLoggedIn();
  }
}
