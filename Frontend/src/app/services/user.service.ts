import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { LoginResponse } from '../models/login';
import { User } from '../models/user';
import { TokenService } from './token.service';
import { CartService } from './cart.service';
import { UpdateUser } from '../models/update-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUser = `${environment.baseUrl}users`;
  private apiConfig = {
    headers: this.createHeader(),
  };

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private cartService: CartService
  ) {}

  private createHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
    });
  }

  register(registerData: RegisterDTO): Observable<any> {
    return this.http.post(
      `${this.apiUser}/register`,
      registerData,
      this.apiConfig
    );
  }

  login(loginData: LoginDTO): Observable<any> {
    return this.http.post<LoginResponse>(
      `${this.apiUser}/login`,
      loginData,
      this.apiConfig
    );
  }

  getUserDetail(token: string) {
    return this.http.post<User>(`${this.apiUser}/details`, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  saveUserToLocal(user: User) {
    try {
      if (user) {
        return localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  }

  getUserLocal() {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user!);
      } else {
        return null;
      }
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.cartService.clearCart();
  }

  updateUser(userData: UpdateUser, userId: number, token: string) {
    return this.http.put(`${this.apiUser}/details/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllUsers(keyword: string, page: number, limit: number) {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    const token = this.tokenService.getToken();
    return this.http.get(`${this.apiUser}`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  lockUser(userId: number) {
    const token = this.tokenService.getToken();
    return this.http.delete(`${this.apiUser}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
