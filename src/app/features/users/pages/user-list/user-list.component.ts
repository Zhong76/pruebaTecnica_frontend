import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { UserCrudComponent } from '../user-crud/user-crud.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { listUserRequest } from '../../domain/request/users.request';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-user-list',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    TagModule,
    TableModule,
    InputTextModule,
    FloatLabelModule,
    DialogModule,
    UserCrudComponent,
    ToastModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [MessageService]
})
export class UserListComponent {
  constructor(private router: Router, private authService: AuthService, private messageService: MessageService, private userService: UsersService) { }
  dialogMode: 'create' | 'edit' = 'create';
  user: string = '';
  dataTableUsers: any[] = [];
  userToEdit: any[] = [];
  form = new FormGroup({
    username: new FormControl<string | null>(null, { nonNullable: true }),
  })
  visible: boolean = false;
  async ngOnInit(): Promise<void> {
    const session = this.authService.getSession();
    if (!session) {
      this.router.navigate(['/login']);
    } else {
      this.user = (session.username).toUpperCase();
      await this.searchUsers();
    }
  }
  async listUser(id: number | null = null) {
    const values = this.form.getRawValue();
    const RequestList: listUserRequest = {
      id: id,
      username: values.username,
    }
    try {
      let response = await this.userService.listUser(RequestList).toPromise();
      if (response?.ok === true) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async searchUsers() {
    let array = await this.listUser();
    console.log(array);
    if (array.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Sin resultados', detail: 'No se encontraron usuarios con los criterios de búsqueda', key: 'bj' });
      this.dataTableUsers = [];
    } else {
      this.dataTableUsers = array;
      console.log(array);
      this.messageService.add({ severity: 'success', summary: 'Usuarios obtenidos', detail: 'Usuarios obtenidos', key: 'bj' });
    }
  }
  openCreate() {
    this.dialogMode = 'create';
    this.userToEdit = [];
    this.visible = true;
  }

  async openEdit(u: any) {
    this.dialogMode = 'edit';
    this.visible = true;
    this.userService.listUserById(u.id).subscribe(response => {
      if (response.ok === true) {
        this.userToEdit = [response.data];
        console.log(this.userToEdit);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error al obtener datos.', detail: response.message, key: 'bj' });
      }
    })
    console.log(this.userToEdit);
  }

  inactiveUser(u: any) {
    this.userService.deleteUser(u.id).subscribe(async response => {
      if (response.ok === true) {
        let data = await this.listUser();
        this.dataTableUsers = data;
        this.messageService.clear('bj');
        this.messageService.add({ severity: 'success', summary: response.message, detail: 'Usuario desactivado', key: 'bj' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error al desactivar usuario', detail: response.message, key: 'bj' });
      }
    }, error => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error al desactivar usuario', detail: error.error?.message ?? 'Error desconocido', key: 'bj' });
    });
  }

  async onSaved(result: any) {
    try {
      if (this.dialogMode === 'create') {
        let response = await this.userService.createUser(result).toPromise();
        if (response?.ok === true) {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: response.message, key: 'bj' });
          this.visible = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.message ?? 'No se pudo crear el usuario', key: 'bj' });
        }

      } else {
        let response = await this.userService.updateUser(result.id, result).toPromise();
        if (response?.ok === true) {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: response.message, key: 'bj' });
          this.visible = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.message ?? 'No se pudo actualizar el usuario', key: 'bj' });
        }
      }

      let data = await this.listUser(null);
      this.dataTableUsers = data;

    } catch (e) {
      console.error(e);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', key: 'bj' });
    }
  }

  onDialogHide() {
    this.dialogMode = 'create';
  }
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
