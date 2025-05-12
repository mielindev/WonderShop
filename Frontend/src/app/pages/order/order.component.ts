import { Order } from './../../models/order';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { NgFor, NgIf } from '@angular/common';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-order',
  imports: [NgFor, CurrencyPipe, NgIf, ReactiveFormsModule, NgIf],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  cartItems: { product: Product; quantity: number }[] = [];
  totalAmount: number = 0;
  orderForm: FormGroup;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private tokenService: TokenService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.orderForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_method: ['standard'],
      payment_method: ['cod'],
    });
  }

  getCart(): Map<number, number> {
    return this.cartService.getCart();
  }

  ngOnInit(): void {
    this.cartService.cartObservable.subscribe((cart) => {
      const productIds = Array.from(cart.keys());
      if (productIds.length != 0) {
        this.productService.getProductsbyIds(productIds).subscribe({
          next: (response) => {
            this.cartItems = productIds.map((productId) => {
              const product = response.find((p) => p.id === productId);
              if (product) {
                product.url = `${environment.baseUrl}products/images/${product.thumbnail}`;
              }
              return {
                product: product!,
                quantity: cart.get(productId)!,
              };
            });
            this.caculatedTotal();
          },
          error: (error) => {
            console.log(
              '👉 ~ CartComponent ~ this.productService.getProductsbyIds ~ error:',
              error
            );
          },
        });
      }
    });
  }

  caculatedTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  handleRemoveItem(productId: number): void {
    this.cartService.removeCartItem(productId);

    // Filter out the removed item
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== productId
    );

    // Recalculate total
    this.caculatedTotal();
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  handleOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
    } else {
      const orderData: Order = this.orderForm.value;
      orderData.user_id = this.tokenService.getUserId();
      orderData.cart_items = this.cartItems.map((cartItem) => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      }));
      console.log(orderData);
      this.orderService.createOrder(orderData).subscribe({
        next: (response: any) => {
          console.log('response', response);
          this.toastr.success('', 'Đặt hàng thành thông');
          this.router.navigate(['order-details', response.id]);
          this.orderForm.reset();
          this.cartService.clearCart();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
