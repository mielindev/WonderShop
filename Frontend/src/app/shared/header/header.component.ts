import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { NgIf } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  user?: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.userService.getUserDetail(token).subscribe({
        next: (response) => {
          this.user = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.user = this.userService.getUserLocal();
    }
  }

  handleMatMenu(index: number) {
    switch (index) {
      case 0:
        this.router.navigate(['user-details']);
        console.log('Thông tin tài khoản');
        break;
      case 1:
        console.log('Thông tin đơn hàng');
        break;
      case 2:
        this.userService.logout();
        this.user = this.userService.getUserLocal();
        this.router.navigate(['']);
    }
  }
}
