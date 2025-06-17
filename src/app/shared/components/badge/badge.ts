import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  content = input.required<string>();
  icon = input<string>();
  padding = input<string>();
  backgroundColor = input<string>('white');
  textColor = input<string>('black');
  borderColor = input<string>('black');
  mainFontSize = input<string>();
}
