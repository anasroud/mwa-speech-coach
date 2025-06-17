import { Component, inject } from '@angular/core';
import { Badge } from '../../shared/components/badge/badge';
import { LucideAngularModule } from 'lucide-angular';
import { Button } from '../../shared/components/button/button';
import { SectionWrapper } from '../../shared/components/section-wrapper/section-wrapper';
import { InfoCard } from '../../shared/components/info-card/info-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [Badge, LucideAngularModule, Button, SectionWrapper, InfoCard],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
  private readonly router = inject(Router);

  infoCards = [
    {
      icon: 'mic',
      title: 'Smart Recording',
      description:
        'High-quality audio capture with noise reduction and automatic optimization',
      mainTheme: 'rgb(224, 231, 255)',
      iconTheme: 'rgb(79, 70, 229)',
    },
    {
      icon: 'chart-bar',
      title: 'Ai Analysis',
      description:
        'Advanced metrics including pace, filler words, tone, and emotional analysis',
      mainTheme: 'rgb(243, 232, 255)',
      iconTheme: 'rgb(147, 51, 234)',
    },
    {
      icon: 'target',
      title: 'Personalized Tips',
      description:
        'Actionable feedback tailored to your specific speaking style and goals',
      mainTheme: 'rgb(220, 252, 231)',
      iconTheme: 'rgb(22, 163, 74)',
    },
    {
      icon: 'users',
      title: 'Progress Tracking',
      description:
        'Monitor your improvement over time with detailed analytics and reports',
      mainTheme: 'rgb(255, 237, 213)',
      iconTheme: 'rgb(234, 88, 12)',
    },
  ];

  navigateRecord() {
    this.router.navigate(['/recording']);
  }
}
