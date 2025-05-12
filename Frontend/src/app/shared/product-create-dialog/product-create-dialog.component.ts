import { Category } from './../../models/category';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-product-create-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './product-create-dialog.component.html',
  styleUrl: './product-create-dialog.component.scss',
})
export class ProductCreateDialogComponent implements OnInit {
  productForm: FormGroup;
  categories!: Category[];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''],
      thumbnail: [''],
      category_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        console.log(response);
        this.categories = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value); // return form data to parent
    }
  }

  onCancel() {
    this.dialogRef.close(); // close without returning data
  }
}
