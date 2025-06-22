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
import { toSignal } from '@angular/core/rxjs-interop';

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

  readonly passwordSignal = toSignal(this.form.controls.password.valueChanges, {
    initialValue: this.form.controls.password.value,
  });

  readonly confirmPasswordSignal = toSignal(this.form.controls.confirmPassword.valueChanges, {
    initialValue: this.form.controls.confirmPassword.value,
  });
  

  readonly passwordsMatch = computed(() => this.passwordSignal() === this.confirmPasswordSignal());


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
