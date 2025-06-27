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
  public usuarios: any; // Ko'ápe oñongatúta umi puruhára pe páginagui, mba'éichapa ou backend-gui.
  public displayedUsers: any[] = []; // Propiedad pyahu oñongatu hag̃ua umi puruhára oñefiltráva ha ojehechaukáva.

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
            this.loadUsers(); // Oñembopyahu umi puruhára ohechauka hag̃ua umi kamby
            this.closeModalEdit(); // Oñembotyi pe edición modal
          }
        },
          error: (e:any) => {
            console.error('Puruhára ñongatu javy:', e);
            // Ko'ápe ikatu remañanduka peteĩ javy pe puruhárape
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

        // IÑEPYTYMBO: ANI REMBOU saveUser KO'ÁPE. Oñehenói jave pe puruhára oñembojy "Guardar" pe modal-pe.
        // this.saveUser(userId)
      },
      error: (e) => {
        console.error('Puruhára ohupyty javy oñemyatyrõ hag̃ua:', e);
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
        console.error('Puruhára ohupyty javy:', e);
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
    this.loadUsers(); // Oñembohoja umi puruhára oñembohasa rire pe páhina
  }

  public setpagedecrease():void{
    this.pageValue--
    if(this.pageValue < 1){
      this.pageValue = 1
    }
    this.loadUsers(); // Oñembohoja umi puruhára oñembohasa rire pe páhina
  }

  private loadUsers(): void {
    // Oñembosako'i umi parámetro ojapóvo pe backend-pe
    const params: any = {
        page: this.pageValue,
        user: this.filterSeekerValue // Búsqueda techa rupive
    };

    // Oñembojoapy pe filtro estado-gui oñembohovái jave (ha ndaha'éi 'Maymáva Estado'-gui)
    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
        params.state = this.filtro.filtroEstado;
    }

    // Oñembojoapy pe filtro rol-gui oñembohovái jave (ha ndaha'éi 'Maymáva rol'-gui)
    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
        params.role = this.filtro.filtroRole; // Eñeha'ãmba'e oñemohenda porã pe parámetro réra pe backend oha'arõva ndive
    }

    this.listUser.listUsers(params).subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cantidad = data.value.length;
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
        this.cantidadPages = data.total_paginas;
        this.cantidaUser = data.total_registros;

        // Ojehechauka hag̃ua: Omyesakã pe cantidadPages-gui
        console.log('Páhina hetakue oúva backend-gui:', this.cantidadPages);
        
        // Ko'ápe oñembojehe'a umi puruhára oñefiltráva ha ojehechaukáva
        this.displayedUsers = this.usuarios.value; 

      },
      error: (e) => {
        console.error('Puruhára ohupyty javy:', e);
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers(); // Oñehenói loadUsers reñepyrũvo puruhára lista
  }

  public filtro = {
    filtroRole: '' ,
    filtroEstado: ''
  }

  // Se eliminó applyFilters() ya que el filtrado se hará en el backend
  // private applyFilters(): void {
  //   let filtered = [...this.usuarios.value];
  //   if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
  //     filtered = filtered.filter((user: any) => user.state === this.filtro.filtroEstado);
  //   }
  //   if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
  //     filtered = filtered.filter((user: any) => user.role.toLowerCase() === this.filtro.filtroRole.toLowerCase());
  //   }
  //   this.displayedUsers = filtered;
  // }


  public filterGetUserRole(){
    this.pageValue = 1; // Oñepyrũ jey peteĩ páhina pyahu pe filtro oñembohasávo
    this.loadUsers(); // Oñembopyahu umi puruhára umi filtro oñembohasáva ndive
  }

  public filterGetUserEstado(){
    this.pageValue = 1; // Oñepyrũ jey peteĩ páhina pyahu pe filtro oñembohasávo
    this.loadUsers(); // Oñembopyahu umi puruhára umi filtro oñembohasáva ndive
  }

  public filterSeekerValue: string = ''

  // Ko método oñehenói GUARANI añónte oñembojy jave pe botón de búsqueda
  public filterGetUserSeekerByButton(){
      this.pageValue = 1; // Oñepyrũ jey peteĩ páhina pyahu ojejapo jave peteĩ búsqueda pyahu
      this.loadUsers(); // Oñembohoja umi puruhára oñembohasávo pe filtro de búsqueda
  }

}
