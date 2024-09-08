import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Reflection } from '../../models/reflection.model';


@Injectable({
  providedIn: 'root'
})
export class ReflectionService {
  private apiUrl = 'http://localhost:8080/api/reflections';

  constructor(private http: HttpClient) {}


  getReflectionByDate(sectionName: string, date: string): Observable<Reflection | null> {
    return this.http.get<Reflection>(`${this.apiUrl}/${sectionName}/${date}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log("No reflection found for this date.");
          return of(null);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  saveReflection(sectionName: string, created: string, content: string): Observable<Reflection> {
    const refl: Reflection = {content: content, created: created}
    return this.http.post<Reflection>(`${this.apiUrl}/${sectionName}`, refl);
  }

  getReflections(sectionName: string, page: number, pageSize: number): Observable<Reflection[]> {
    console.log("page " + page +    " pageSize " + pageSize)
    return this.http.get<Reflection[]>(`${this.apiUrl}/${sectionName}?page=${page}&pageSize=${pageSize}`);
  }

  getReflectionCount(sectionName: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${sectionName}/count`);
  }
}

