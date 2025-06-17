import { Injectable, signal } from '@angular/core';
import { Token } from '../../types/token';

@Injectable({ providedIn: 'root' })
export class UserService {
  token = signal<string | null>(localStorage.getItem('accessToken'));
  refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));
  user = signal<Token | null>(this.loadUserFromStorage());

  private loadUserFromStorage(): Token | null {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        return JSON.parse(storedUser) as Token;
      } catch {
        return null;
      }
    }

    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      try {
        return JSON.parse(atob(storedAccessToken.split('.')[1])) as Token;
      } catch {
        return null;
      }
    }

    return null;
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return !!this.isAdmin;
  }

  logout(): void {
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    localStorage.clear();
  }
}
