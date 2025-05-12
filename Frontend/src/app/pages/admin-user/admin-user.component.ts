import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { CapitalizeFirstPipe } from '../../shared/pipes/CapitalizeFirstPipe.pipe';

@Component({
  selector: 'app-admin-user',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    CapitalizeFirstPipe,
  ],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss',
})
export class AdminUserComponent implements OnInit {
  dataSource = new MatTableDataSource<User>();
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  displayedColumns: string[] = [
    'id',
    'fullname',
    'phone_number',
    'address',
    'date_of_birth',
    'role',
    'action',
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllUsers(keyword: string, page: number, limit: number) {
    return this.userService.getAllUsers(keyword, page, limit).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataSource = response.users;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  lockUser(userId: number) {
    this.userService.lockUser(userId).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, response.status);
        location.reload();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Something went wrong');
      },
    });
  }

  onChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.getAllUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }
}
