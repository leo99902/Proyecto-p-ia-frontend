import { Component, inject, NgModule, signal } from '@angular/core';
import { RegisteredUserListComponentComponent } from '../form.record.user.pages/registered.user.list.component/registered.user.list.component.component';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GetListUserService } from '../../services/get.list.user.service/get.list.user.service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-login-user',
  imports: [FormsModule, NgClass],
  templateUrl: './form.login.user.pages.component.html',
  styleUrl: './form.login.user.pages.component.scss',
  standalone: true
})
export class FormLoginUserPagesComponent{
  public name =  ''
  public password = ''
  public openModal: boolean = false
  public closeModal: boolean = true

  public router = inject(Router)
  public getUser = inject(GetListUserService)

  public valueInputs = {
    valueName : 'leo',
    valuePassword : ''
  }
  
  public users: any = {id: 123, name: 'jose'}; // Tipado correcto
  public usuarios : any // Tipado correcto
  
  
    public httpHome(): void {
      this.valueInputs.valueName = this.name
      this.valueInputs.valuePassword = this.password
      this.getUser.listUsers(this.users).subscribe({
        next: (data: any) => {

          if((this.valueInputs.valueName === data.value[0].user) && (this.valueInputs.valuePassword === data.value[0].password)){
            this.router.navigate(['/home'])
          }else{
            this.router.navigate(['/'])
            this.openModal = true
            this.closeModal = false
          }

        },
        error: (e) => {
          console.error('Error al obtener usuarios:', e);
        }
      })
    }
  
}