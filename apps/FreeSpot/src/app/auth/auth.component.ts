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
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, AuthService } from '@free-spot-service/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormErrorMessage } from '@free-spot/util';
import { ThemeService } from '../theme/theme.service';
import { Theme } from '@free-spot/enums';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
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
    firstName: [''],
    familyName: [''],
    email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.authForm.controls['firstName'].disable();
      this.authForm.controls['familyName'].disable();
    } else {
      this.authForm.controls['firstName'].enable();
      this.authForm.controls['familyName'].enable();
      this.authForm.controls['firstName'].setValidators([Validators.required, Validators.minLength(3)]);
      this.authForm.controls['familyName'].setValidators([Validators.required, Validators.minLength(3)]);
    }

    this.authForm.reset();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    let authObs: Observable<AuthResponse>;
    if (this.isLoginMode) {
      authObs = this._authService.logIn({
        email: this.authForm.controls['email'].value,
        password: this.authForm.controls['password'].value,
      });
    } else {
      authObs = this._authService.signUp({
        email: this.authForm.controls['email'].value,
        password: this.authForm.controls['password'].value,
        familyName: this.authForm.controls['familyName'].value,
        firstName: this.authForm.controls['firstName'].value,
      });
    }

    authObs.subscribe({
      next: () => {
        this._router.navigate(['/dashboard']);
      },
      error: (error) => this._handleError(error),
    });

    this.authForm.reset();
    formDirective.resetForm();
  }

  private _handleError(error: HttpErrorResponse): void {
    console.log(error);

    if (error instanceof HttpErrorResponse) {
      let errorMessage = 'UNKNOW_ERROR';
      if (error.error?.error) {
        errorMessage = error.error.error.message;
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
}

export default AuthComponent;
