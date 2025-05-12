import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgFor } from '@angular/common';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { OrderDetail } from '../../models/order-detail';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-detail',
  imports: [NgFor, CurrencyPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  OrderResponse: Order = {
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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        const order_details = response.order_details.map(
          (orderDetail: OrderDetail) => {
            orderDetail.product.thumbnail = `${environment.baseUrl}products/images/${orderDetail.product.thumbnail}`;
            return orderDetail;
          }
        );
        this.OrderResponse = { ...response, order_details };
        console.log(this.OrderResponse);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
