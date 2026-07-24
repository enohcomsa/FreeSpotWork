import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService, ThemeService } from '@free-spot/core/data-access';
import { FormErrorMessage } from '@free-spot/shared/util';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'free-spot-app-auth',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly themeService = inject(ThemeService);

  isLoginMode = true;
  hide = true;

  readonly themeSig = this.themeService.themeSig;

  authForm: FormGroup = this.formBuilder.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    username: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  constructor() {
    this.authForm.controls['email'].disable();
    this.authForm.controls['username'].disable();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.authForm.controls['identifier'].enable();

      this.authForm.controls['email'].disable();
      this.authForm.controls['username'].disable();

      this.authForm.controls['identifier'].setValidators([Validators.required, Validators.minLength(3)]);
      this.authForm.controls['email'].clearValidators();
      this.authForm.controls['username'].clearValidators();
    } else {
      this.authForm.controls['identifier'].disable();

      this.authForm.controls['email'].enable();
      this.authForm.controls['username'].enable();

      this.authForm.controls['email'].setValidators([Validators.required, Validators.email]);
      this.authForm.controls['username'].setValidators([Validators.required, Validators.minLength(3)]);
    }

    this.authForm.controls['identifier'].updateValueAndValidity();
    this.authForm.controls['email'].updateValueAndValidity();
    this.authForm.controls['username'].updateValueAndValidity();
    this.authForm.controls['password'].updateValueAndValidity();

    this.authForm.reset();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.isLoginMode) {
      this.authService
        .login({
          identifier: this.authForm.controls['identifier'].value,
          password: this.authForm.controls['password'].value,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (error) => this.handleError(error),
        });
    } else {
      this.authService
        .signup({
          email: this.authForm.controls['email'].value,
          username: this.authForm.controls['username'].value,
          password: this.authForm.controls['password'].value,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (error) => this.handleError(error),
        });
    }

    this.authForm.reset();
    formDirective.resetForm();
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Unknown error';

    if (Array.isArray(error.error?.issues) && error.error.issues.length > 0) {
      errorMessage = error.error.issues.map((issue: { message: string }) => issue.message).join('\n');
    } else if (typeof error.error?.error === 'string') {
      errorMessage = error.error.error;
    } else if (typeof error.error?.message === 'string') {
      errorMessage = error.error.message;
    }

    this.snackBar.open(errorMessage, '', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}

export default AuthComponent;
