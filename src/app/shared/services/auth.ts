import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const accessTokenSignal = signal<string | null>(null);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.api + '/auth';

  signup(body: { name: string; email: string; password: string }) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/signup`, body);
  }

  signin(body: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/signin`, body)
      .pipe(tap((r) => this.setTokens(r.data)));
  }

  refresh() {
    const refreshToken = localStorage.getItem('refreshToken') ?? '';

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(
        tap((r) => {
          this.setTokens(r.data);
          location.reload();
        })
      );
  }
  private setTokens(t: { accessToken: string; refreshToken: string }) {
    accessTokenSignal.set(t.accessToken);
    localStorage.setItem('accessToken', t.accessToken);
    localStorage.setItem('refreshToken', t.refreshToken);
  }
}
