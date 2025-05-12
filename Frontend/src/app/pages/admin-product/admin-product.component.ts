import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CurrencyPipe } from '../../shared/pipes/CurrencyPipe.pipe';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProductCreateDialogComponent } from '../../shared/product-create-dialog/product-create-dialog.component';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CurrencyPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.scss',
})
export class AdminProductComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>();
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  keyword: string = '';
  displayedColumns: string[] = [
    'id',
    'thumbnail',
    'name',
    'description',
    'price',
    'category_id',
    'action',
  ];
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProducts(this.currentPage, this.itemsPerPage, 0);
  }

  getAllProducts(page: number, limit: number, category_id: number) {
    this.productService.getProducts(page, limit, category_id).subscribe({
      next: (response) => {
        response.products.forEach((product: Product) => {
          product.thumbnail = `${environment.baseUrl}products/images/${product.thumbnail}`;
        });
        this.dataSource = response.products;
        this.totalPages = response.totalPages;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.getAllProducts(this.currentPage, this.itemsPerPage, 0);
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, response.status);
        location.reload();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Something went wrong');
      },
    });
  }

  openCreateProductDialog() {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((newProduct) => {
      if (newProduct) {
        // Handle the new product returned from the dialog
        this.createProduct(newProduct);

        // TODO: Send newProduct to your API (createProduct API call)
      }
    });
  }

  createProduct(newProduct: Product): void {
    this.productService.createProduct(newProduct).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, 'Product created successfully');
        this.getAllProducts(this.currentPage, this.itemsPerPage, 0); // Refresh the product list
      },
      error: (error) => {
        this.toastr.error(error.message, 'Failed to create product');
      },
    });
  }
}
