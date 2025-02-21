import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyRateService {

  private apiUrl = 'http://localhost:3000/api/currency-rates'

  constructor(private http: HttpClient) {}

  getCurrencyRate(date: string): Observable<Currency> {
    return this.http.get<Currency>(`${this.apiUrl}/currencyRate/${date}`)
  }

  addCurrencyRate(currencyRate: Currency): Observable<Currency> {
    return this.http.post<Currency>(this.apiUrl, currencyRate)
  }
}
