import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthRequest } from '../../domain/request/auth.request';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  constructor(private router: Router, private authSrv: AuthService, private messageService: MessageService) { }
  errorMsg = '';
  form = new FormGroup({
    username: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] })
  })

  ngOnInit(): void {
    localStorage.removeItem('session');
  }

  login() {
    console.log('login');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Campos obligatorios', detail: 'Hay campos sin completar.', key: 'lg' });
      return;
    }
    const values = this.form.getRawValue();
    const request: AuthRequest = {
      username: values.username,
      _password: values.password
    }
    this.authSrv.login(request).subscribe(response => {
      console.log(response);
      if (response.ok === true) {
        this.router.navigate(['user-list']);
        this.messageService.add({ severity: 'success', summary: 'Login exitoso', detail: response.message, key: 'lg' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: response.message, key: 'lg' });
      }
    }, error => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: error.error?.message ?? 'Error desconocido', key: 'lg' });
    });
  }

  navigateToModUpdate() {
    this.router.navigate(['model', 'changepassword']);
  }

  navigateToModRegister() {
    this.router.navigate(['model', 'register']);
  }
}
