import { CartService } from './../../services/cart.service';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product-image';
import { environment } from '../../environments/environment';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgFor, NgClass, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product?: Product;
  currentImageIndex: number = 0;
  quantity: number = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe({
      next: (response: Product) => {
        console.log(
          '👉 ~ ProductDetailComponent ~ this.productService.getProductById ~ response:',
          response
        );
        if (response.product_image && response.product_image.length > 0) {
          response.product_image.forEach((item: ProductImage) => {
            item.image_url = `${environment.baseUrl}products/images/${item.image_url}`;
          });
        }
        this.product = response;

        this.showImage(0);
      },
      error: (error) => {
        console.log(
          '👉 ~ ProductDetailComponent ~ returnthis.productService.getProductById ~ error:',
          error
        );
      },
    });
  }

  showImage(index: number): void {
    if (
      this.product &&
      this.product.product_image &&
      this.product.product_image.length > 0
    ) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_image.length) {
        index = this.product.product_image.length - 1;
      }
    }
    this.currentImageIndex = index;
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (this.userService.getUserLocal()) {
      if (this.product) {
        return this.cartService.addToCart(this.product.id, this.quantity);
      }
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
