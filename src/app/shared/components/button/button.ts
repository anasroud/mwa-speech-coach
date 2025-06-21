import { Component, input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {
  content = input<string>();
  leftIcon = input<string>();
  rightIcon = input<string>();
  backgroundColor = input<string>('white');
  textColor = input<string>('black');
  hoverBackgroundImg = input<string>();
  hoverBackgroundColor = input<string>();
  backgroundImg = input<string>();
  height = input<string>();
  width = input<string>('fit-content');
  type = input<string>('button');
  disabled = input<boolean>(false);

  hovering = signal(false);

  buttonStyles = computed(() => ({
    backgroundColor: this.disabled()
      ? '#ccc'
      : this.hovering() && this.hoverBackgroundColor()
      ? this.hoverBackgroundColor()
      : this.backgroundColor(),
    backgroundImage:
      this.hovering() && !this.disabled()
        ? this.hoverBackgroundImg() || 'none'
        : this.backgroundImg() || 'none',
    color: this.disabled() ? '#888' : this.textColor(),
    height: this.height(),
    width: this.width(),
    cursor: this.disabled() ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
  }));
}
