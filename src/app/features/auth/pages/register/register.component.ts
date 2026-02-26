import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../core/services/auth.service';
import { userRequest } from '../../../users/domain/request/users.request';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  mode!: string;
  constructor(private router: Router, private authSrv: AuthService, private messageService: MessageService, private route: ActivatedRoute) { }
  title: string = ''
  inputconfirm: string = '';
  visibleinput: boolean = false;
  labelbtn: string = '';
  form = new FormGroup({
    username: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    newpassword: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    confirmPassword: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] })
  })

  ngOnInit(): void {
    this.mode = this.route.snapshot.paramMap.get('mode')!;
    console.log(this.mode);
    if (this.mode === 'changepassword') {
      this.title = 'Cambiar contraseña';
      this.inputconfirm = 'Confirmar Nueva Contraseña';
      this.visibleinput = true;
      this.labelbtn = 'Cambiar Contraseña';
    }

    if (this.mode === 'register') {
      this.title = 'Registro de usuario';
      this.inputconfirm = 'Confirmar contraseña';
      this.visibleinput = false;
      this.labelbtn = 'Crear Cuenta';
    }
  }

  register() {
    const username = this.form.get('username');
    const password = this.form.get('password');
    const newpassword = this.form.get('newpassword');
    const confirmPassword = this.form.get('confirmPassword');
    const email = this.form.get('email');
    username?.clearValidators();
    password?.clearValidators();
    newpassword?.clearValidators();
    confirmPassword?.clearValidators();
    email?.clearValidators();
    username?.setErrors(null);
    password?.setErrors(null);
    newpassword?.setErrors(null);
    confirmPassword?.setErrors(null);
    email?.setErrors(null);
    const values = this.form.getRawValue();
    switch (this.mode) {
      case 'changepassword':
        username?.setValidators([Validators.required]);
        password?.setValidators([Validators.required, Validators.minLength(4)]);
        newpassword?.setValidators([Validators.required, Validators.minLength(4)]);
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
        }
        const requestC = {
          username: values.username,
          oldPassword: values.password,
          newPassword: values.newpassword
        }
        this.authSrv.changePassword(requestC).subscribe(response => {
          if (response?.ok === true) {
            this.messageService.add({ severity: 'success', summary: 'Contraseña cambiada con éxito', detail: response.message, key: 'rg' });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1000);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error al cambiar contraseña', detail: response.message, key: 'rg' });
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error al cambiar contraseña', detail: error.error?.message ?? 'Error desconocido', key: 'rg' });
        })
        break;
      case 'register':
        username?.setValidators([Validators.required]);
        email?.setValidators([Validators.required, Validators.email]);
        password?.setValidators([Validators.required, Validators.minLength(4)]);
        confirmPassword?.setValidators([Validators.required, Validators.minLength(4)]);
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
        }
        if (this.form.value.password !== this.form.value.confirmPassword) {
          this.messageService.add({ severity: 'error', summary: 'Error de validación', detail: 'Las contraseñas no coinciden.', key: 'rg' });
          return;
        }
        const requestR: userRequest = {
          username: values.username,
          _password: values.password,
          email: values.email,
          _status: true
        }
        this.authSrv.register(requestR).subscribe(response => {
          if (response?.ok === true) {
            this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: response.message, key: 'rg' });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1000);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error al registrar', detail: response.message, key: 'rg' });
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error al registrar', detail: error.error?.message ?? 'Error desconocido', key: 'rg' });
        })
        break;
      default:
        console.error('Modo desconocido');
    }
  }

  cancel() {
    this.router.navigate(['login']);
  }
}
