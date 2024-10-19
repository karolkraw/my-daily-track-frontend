import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';
  private tokenKey = 'auth-token';
  constructor(private http: HttpClient, private router: Router) { }
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
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']); 
  }
  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  } 
}