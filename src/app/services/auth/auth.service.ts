import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your Spring Boot backend URL
  private tokenKey = 'auth-token';
  constructor(private http: HttpClient, private router: Router) { }
  // Method to log in a user and store the JWT token
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, { username, password })
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            return true;
          }
          return false;
        })
      );
  }
  // Method to log out a user by removing the JWT token
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']); 
  }
  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }
  // Method to get the JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  } 
}