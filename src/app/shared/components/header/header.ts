import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  get username(): string {
    return this.userService.user()?.name ?? 'User';
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['', '/']);
  }
}
