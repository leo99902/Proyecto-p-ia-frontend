import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { GetListUserService } from '../../../services/get.list.user.service/get.list.user.service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { GetUserService } from '../../../services/get.user.service/get.user.service.service';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './registered.user.list.component.component.html',
  styleUrls: ['./registered.user.list.component.component.scss']
})
export class RegisteredUserListComponentComponent implements OnInit {
  public users: any = {id: 123, name: 'jose'};
  public usuarios : any

    public modalDetails = false;

  openModal() {
    this.modalDetails = true;
  }

  closeModal() {
    this.modalDetails = false;
  }

  // public getModalDetails(user:any, name:any, cedula:any, email:any, role:any, state:any){
  //   if((this.modalDetails) || (!this.modalDetails)){
  //     this.modalDetails = !this.modalDetails
  //   }
  // }

  public user = {
    user: '',
    name: '',
    cedula: '',
    email: '',
    role: '',
    state: ''
  }

  public buttonValue: any = ''

  constructor(private listUser: GetListUserService,private getUser: GetUserService) {}
  
  getReturnId(userId:any):void{
    this.getUser.getUser({_id: userId}).subscribe({
      next: (data: any) => {
        this.user.name = data.name
        this.user.user = data.user
        this.user.cedula = data.cedula
        this.user.email = data.email
        this.user.role = data.role
        this.user.state = data.state

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
