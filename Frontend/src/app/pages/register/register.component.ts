import { UserService } from './../../services/user.service';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  private passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const retypePassword = group.get('retype_password')?.value;
    return password === retypePassword ? null : { passwordMismatch: true };
  };

  registerForm = this.formBuilder.group(
    {
      fullname: ['', Validators.required],
      phone_number: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      password: ['', [Validators.required]],
      retype_password: ['', [Validators.required]],
      term_checkbox: [false, Validators.requiredTrue],
    },
    { validators: this.passwordsMatchValidator }
  );

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    } else {
      const registerData = new RegisterDTO({
        ...this.registerForm.value,
        facebook_account_id: 0,
        google_account_id: 0,
      });
      this.userService.register(registerData).subscribe({
        next: (res) => {
          this.toastr.success(
            'Please login your account',
            'Register an account successfully'
          );
          this.router.navigate(['/auth/login']);
        },
        error: ({ error }) => {
          this.toastr.error(error.message, 'Something went wrong');
        },
      });
    }
  }
}
