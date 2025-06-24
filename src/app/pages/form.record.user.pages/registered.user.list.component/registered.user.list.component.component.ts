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
            // Mejorar esto: en lugar de location.reload(), recargar los usuarios
            this.loadUsers(); // Recarga los usuarios para reflejar los cambios
            this.closeModalEdit(); // Cierra el modal de edición
          }
        },
          error: (e:any) => {
            console.error('Error al guardar usuario:', e);
            // Aquí podrías mostrar un mensaje de error al usuario
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

        // IMPORTANTE: NO LLAMAR saveUser AQUÍ. Se llama cuando el usuario presiona "Guardar" en el modal.
        // this.saveUser(userId)
      },
      error: (e) => {
        console.error('Error al obtener usuario para editar:', e);
      }
    })
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

  private loadUsers(): void {
    // Cuando los filtros de rol/estado cambian, reiniciamos la página a 1 para asegurar coherencia
    // Esto es importante si el filtrado del lado del cliente podría resultar en menos páginas.
    // Aunque applyFilters() es lado del cliente, si se usa con una búsqueda, podría cambiar el total de páginas.
    // Para filtros de rol/estado puros (sin búsqueda), la paginación no se ajustará si ya cargó N páginas.
    // Si queremos que los filtros de rol/estado también puedan reducir el número de páginas,
    // tendríamos que llamar a la API con esos filtros, no solo filtrar this.usuarios.value.
    // Por ahora, asumiremos que applyFilters() opera sobre la página actual y si cambia la paginación,
    // es por una nueva búsqueda.

    this.listUser.listUsers({page: this.pageValue, user: this.filterSeekerValue}).subscribe({ // Incluir filterSeekerValue aquí para cargar la página correcta después de una búsqueda
      next: (data: any) => {
        this.usuarios = data;
        this.cantidad = data.value.length;
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
        this.cantidadPages = data.total_paginas;
        this.cantidaUser = data.total_registros;

        // Para depurar: Imprime el valor de cantidadPages
        console.log('Cantidad de páginas recibidas del backend:', this.cantidadPages);
        
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

  private applyFilters(): void {
    let filtered = [...this.usuarios.value]; // Crear una copia para no modificar el original

    // Aplicar filtro por estado
    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
      filtered = filtered.filter((user: any) => user.state === this.filtro.filtroEstado);
    }

    // Aplicar filtro por rol
    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
      filtered = filtered.filter((user: any) => user.role.toLowerCase() === this.filtro.filtroRole.toLowerCase());
    }
    
    // NOTA: El filtro de búsqueda se aplicará cuando se llame a loadUsers con filterSeekerValue
    // o al llamar a filterGetUserSeeker(). Aquí, solo aplica los filtros de rol y estado
    // sobre los datos que ya se cargaron para la página actual.

    this.displayedUsers = filtered; // Asignar los usuarios filtrados a la nueva propiedad
  }


  public filterGetUserRole(){
    this.pageValue = 1; // Reiniciar a la primera página cuando se cambia el filtro
    this.loadUsers(); // Recargar usuarios con los filtros aplicados
  }

  public filterGetUserEstado(){
    this.pageValue = 1; // Reiniciar a la primera página cuando se cambia el filtro
    this.loadUsers(); // Recargar usuarios con los filtros aplicados
  }

  public filterSeekerValue: string = ''

  // Este método ahora se llama SOLO cuando se presiona el botón de búsqueda
  public filterGetUserSeekerByButton(){
      this.pageValue = 1; // Reiniciar a la primera página cuando se realiza una nueva búsqueda
      this.loadUsers(); // Cargar usuarios aplicando el filtro de búsqueda
  }

}
