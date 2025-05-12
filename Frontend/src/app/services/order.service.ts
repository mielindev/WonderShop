import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Order } from '../models/order';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiOrder = `${environment.baseUrl}orders`;
  private apiConfig = {
    headers: this.createHeader(),
  };
  private createHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
    });
  }
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  createOrder(orderData: Order) {
    return this.http.post(this.apiOrder, orderData, this.apiConfig);
  }

  getOrderById(orderId: number) {
    return this.http.get<Order>(`${this.apiOrder}/${orderId}`);
  }

  getAllOfOrders(keyword: string, page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('keyword', keyword);
    const token = this.tokenService.getToken();
    return this.http.get<Order[]>(`${this.apiOrder}/get-orders-by-keyword`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateOrder(orderId: number, orderData: Order) {
    const token = this.tokenService.getToken();
    return this.http.put(`${this.apiOrder}/${orderId}`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteOrder(orderId: number) {
    const token = this.tokenService.getToken();
    return this.http.delete(`${this.apiOrder}/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
