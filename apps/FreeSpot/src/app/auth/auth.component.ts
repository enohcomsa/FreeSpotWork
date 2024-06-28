import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, AuthService } from '@free-spot-service/auth';

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
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  isLoginMode = true;

  authForm: FormGroup = this._formBuilder.group({
    firstName: ['', [Validators.minLength(3)]],
    familyName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('firstName')?.setValidators([Validators.minLength(3)]);
    } else {
      this.authForm.get('firstName')?.setValidators([Validators.required, Validators.minLength(3)]);
    }
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
      });
    }

    authObs.subscribe({
      next: () => {
        this._router.navigate(['/dashboard']);
      },
      error: (error) => console.log(error),
    });

    this.authForm.reset();
    formDirective.resetForm();
  }
}

export default AuthComponent;
