import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';

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

  upload(audio: Blob, promptId: string) {
    const fd = new FormData();
    fd.append('audio', audio, 'record.m4a');
    fd.append('promptId', promptId);
    return this.http.post<UploadResp>(`${this.api}/recording`, fd);
  }
}
