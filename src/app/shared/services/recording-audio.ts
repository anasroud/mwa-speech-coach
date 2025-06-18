import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PromptResp {
  success: true;
  data: { promptId: string; text: string };
}
interface UploadResp {
  success: true;
  data: { reportId: string };
}

@Injectable({ providedIn: 'root' })
export class RecordingApi {
  private http = inject(HttpClient);
  private api = environment.api;

  getPrompt(topic?: string) {
    const params = topic
      ? new HttpParams().set('promptType', topic)
      : undefined;
    console.log(params);
    return this.http.get<PromptResp>(`${this.api}/recording/prompt`, {
      params,
    });
  }

  getUploadUrl() {
    return this.http.post<{ success: true; data: { url: string; key: string } }>(
      `${this.api}/upload`,
      {}
    );
  }

  submitRecording(body: { key: string; promptId: string }) {
    return this.http.post<{ success: true; data: { reportId: string } }>(
      `${this.api}/recording`,
      body
    );
  }
  upload(audio: Blob, promptId: string) {
    const fd = new FormData();
    fd.append('audio', audio, 'record.m4a');
    fd.append('promptId', promptId);
    return this.http.post<UploadResp>(`${this.api}/recording`, fd);
  }
}
