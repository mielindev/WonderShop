import { ProductImage } from './product-image';

export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  categoryId: number;
  url: string;
  product_image: ProductImage[];
}
