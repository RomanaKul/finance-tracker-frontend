import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Enterprise } from '../models/enterprise.model';

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  private apiUrl = 'http://localhost:3000/api/enterprises';

  private enterprisesSubject = new BehaviorSubject<Enterprise[]>([]);
  private enterprises$: Observable<Enterprise[]> =
    this.enterprisesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEnterprises(): Observable<Enterprise[]> {
    this.http.get<Enterprise[]>(this.apiUrl).subscribe((data) => {
      this.enterprisesSubject.next(data);
    });
    return this.enterprises$;
  }

  refreshEnterprises() {
    this.http.get<Enterprise[]>(this.apiUrl).subscribe((data) => {
      this.enterprisesSubject.next(data);
    });
  }

  getEnterprise(id: string): Observable<Enterprise> {
    return this.http.get<Enterprise>(`${this.apiUrl}/${id}`);
  }

  addEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http
      .post<Enterprise>(this.apiUrl, enterprise)
      .pipe(tap(() => this.refreshEnterprises()));
  }

  updateEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http
      .put<Enterprise>(`${this.apiUrl}/${enterprise._id}`, enterprise)
      .pipe(tap(() => this.refreshEnterprises()));
  }

  deleteEnterprise(_id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${_id}`)
      .pipe(tap(() => this.refreshEnterprises()));
  }
}
