import { Product } from './product';

export interface OrderDetail {
  id: number;
  price: number;
  quantity: number;
  totalMoney: number;
  product: Product;
}
