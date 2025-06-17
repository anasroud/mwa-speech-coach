import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-wrapper',
  imports: [],
  templateUrl: './section-wrapper.html',
  styleUrl: './section-wrapper.scss',
})
export class SectionWrapper {
  title = input<string>();
  subTitle = input<string>();
}
