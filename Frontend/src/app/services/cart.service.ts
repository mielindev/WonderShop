import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Map<number, number> = new Map();
  private cartSubject = new BehaviorSubject<Map<number, number>>(this.cart);

  cartObservable = this.cartSubject.asObservable();

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    const storeCart = localStorage.getItem('cart');
    if (storeCart) {
      this.cart = new Map(JSON.parse(storeCart));
      this.cartSubject.next(this.cart);
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      this.cart.set(productId, quantity);
    }
    this.saveCart();
    this.toastr.success('', 'Thêm sản phẩm vào giỏ hàng thành công');
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  clearCart(): void {
    this.cart.clear();
    this.saveCart();
  }

  removeCartItem(productId: number): void {
    this.cart.delete(productId);
    this.saveCart();
    this.toastr.success('', 'Xoá sản phẩm giỏ hàng thành công');
  }

  increaseQuantity(productId: number) {
    this.cart.set(productId, this.cart.get(productId)! + 1);
    this.saveCart();
  }

  decreaseQuantity(productId: number) {
    if (this.cart.has(productId) && this.cart.get(productId)! > 1) {
      this.cart.set(productId, this.cart.get(productId)! - 1);
    }
    this.saveCart();
  }

  private saveCart(): void {
    if (this.cart.size === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem(
        'cart',
        JSON.stringify(Array.from(this.cart.entries()))
      );
    }
    this.cartSubject.next(new Map(this.cart)); // 🚨 Emit new cart data
  }
}
