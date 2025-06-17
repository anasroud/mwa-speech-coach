import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { UserService } from '../../shared/services/user';
import { Button } from '../../shared/components/button/button';
import { InputWithIcon } from '../../shared/components/input-with-icon/input-with-icon';
import { LucideAngularModule } from 'lucide-angular';
import { Token } from '../../types/token';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Button,
    InputWithIcon,
    LucideAngularModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly auth: AuthService = inject(AuthService);
  private readonly user: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  submitted = signal(false);
  loginError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get password(): FormControl<string> {
    return this.form.controls.password;
  }

  constructor() {
    if (this.user.isLoggedIn()) {
      this.router.navigate(['', 'dashboard']);
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.loginError.set(null);

    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.auth.signin({ email, password }).subscribe({
      next: ({ data }) => {
        const { accessToken, refreshToken } = data;

        const decoded: Token = JSON.parse(atob(accessToken.split('.')[1]));

        this.user.token.set(accessToken);
        this.user.refreshToken.set(refreshToken);
        this.user.user.set(decoded);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(decoded));

        this.router.navigate(['', 'dashboard']);
      },
      error: (err) => {
        const message = err?.error.error || err?.error?.message || err?.data;
        ('Login failed. Please try again.');
        this.loginError.set(message);
      },
    });
  }
}
