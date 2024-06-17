import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatInputModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  isLoginMode = true;

  authForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.authService.autoLogIn();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formDirective: FormGroupDirective): void {
    let authObs: Observable<AuthResponse>;
    if (this.isLoginMode) {
      authObs = this.authService.logIn(this.authForm.value);
      console.log('login');
    } else {
      authObs = this.authService.signUp(this.authForm.value);
    }

    authObs.subscribe(
      (res) => console.log(res),
      (error) => console.log(error)
    );

    this.authForm.reset();
    formDirective.resetForm();
  }
}

export default AuthComponent;
