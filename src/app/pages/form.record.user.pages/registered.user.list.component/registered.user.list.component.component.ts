import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { GetListUserService } from '../../../services/get.list.user.service/get.list.user.service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetUserService } from '../../../services/get.user.service/get.user.service.service';
import { ModalEditComponentComponent } from '../../../components/modal.edit.component/modal.edit.component.component';
import { RecordUserService } from '../../../services/record.user.service/record.user.service.service';
import { UserEditServiceService } from '../../../services/user.edit.service/user.edit.service.service';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registered.user.list.component.component.html',
  styleUrls: ['./registered.user.list.component.component.scss']
})
export class RegisteredUserListComponentComponent implements OnInit {
  public users: any = {id: 123, name: 'jose'};
  public usuarios: any;
  public displayedUsers: any[] = [];

  public modalDetails = false;
  public alertEdit = false;
  public showMessage: boolean = false;
  public messageType: 'success' | 'error' = 'error';
  public messageTimeout: any;

  openModal() {
    this.modalDetails = true;
  }

  closeModal() {
    this.modalDetails = false;
  }

  public modalEdit = false;

  openModalEdit() {
    this.modalEdit = true;
    this.resetMessage(); // Resetear mensaje al abrir el modal
  }

  closeModalEdit() {
    this.modalEdit = false;
    this.resetMessage(); // Resetear mensaje al cerrar el modal
  }

  openModalAlert() {
    this.alertEdit = true;
  }

  constructor(
    private listUser: GetListUserService,
    private getUser: GetUserService, 
    private editUser: UserEditServiceService
  ) {}
  
  public userEdit = {
    id: '',
    user: '',
    name: '',
    cedula: '',
    email: '',
    role: '',
    state: '',
    password: ''
  }

  public userValueEdit: any
  
  public user = {
    user: '',
    name: '',
    cedula: '',
    email: '',
    role: '',
    state: '',
    password: ''
  }
  
  public menssageEdit: string = '';
  
  public saveUser(userId: any) {
    this.resetMessage(); // Limpiar mensajes previos
    
    this.editUser.editUser({_id: this.userEdit.id, user: this.userEdit}).subscribe({
      next: (data: any) => {
        if(this.userEdit.name) {
          this.menssageEdit = data.message || 'Usuario actualizado correctamente';
          this.messageType = 'success';
          this.showMessage = true;
          
          // Configurar temporizador para ocultar mensaje y recargar
          this.messageTimeout = setTimeout(() => {
            this.closeModalEdit();
            this.loadUsers();
            this.resetMessage();
          }, 5000);
        }
      },
      error: (e: any) => {
        this.menssageEdit = e.error?.message || 'Error al actualizar el usuario';
        this.messageType = 'error';
        this.showMessage = true;
        
        // Configurar temporizador para ocultar mensaje
        this.messageTimeout = setTimeout(() => {
          this.resetMessage();
        }, 5000);
      }  
    })
  }

  private resetMessage(): void {
    this.showMessage = false;
    this.menssageEdit = '';
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }
  
  public getReturnIdEdit(userId: any) {
    this.getUser.getUser({_id: userId}).subscribe({
      next: (data: any) => {
        this.userEdit.id = userId;
        this.userEdit.name = data.name;
        this.userEdit.cedula = data.cedula;
        this.userEdit.user = data.user;
        this.userEdit.email = data.email;
        this.userEdit.role = data.role;
        this.userEdit.state = data.state;
        this.userEdit.password = data.password;
      },
      error: (e) => {
        console.error('Error al obtener usuario:', e);
        this.menssageEdit = 'Error al cargar datos del usuario';
        this.messageType = 'error';
        this.showMessage = true;
        setTimeout(() => this.resetMessage(), 5000);
      }
    })
  }

  public buttonValue: any = '';

  getReturnId(userId: any): void {
    this.getUser.getUser({_id: userId}).subscribe({
      next: (data: any) => {
        this.user.name = data.name;
        this.user.user = data.user;
        this.user.cedula = data.cedula;
        this.user.email = data.email;
        this.user.role = data.role;
        this.user.state = data.state;
        this.user.password = data.password;
      },
      error: (e) => {
        console.error('Error al obtener usuario:', e);
      }
    })
  }

  public cantidad: any;
  public cantidadUsuarios: any;
  public pageValue: any = 1;
  public cantidadPages = 0;
  public cantidaUser: any;

  public setpageincrease(): void {
    this.pageValue++;
    if(this.pageValue > this.cantidadPages) {
      this.pageValue = this.cantidadPages;
    }
    this.loadUsers();
  }

  public setpagedecrease(): void {
    this.pageValue--;
    if(this.pageValue < 1) {
      this.pageValue = 1;
    }
    this.loadUsers();
  }

  private loadUsers(): void {
    const params: any = {
      page: this.pageValue,
      user: this.filterSeekerValue
    };

    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
      params.state = this.filtro.filtroEstado;
    }

    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
      params.role = this.filtro.filtroRole;
    }

    this.listUser.listUsers(params).subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cantidad = data.value.length;
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
        this.cantidadPages = data.total_paginas;
        this.cantidaUser = data.total_registros;
        this.displayedUsers = this.usuarios.value;
      },
      error: (e) => {
        console.error('Error al cargar usuarios:', e);
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public filtro = {
    filtroRole: '',
    filtroEstado: ''
  }

  public filterGetUserRole() {
    this.pageValue = 1;
    this.loadUsers();
  }

  public filterGetUserEstado() {
    this.pageValue = 1;
    this.loadUsers();
  }

  public filterSeekerValue: string = '';

  public filterGetUserSeekerByButton() {
    this.pageValue = 1;
    this.loadUsers();
  }
}