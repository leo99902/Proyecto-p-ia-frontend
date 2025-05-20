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
  public usuarios : any

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
  
  // public getModalDetails(user:any, name:any, cedula:any, email:any, role:any, state:any){
    //   if((this.modalDetails) || (!this.modalDetails)){
      //     this.modalDetails = !this.modalDetails
  //   }
  // }

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



  // getButtonValue() {
  //   const value = this.myForm.get('myButton')?.value;
  //   console.log('Valor del botón:', value);
  // }

  ngOnInit(): void {
    this.listUser.listUsers(this.users).subscribe({
      next: (data: any) => {
        this.usuarios = data; // Almacena los datos en la propiedad usuario
        this.cantidad = data.value.length
        this.cantidadUsuarios = Array.from({ length: this.cantidad }, (_, index) => index + 1);
      },
      error: (e) => {
        console.error('Error al obtener usuarios:', e);
      }
    })
  }

}
