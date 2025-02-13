import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Indicator } from '../models/indicator.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private apiUrl = "http://localhost:3000/api/indicators"

  constructor(private http: HttpClient) {}

  getIndicators(enterpriseId: string): Observable<Indicator[]> {
    return this.http.get<Indicator[]>(`${this.apiUrl}/${enterpriseId}`)
  }

  addIndicator(indicator: Indicator): Observable<Indicator> {
    return this.http.post<Indicator>(this.apiUrl, indicator)
  }

  updateIndicator(indicator: Indicator): Observable<Indicator> {
    return this.http.put<Indicator>(`${this.apiUrl}/${indicator._id}`, indicator)
  }

  deleteIndicator(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`)
  }
}
