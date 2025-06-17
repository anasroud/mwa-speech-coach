import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import {
  PageMeta,
  ReportResponse,
  Stats,
  Recording,
} from '../../types/responses';

@Injectable({ providedIn: 'root' })
export class RecordingService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.api;

  list(page = 1, limit = 3): Observable<{ data: Recording[]; meta: PageMeta }> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<{ success: true; data: Recording[]; meta: PageMeta }>(
        `${this.api}/reports`,
        { params }
      )
      .pipe(map((r) => ({ data: r.data, meta: r.meta })));
  }

  stats(): Observable<Stats> {
    return this.http
      .get<{ success: true; data: Stats }>(`${this.api}/recording/stats`)
      .pipe(map((r) => r.data));
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.api}/reports/${id}`);
  }

  getReport(reportId: string): Observable<ReportResponse> {
    return this.http
      .get<{ success: true; data: ReportResponse; meta: PageMeta }>(
        `${this.api}/reports/${reportId}`
      )
      .pipe(map((r) => r.data));
  }
}
