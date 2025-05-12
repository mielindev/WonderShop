import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CapitalizeFirstPipe } from '../../shared/pipes/CapitalizeFirstPipe.pipe';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, CapitalizeFirstPipe, NgIf],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  userForm!: FormGroup;
  user = {
    id: 0,
    fullname: '',
    address: '',
    date_of_birth: '',
    role: '',
    phone_number: '',
  };
  isChangeInformaion = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      fullname: [''],
      address: [''],
      date_of_birth: [''],
      old_password: [''],
      new_password: [''],
      facebook_account_id: [0],
      google_account_id: [0],
    });
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.userService.getUserDetail(token).subscribe({
        next: (response) => {
          console.log(
            '👉 ~ UserDetailComponent ~ this.userService.getUserDetail ~ response:',
            response
          );
          const formattedDate = new Date(response.date_of_birth)
            .toISOString()
            .split('T')[0];
          this.userForm.patchValue({
            fullname: response.fullname,
            address: response.address,
            date_of_birth: formattedDate,
            facebook_account_id: response.facebook_account_id,
            google_account_id: response.google_account_id,
          });
          this.user = {
            id: response.id,
            role: response.role.name,
            phone_number: response.phone_number,
            fullname: response.fullname,
            address: response.address,
            date_of_birth: formattedDate,
          };
        },
      });
    }
  }

  onSubmit(): void {
    console.log(this.userForm.value);
    if (this.userForm.invalid) return;

    const token = this.tokenService.getToken();

    this.userService
      .updateUser(this.userForm.value, this.user.id, token!)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success(
            'Vui lòng đăng nhập lại!',
            'Cập nhật thông tin thành công'
          );
          this.userService.logout();
          this.router.navigate(['auth/login']);
        },
        error: (error) => {
          this.toastr.error(
            'Vui lòng thử lại sau!',
            'Cập nhật thông tin thất bại'
          );
          console.log(error);
        },
        complete: () => {
          this.handleChangeInfo();
        },
      });
  }

  handleChangeInfo() {
    this.isChangeInformaion = !this.isChangeInformaion;
  }
}
