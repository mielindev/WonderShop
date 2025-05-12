import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { LoginResponse } from '../../models/login';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loginForm = this.formBuilder.group({
      phone_number: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      password: ['', [Validators.required]],
      rememberMe: false,
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      const loginData = new LoginDTO({ ...this.loginForm.value });
      this.userService.login(loginData).subscribe({
        next: (response: LoginResponse) => {
          this.toastr.success('', response.message);
          this.tokenService.setToken(response.token);
          this.userService.getUserDetail(response.token).subscribe({
            next: (response: User) => {
              this.userService.saveUserToLocal(response);
              if (response.role.id === 2) {
                this.router.navigate(['admin']);
              } else if (response.role.id === 1) {
                this.router.navigate(['']);
              }
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: ({ error }) => {
          this.toastr.error(error.message, 'Something went wrong');
        },
      });
    }
  }
}
