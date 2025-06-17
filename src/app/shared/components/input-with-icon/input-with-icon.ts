import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-input-with-icon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './input-with-icon.html',
  styleUrls: ['./input-with-icon.scss'],
})
export class InputWithIcon {
  @Input({ required: true }) control!: FormControl;
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() icon: string = 'mail';
  @Input() placeholder: string = '';
  @Input() submitted: boolean = false;

  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  get inputType(): string {
    return this.type === 'password' && this.showPassword() ? 'text' : this.type;
  }

  shouldShowError(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }
}
