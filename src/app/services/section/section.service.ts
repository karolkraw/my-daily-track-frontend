import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section } from '../../models/section.model';


@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private apiUrl = 'http://localhost:8080/api/sections';

  constructor(private http: HttpClient) { }

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl);
  }
  
  addSection(section: Section): Observable<Section> {
    return this.http.post<Section>(this.apiUrl, section);
  }

  deleteSection(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${name}`);
  }
}
