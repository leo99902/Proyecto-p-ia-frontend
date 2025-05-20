import { Component, inject, input } from '@angular/core';
import { GetUserService } from '../../services/get.user.service/get.user.service.service';
import { CommonModule, NgIf } from '@angular/common';
import { UserEditServiceService } from '../../services/user.edit.service/user.edit.service.service';
import { FormsModule, NgControl, NgModel, NgModelGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal.edit.component.component.html',
  styleUrl: './modal.edit.component.component.scss'
})
export class ModalEditComponentComponent {
  

  public editUser = inject(UserEditServiceService)
  public getUser = inject(GetUserService)

  // ----------
    public modalEditInput = input('');

    public modalEdit = false;

  openModalEdit() {
    this.modalEdit = true;
  }

  closeModalEdit() {
    this.modalEdit = false;
  }

  public userValueEdit: any
  

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
    
    if(this.userEdit.name){
      this.editUser.editUser({_id: this.userEdit.id, user: this.userEdit}).subscribe({
        next: (data: any) => {
          if(data.message){
            this.closeModalEdit()
          }else{  
          }
        },
          error: (e:any) => {
            
        }  
      })
    }
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


  }
}