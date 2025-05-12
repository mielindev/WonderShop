import { OrderDetail } from './order-detail';

export interface Order {
  id: number;
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  order_date: Date;
  status: string;
  total_money: number;
  shipping_address: string;
  shipping_date: Date;
  shipping_method: string;
  payment_method: string;
  order_details: OrderDetail[];

  cart_items: { product_id: number; quantity: number }[];
}
