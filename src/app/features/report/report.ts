import { Component, computed, inject, signal } from '@angular/core';
import { RecordingService } from '../../shared/services/recording';
import { ReportResponse } from '../../types/responses';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../shared/components/button/button';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Badge } from '../../shared/components/badge/badge';
import { environment } from '../../../environments/environment';
import { InfoCard } from '../../shared/components/info-card/info-card';

@Component({
  selector: 'app-report',
  imports: [Button, LucideAngularModule, CommonModule, Badge, InfoCard],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  recSer = inject(RecordingService);

  currentAudio?: HTMLAudioElement;
  playingId = signal<string | null>(null);
  reportId = signal<string>(this.route.snapshot.paramMap.get('id')!);
  reportInfo = signal<Partial<ReportResponse>>({});

  infoCards = computed(() => {
    const s = this.reportInfo();
    return [
      {
        icon: 'trending-up',
        title: s ? String(s.metrics?.wpm || 0) : '',
        description: 'Words per Minute',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(79, 70, 229)',
      },
      {
        icon: 'clock',
        title: s
          ? String(((s.metrics?.avgPauseMs || 0) / 1000).toFixed(1)) + 's'
          : '',
        description: 'Average Pause Time',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(147, 51, 234)',
      },
      {
        icon: 'zap',
        title: (s ? String(s.metrics?.score.toFixed(1) || 0) : '0') + '%',
        description: 'Score Achieved',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(22, 163, 74)',
      },
      {
        icon: 'circle-alert',
        title:
          (s ? String(((s.metrics?.fillerRate || 0) * 100).toFixed(1)) : '0') +
          '%',
        description: 'Filler Rate',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(234, 88, 12)',
      },
    ];
  });
  constructor() {
    this.fetchReport();
  }

  fetchReport() {
    this.recSer
      .getReport(this.reportId())
      .subscribe((data) => this.reportInfo.set(data));
  }

  navigateDashboard() {
    this.router.navigate(['/dashboard']);
  }

  play(id?: string, url?: string) {
    if (!id || !url) return;
    if (this.playingId() === id) {
      this.currentAudio?.pause();
      this.playingId.set(null);
      return;
    }

    this.currentAudio?.pause();
    this.currentAudio = new Audio(environment.api + url);
    this.currentAudio.crossOrigin = 'anonymous';
    this.currentAudio.play();
    this.playingId.set(id);
  }
}
