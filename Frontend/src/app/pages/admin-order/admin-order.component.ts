import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { UppercasePipe } from '../../shared/pipes/UppercasePipe.pipe';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    CurrencyPipe,
    UppercasePipe,
  ],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderComponent implements OnInit {
  dataSource = new MatTableDataSource<Order>();
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';

  displayedColumns: string[] = [
    'id',
    'fullname',
    'email',
    'phone_number',
    'address',
    'note',
    'order_date',
    'shipping_method',
    'payment_method',
    'total_money',
    'status',
    'action',
  ];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.getAllOfOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllOfOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOfOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.orders;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.getAllOfOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: (response) => {
        console.log(response);
        location.reload();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  viewDetail(orderId: number) {
    this.router.navigate(['admin/order-details', orderId]);
  }
}
