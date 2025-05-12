import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import { UppercasePipe } from '../../shared/pipes/UppercasePipe.pipe';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    NgFor,
    CurrencyPipe,
    UppercasePipe,
    NgClass,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  selectedCategory = new FormControl<number>(0, { nonNullable: true });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts(
      this.currentPage - 1,
      this.itemsPerPage,
      this.selectedCategory.value
    );
    this.getCategories();
  }

  getProducts(page: number, limit: number, category_id: number) {
    this.productService.getProducts(page, limit, category_id).subscribe({
      next: (response) => {
        response.products.forEach((product: Product) => {
          product.url = `${environment.baseUrl}products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePagination(
          this.currentPage,
          this.totalPages
        );
      },
      error: (error) => {
        console.log('Error when fetching products: ', error);
      },
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (error) => {
        console.log('Error when fetching categories: ', error);
      },
    });
  }

  onChange(page: number) {
    this.currentPage = page;
    console.log(this.currentPage);
    this.getProducts(
      this.currentPage,
      this.itemsPerPage,
      this.selectedCategory.value
    );
  }

  generateVisiblePagination(currentPage: number, totalPages: number): number[] {
    const maxPages = 5;
    const haftPage = Math.floor(maxPages / 2);

    let startPage = Math.max(currentPage - haftPage, 1);
    let endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(endPage - maxPages + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  handleNavigateProductDetail(id: number) {
    this.router.navigate(['/product-detail', id]);
  }

  sortByCategory() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.getProducts(
      this.currentPage,
      this.itemsPerPage,
      this.selectedCategory.value
    );
  }
}
