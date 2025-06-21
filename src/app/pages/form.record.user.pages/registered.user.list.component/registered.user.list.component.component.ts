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
    CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './registered.user.list.component.component.html',
  styleUrls: ['./registered.user.list.component.component.scss']
})
export class RegisteredUserListComponentComponent implements OnInit {
  public users: any = {id: 123, name: 'jose'};
  public usuarios: any; // Aquí se guardarán los usuarios de la página actual, tal como vienen del backend.
  public displayedUsers: any[] = []; // Nueva propiedad para almacenar los usuarios filtrados y mostrados.

  public modalDetails = false;
  public alertEdit = false;

  openModal() {
    this.modalDetails = true;
  }

  closeModal() {
    this.modalDetails = false;
  }

  // ----------
    public modalEdit = false;

  openModalEdit() {
    this.modalEdit = true;
  }

  closeModalEdit() {
    this.modalEdit = false;
  }

  openModalAlert(){
    this.alertEdit = true;
  }
  
  
  constructor(private listUser: GetListUserService,private getUser: GetUserService, private editUser: UserEditServiceService) {}
  
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
  
  
  
  public saveUser(userId:any){
    
      this.editUser.editUser({_id: this.userEdit.id, user: this.userEdit}).subscribe({
        next: (data: any) => {
          if(this.userEdit.name){
            location.reload()
          }
        },
          error: (e:any) => {
            
        }  
      })
  }
  
  public getReturnIdEdit(userId:any){
      this.getUser.getUser({_id: userId}).subscribe({
      next: (data: any) => {

        this.userEdit.id = userId
        this.userEdit.name = data.name
        this.userEdit.cedula = data.cedula
        this.userEdit.user = data.user
        this.userEdit.email = data.email
        this.userEdit.role = data.role
        this.userEdit.state = data.state
        this.userEdit.password = data.password

      },
      error: (e) => {
        console.error('Error al obtener usuarios:', e);
      }
    })

    this.saveUser(userId)
  }

  public buttonValue: any = ''

  
  getReturnId(userId:any):void{
    this.getUser.getUser({_id: userId}).subscribe({
      next: (data: any) => {
        this.user.name = data.name
        this.user.user = data.user
        this.user.cedula = data.cedula
        this.user.email = data.email
        this.user.role = data.role
        this.user.state = data.state
        this.user.password = data.password


      },
      error: (e) => {
        console.error('Error al obtener usuarios:', e);
      }
    })
  }


  public cantidad: any
  public cantidadUsuarios: any
  public pageValue:any = 1
  public cantidadPages = 0;
  public cantidaUser: any

  public setpageincrease(): void{
    this.pageValue++
    if(this.pageValue > this.cantidadPages){
      this.pageValue = this.cantidadPages
    }
    this.loadUsers(); // Cargar usuarios después del cambio de página
  }

  public setpagedecrease():void{
    this.pageValue--
    if(this.pageValue < 1){
      this.pageValue = 1
    }
    this.loadUsers(); // Cargar usuarios después del cambio de página
  }

  // Nueva función para cargar usuarios y aplicar filtros iniciales
  private loadUsers(): void {
    this.listUser.listUsers({page: this.pageValue}).subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cantidad = data.value.length;
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
        this.cantidadPages = data.total_paginas;
        this.cantidaUser = data.total_registros;
        this.applyFilters(); // Aplicar filtros después de cargar los usuarios
      },
      error: (e) => {
        console.error('Error al obtener usuarios:', e);
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers(); // Llama a loadUsers en lugar de listUsers directamente
  }

  public filtro = {
    filtroRole: '' ,
    filtroEstado: ''
  }

  // Función auxiliar para aplicar todos los filtros de la página actual
  private applyFilters(): void {
    let filtered = [...this.usuarios.value]; // Crear una copia para no modificar el original

    // Aplicar filtro por estado
    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
      filtered = filtered.filter((user: any) => user.state === this.filtro.filtroEstado);
    }

    // Aplicar filtro por rol
    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
      // CAMBIO CLAVE AQUÍ: Convertir ambos a minúsculas para la comparación insensible a mayúsculas/minúsculas
      filtered = filtered.filter((user: any) => user.role.toLowerCase() === this.filtro.filtroRole.toLowerCase());
    }
    
    // Aplicar filtro de búsqueda
    if (this.filterSeekerValue) {
        const searchValue = this.filterSeekerValue.toLowerCase();
        filtered = filtered.filter((user: any) =>
            user.user.toLowerCase().includes(searchValue) ||
            user.name.toLowerCase().includes(searchValue) ||
            user.cedula.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );
    }


    this.displayedUsers = filtered; // Asignar los usuarios filtrados a la nueva propiedad
  }


  public filterGetUserRole(){
    this.applyFilters(); // Re-aplicar filtros a los usuarios actuales
  }

  public filterGetUserEstado(){
    this.applyFilters(); // Re-aplicar filtros a los usuarios actuales
  }

  public filterSeekerValue: string = ''

  public filterGetUserSeeker(){
    // El filtro de búsqueda seguirá haciendo una llamada al backend, como lo tenías.
    // Si quisieras que también filtre solo en la página actual, necesitarías cambiar esta lógica.
    // Por ahora, asumiré que quieres que este siga buscando en todo el backend.
      this.listUser.listUsers({user: this.filterSeekerValue}).subscribe({
      next: (data: any) => {
        this.usuarios = data
        this.cantidad = data.value.length
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
        this.cantidadPages = data.total_paginas; // Actualizar paginación si la búsqueda cambia el total
        this.cantidaUser = data.total_registros; // Actualizar total
        this.applyFilters(); // Aplicar los filtros de rol/estado sobre el resultado de la búsqueda
      },
      error: (e) => {
        console.error('Error al obtener usuarios:', e);
      }
    })
  }

}