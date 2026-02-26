import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-user-crud',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    FloatLabelModule,
    CheckboxModule,
    FormsModule,
    PasswordModule
  ],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css',
})
export class UserCrudComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user: any[] = [];
  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  form = new FormGroup({
    username: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, null),
    estado: new FormControl<boolean | null>(null, null)
  })

  ngOnInit() {
    console.log(this.user);
    const passwordCtrl = this.form.get('password');

    if (this.mode === 'edit' && this.user.length > 0) {
      this.form.patchValue({
        username: this.user[0]?.username,
        email: this.user[0]?.email,
        estado: this.user[0]?._status ?? false
      });
      passwordCtrl?.clearValidators();
      passwordCtrl?.reset();
      passwordCtrl?.updateValueAndValidity({ emitEvent: false });
    } else {
      this.form.reset({ estado: false, password: '12345' });
      passwordCtrl?.setValidators([Validators.required, Validators.minLength(4)]);
      passwordCtrl?.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.ngOnInit();
      console.log('Datos cargados correctamente');
    }
  }
  saveData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: any = {
      username: this.form.value.username,
      email: this.form.value.email,
      _password: this.form.value.password,
      _status: this.form.value.estado ?? false
    };

    if (this.mode === 'edit') {
      payload.id = this.user[0]?.id;
    }
    this.saved.emit(payload);
  }
}
