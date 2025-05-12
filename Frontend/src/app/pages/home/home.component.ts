import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environments/environment';
import { Product } from '../../models/product';
import { UppercasePipe } from '../../shared/pipes/UppercasePipe.pipe';

@Component({
  selector: 'app-home',
  imports: [NgFor, CurrencyPipe, UppercasePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  selectedCategory: number = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts(
      this.currentPage,
      this.itemsPerPage,
      this.selectedCategory
    );
  }

  getProducts(page: number, limit: number, category_id: number) {
    this.productService.getProducts(page, limit, category_id).subscribe({
      next: (response) => {
        response.products.forEach((product: Product) => {
          product.url = product.thumbnail
            ? `${environment.baseUrl}products/images/${product.thumbnail}`
            : `https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.log('Error when fetching products: ', error);
      },
    });
  }
  handleNavigateProductDetail(id: number) {
    this.router.navigate(['/product-detail', id]);
  }
}
