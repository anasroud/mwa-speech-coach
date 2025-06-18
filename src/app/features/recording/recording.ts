import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, firstValueFrom } from 'rxjs';

import { RecordingApi } from '../../shared/services/recording-audio';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, FormsModule, CommonModule, Button],
  templateUrl: './recording.html',
  styleUrl: './recording.scss',
})
export class Recording {
  private api = inject(RecordingApi);
  private router = inject(Router);

  loading = signal(false);
  topic = signal('');
  prompt = signal<{ promptId: string; text: string } | null>(null);
  improvise = signal(false);
  recState = signal<'idle' | 'recording' | 'done'>('idle');
  time = signal(0);
  error = signal<string | null>(null);

  canRecord = computed(() => !!this.prompt() || this.improvise());

  mediaRec?: MediaRecorder;
  chunks: Blob[] = [];

  requestPrompt() {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getPrompt(this.topic().trim())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => {
          this.improvise.set(false);
          this.prompt.set(r.data);
        },
        error: () => this.error.set('Failed to fetch prompt'),
      });
  }

  startImprov() {
    this.improvise.set(true);
    this.prompt.set(null);
    this.topic.set('');
    this.error.set(null);
    this.recState.set('idle');
    this.time.set(0);
  }

  async startRec() {
    this.error.set(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRec = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    this.chunks = [];
    this.mediaRec.ondataavailable = (e) => this.chunks.push(e.data);
    this.mediaRec.onstop = () => this.recState.set('done');
    this.mediaRec.start();
    this.recState.set('recording');
    this.tickTimer();
  }

  stopRec() {
    this.mediaRec?.stop();
  }

  private tickTimer() {
    const iv = setInterval(() => {
      if (this.recState() !== 'recording') return clearInterval(iv);
      this.time.update((t) => t + 1);
      if (this.time() >= 120) this.stopRec();
    }, 1000);
  }

  async submit() {
    if (this.time() < 10) {
      this.error.set('Recording must be at least 10 s');
      return;
    }

    this.loading.set(true);
    try {
      const { data: { url, key } } = await firstValueFrom(this.api.getUploadUrl());

      const blob = new Blob(this.chunks, { type: 'audio/webm' });
      await fetch(url, { method: 'PUT', body: blob });

      const promptId =
        this.improvise() ? 'improv' : this.prompt()?.promptId ?? '';
      const { data } = await firstValueFrom(
        this.api.submitRecording({ key, promptId })
      );

      this.router.navigate(['/reports', data.reportId]);
    } catch {
      this.error.set('Upload failed');
    } finally {
      this.loading.set(false);
    }
  }
}
