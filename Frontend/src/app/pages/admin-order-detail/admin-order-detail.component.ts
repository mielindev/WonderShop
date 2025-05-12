import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { OrderDetail } from '../../models/order-detail';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-detail',
  imports: [
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    CommonModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './admin-order-detail.component.html',
  styleUrl: './admin-order-detail.component.scss',
})
export class AdminOrderDetailComponent implements OnInit {
  orderId: number = 0;
  orderResponse: Order = {
    id: 0,
    user_id: 0,
    fullname: '',
    address: '',
    email: '',
    phone_number: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [],
    cart_items: [],
  };
  displayedColumns: string[] = [
    'id',
    'thumbnail',
    'product',
    'quantity',
    'price',
    'subtotal',
  ];
  orderStatuses: string[] = [
    'pending',
    'processing',
    'delivering',
    'delivered',
    'failed',
    'refunded',
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        const order_details = response.order_details.map(
          (orderDetail: OrderDetail) => {
            orderDetail.product.thumbnail = `${environment.baseUrl}products/images/${orderDetail.product.thumbnail}`;
            return orderDetail;
          }
        );
        this.orderResponse = { ...response, order_details };
        console.log(this.orderResponse);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  saveOrder() {
    const orderDTO = { ...this.orderResponse };
    this.orderService.updateOrder(orderDTO.id, orderDTO).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
