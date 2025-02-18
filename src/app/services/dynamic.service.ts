import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dynamic } from '../models/dynamic.model';

@Injectable({
  providedIn: 'root',
})
export class DynamicService {
  private apiUrl = 'http://localhost:3000/api/dynamics';

  constructor(private http: HttpClient) {}

  getDynamicsByIndicator(indicatorId: string): Observable<Dynamic[]> {
    return this.http.get<Dynamic[]>(`${this.apiUrl}/${indicatorId}`)
  }

  addDynamic(dynamic: Partial<Dynamic>): Observable<Dynamic> {
    return this.http.post<Dynamic>(`${this.apiUrl}`, dynamic)
  }
}
