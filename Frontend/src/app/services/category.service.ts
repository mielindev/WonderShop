import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategory = `${environment.baseUrl}categories`;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(this.apiCategory);
  }
}
