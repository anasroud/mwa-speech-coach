import {
  Component,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { AdminUser, UserDto } from '../../shared/services/admin-user';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements AfterViewInit {
  private api = inject(AdminUser);

  displayedColumns = ['name', 'email', 'status', 'action'];
  dataSource = new MatTableDataSource<UserDto>([]);
  total = signal(0);
  limit = 10;
  pageIdx = 0;
  loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.api.list(this.pageIdx + 1, this.limit).subscribe({
      next: (r) => {
        console.log(r);
        this.loading.set(false);
        this.dataSource.data = r.data;
        this.total.set(r.meta?.total ?? 0);
      },
      error: () => this.loading.set(false),
    });
  }

  pageChange(ev: PageEvent) {
    this.pageIdx = ev.pageIndex;
    this.limit = ev.pageSize;
    this.fetch();
  }

  toggle(user: UserDto) {
    const newState = !user.isActive;
    this.api.toggleActive(user._id, newState).subscribe(() => {
      const idx = this.dataSource.data.findIndex((u) => u._id === user._id);
      if (idx > -1) this.dataSource.data[idx].isActive = newState;
      this.dataSource._updateChangeSubscription();
    });
  }
}
