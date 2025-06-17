import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { Button } from '../../shared/components/button/button';
import { InputWithIcon } from '../../shared/components/input-with-icon/input-with-icon';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Button,
    InputWithIcon,
    LucideAngularModule,
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly auth: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  submitted = signal(false);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: this.fb.nonNullable.control('', Validators.required),
  });

  get name(): FormControl<string> {
    return this.form.controls.name;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get password(): FormControl<string> {
    return this.form.controls.password;
  }

  get confirmPassword(): FormControl<string> {
    return this.form.controls.confirmPassword;
  }

  passwordsMatch = computed(
    () => this.password.value === this.confirmPassword.value
  );

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.passwordsMatch()) return;

    const { name, email, password } = this.form.getRawValue();
    this.auth.signup({ name, email, password }).subscribe({
      next: () => this.router.navigate(['', 'login']),
      error: (err: Error) => console.error('Signup failed:', err),
    });
  }
}
