import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatInputModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  isLoginMode = true;

  authForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    familyName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formDirective: FormGroupDirective): void {
    let authObs: Observable<AuthResponse>;
    if (this.isLoginMode) {
      authObs = this.authService.logIn({
        email: this.authForm.controls['email'].value,
        password: this.authForm.controls['password'].value,
      });
      console.log('login');
    } else {
      authObs = this.authService.signUp({
        email: this.authForm.controls['email'].value,
        password: this.authForm.controls['password'].value,
      });
    }

    authObs.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => console.log(error),
    });

    this.authForm.reset();
    formDirective.resetForm();
  }
}

export default AuthComponent;
