import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormErrorMessage } from '@free-spot/util';
import { ThemeService } from '../../../../src/lib/theme/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Theme } from '@free-spot/core/domain';
import { AuthService } from '@free-spot/core/data-access';

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
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _toastrService: ToastrService = inject(ToastrService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _themeService: ThemeService = inject(ThemeService);

  isLoginMode = true;
  hide = true;
  themeSig = this._themeService.themeSig;
  THEME = Theme;

  authForm: FormGroup = this._formBuilder.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    username: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

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
      this._authService
        .login({
          identifier: this.authForm.controls['identifier'].value,
          password: this.authForm.controls['password'].value,
        })
        .subscribe({
          next: () => {
            this._router.navigate(['/home']);
          },
          error: (error) => this._handleError(error),
        });
    } else {
      this._authService
        .signup({
          email: this.authForm.controls['email'].value,
          username: this.authForm.controls['username'].value,
          password: this.authForm.controls['password'].value,
        })
        .subscribe({
          next: () => {
            this._router.navigate(['/home']);
          },
          error: (error) => this._handleError(error),
        });
    }

    this.authForm.reset();
    formDirective.resetForm();
  }

  private _handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Unknown error';

    if (Array.isArray(error.error?.issues) && error.error.issues.length > 0) {
      errorMessage = error.error.issues.map((issue: { message: string }) => issue.message).join('\n');
    } else if (typeof error.error?.error === 'string') {
      errorMessage = error.error.error;
    } else if (typeof error.error?.message === 'string') {
      errorMessage = error.error.message;
    }

    this._toastrService.error(errorMessage, '', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      onActivateTick: true,
      positionClass: 'toast-bottom-center',
    });
  }
}

export default AuthComponent;
