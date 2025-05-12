import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public readonly ACCESS_TOKEN = 'access_token';

  constructor(private jwtHelperService: JwtHelperService) {}

  setToken(token: string) {
    return localStorage.setItem(this.ACCESS_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  removeToken(): void {
    return localStorage.removeItem(this.ACCESS_TOKEN);
  }

  getUserId() {
    const token = this.getToken();
    if (token) {
      let userObject = this.jwtHelperService.decodeToken(token);
      return 'user_id' in userObject ? userObject.user_id : 0;
    }
  }

  isExpiredToken(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelperService.isTokenExpired(token);
  }
}
