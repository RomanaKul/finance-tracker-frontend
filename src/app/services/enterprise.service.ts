import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/enterprise.model';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  private apiUrl = "http://localhost:3000/api/enterprises" 

  constructor(private http: HttpClient) {}

  getEnterprises(): Observable<Enterprise[]> {
    return this.http.get<Enterprise[]>(this.apiUrl)
  }

  addEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.apiUrl, enterprise)
  }

  updateEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.put<Enterprise>(`${this.apiUrl}/${enterprise._id}`, enterprise)
  }

  deleteEnterprise(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`)
  }
}
