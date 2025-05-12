import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterOutlet,
    MatMenuModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  user?: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const user = this.userService.getUserDetail(token).subscribe({
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
        break;

      case 1:
        this.userService.logout();
        this.user = this.userService.getUserLocal();
        this.router.navigate(['']);
    }
  }
}
