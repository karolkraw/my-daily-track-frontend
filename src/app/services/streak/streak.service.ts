import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Streak } from '../../models/streak.model';


@Injectable({
  providedIn: 'root'
})
export class StreakService {
  private apiUrl = 'http://localhost:8080/api/streaks';

  constructor(private http: HttpClient) { }

  getStreaks(sectionName: string): Observable<Streak[]> {
    return this.http.get<Streak[]>(`${this.apiUrl}/${sectionName}`);
  }

  createStreak(newStreak: Streak, sectionName: string): Observable<Streak> {
    return this.http.post<Streak>(`${this.apiUrl}/${sectionName}`, newStreak);
  }

  deleteStreak(name: string, sectionName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${name}/${sectionName}`);
  }

  resetStreak(streak: Streak, sectionName: string): Observable<Streak> {
    return this.http.patch<Streak>(`${this.apiUrl}/${sectionName}`, streak);
  }
}

