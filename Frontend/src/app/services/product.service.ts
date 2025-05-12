import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiProduct = `${environment.baseUrl}products`;
  private apiConfig = {
    headers: this.createHeader(),
  };
  private createHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
    });
  }
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getProducts(
    page: number,
    limit: number,
    category_id: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('category_id', category_id);
    return this.http.get<Product[]>(this.apiProduct, { params });
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiProduct}/${id}`);
  }

  getProductsbyIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('productIds', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiProduct}/by-ids`, { params });
  }

  deleteProduct(productId: number) {
    const token = this.tokenService.getToken();

    return this.http.delete(`${this.apiProduct}/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  createProduct(productData: Product) {
    const token = this.tokenService.getToken();
    return this.http.post(this.apiProduct, productData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
