import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LucideAngularModule } from 'lucide-angular';

import { UserService } from '../../shared/services/user';
import { RecordingService } from '../../shared/services/recording';

import { Button } from '../../shared/components/button/button';
import { InfoCard } from '../../shared/components/info-card/info-card';
import { environment } from '../../../environments/enviroment';
import { Recording, Stats } from '../../types/responses';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    InfoCard,
    LucideAngularModule,
    MatPaginatorModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly user = inject(UserService);
  private readonly recSvc = inject(RecordingService);
  private readonly router = inject(Router);
  playingId = signal<string | null>(null);

  currentAudio?: HTMLAudioElement;

  pageSize = 3;
  total = signal(0);
  pageIndex = signal(0);
  recordings = signal<Recording[]>([]);
  stats = signal<Stats | null>(null);

  infoCards = computed(() => {
    const s = this.stats();
    return [
      {
        icon: 'mic',
        title: 'Total Recordings',
        description: s ? String(s.totalRecordings) : '',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(79, 70, 229)',
      },
      {
        icon: 'star',
        title: 'Average Score',
        description: s ? s.averageScore.toFixed(1) : '',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(147, 51, 234)',
      },
      {
        icon: 'clock',
        title: 'Hours Practiced',
        description: s ? s.hoursPracticed.toFixed(1) : '',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(22, 163, 74)',
      },
      {
        icon: 'trending-up',
        title: 'Improvement',
        description: s
          ? `${s.improvement >= 0 ? '+' : ''}${s.improvement.toFixed(1)}%`
          : '',
        mainTheme: 'rgb(243, 244, 246)',
        iconTheme: 'rgb(234, 88, 12)',
      },
    ];
  });

  constructor() {
    this.fetchPage();
    this.recSvc.stats().subscribe((s) => this.stats.set(s));
  }

  fetchPage() {
    this.recSvc
      .list(this.pageIndex() + 1, this.pageSize)
      .subscribe(({ data, meta }) => {
        this.recordings.set(data);
        this.total.set(meta.total);
      });
  }

  pageChange(ev: PageEvent) {
    this.pageIndex.set(ev.pageIndex);
    this.fetchPage();
  }

  remove(id: string) {
    this.recSvc.delete(id).subscribe(() => this.fetchPage());
  }

  view(id: string) {
    this.router.navigate(['/reports', id]);
  }
  play(rec: Recording) {
    if (this.playingId() === rec._id) {
      this.currentAudio?.pause();
      this.playingId.set(null);
      return;
    }

    this.currentAudio?.pause();
    this.currentAudio = new Audio(environment.api + rec.audioUrl);
    this.currentAudio.crossOrigin = 'anonymous';
    this.currentAudio.play();
    this.playingId.set(rec._id);
  }

  get username() {
    return this.user.user()?.name ?? 'User';
  }

  navigateRecord() {
    this.router.navigate(['/recording']);
  }
}
