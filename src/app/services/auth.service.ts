import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<IUser | null>;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
  }

  public get currentUserValue(): IUser | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<IUser> {
    return this.http
      .post<{ user: IUser; accessToken: string }>(
        `${this.apiUrl}/api/auth/login`,
        { username, password }
      )
      .pipe(
        tap((response) => {
          const user = { ...response.user, accessToken: response.accessToken };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        map((response) => response.user)
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<IUser> {
    return this.http
      .post<{ user: IUser; accessToken: string }>(
        `${this.apiUrl}/api/auth/register`,
        { username, email, password }
      )
      .pipe(
        tap((response) => {
          const user = { ...response.user, accessToken: response.accessToken };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        map((response) => response.user)
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
