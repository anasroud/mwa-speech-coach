import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUser {
  private http = inject(HttpClient);
  private url = environment.api + '/auth/users';

  list(page = 1, limit = 10) {
    return this.http
      .get<{ success: true; data: UserDto[]; meta: PageMeta }>(
        `${this.url}?page=${page}&limit=${limit}`
      )
      .pipe(map((r) => r));
  }

  toggleActive(id: string, isActive: boolean): Observable<unknown> {
    return this.http.patch(`${this.url}/${id}`, { isActive });
  }
}
