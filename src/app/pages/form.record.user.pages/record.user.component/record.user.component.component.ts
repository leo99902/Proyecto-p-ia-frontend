import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecordUserService } from '../../../services/record.user.service/record.user.service.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-record-user',
  imports: [MatTabsModule, 
  MatFormFieldModule, 
  MatSelectModule,
  MatInputModule, FormsModule, ReactiveFormsModule, NgStyle],
  templateUrl: './record.user.component.component.html',
  styleUrls: ['./record.user.component.component.scss'], // Corregido
})
export class RecordUserComponentComponent {
  public recorUserForm: any

  public parrafoError: any
  public parrafoData: any

  public modalOpen = {
    color: false,
    emptyModalOpen: false,
    message: '',
  }

  public user = { 
    user: '',
    cedula: '',
    name: '',
    email: '',
    rol: '',
    password: ''
  }

  public setCiValue():any{
    if(typeof this.user.cedula === 'number'){
      return 'no string'
    }
  }

  constructor(private recordUser: RecordUserService, private formUserForm: FormBuilder) {}


  ngOnInit(): void {
    this.initializeForm();
  }

  // Inicializa el formulario con validaciones
  initializeForm(): void {
    this.recorUserForm = this.formUserForm.group({
      name: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [],
      state: [] = 'activo'
    });
  }

    
public recordData(){
  this.recordUser.createUser(this.recorUserForm.value).subscribe({
    next: (data) => {
      setTimeout(() => {                    
        window.location.reload();
      }, 1000);
      console.log(data.message)
      if(data.message){
        this.modalOpen.emptyModalOpen = true
        this.modalOpen.message = data.message
        this.modalOpen.color = true
      }else{
        this.modalOpen.emptyModalOpen = false
      }
    },
    error: (e) => {
      if(e.error.message){
        this.modalOpen.emptyModalOpen = true
        this.modalOpen.message = e.error.message
      }else{
        this.modalOpen.emptyModalOpen = false
      }
    },
  });
}
  }  
