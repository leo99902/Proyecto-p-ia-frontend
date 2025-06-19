import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecordUserService } from '../../../services/record.user.service/record.user.service.service';
import { NgClass, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-record-user',
  imports: [MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule, FormsModule, ReactiveFormsModule, NgStyle,NgIf],
  templateUrl: './record.user.component.component.html',
  styleUrls: ['./record.user.component.component.scss'],
})
export class RecordUserComponentComponent implements OnInit { // Agregamos implements OnInit explícitamente

  public recorUserForm!: FormGroup; // Usamos FormGroup y el operador ! para indicar que se inicializará en ngOnInit

  // Eliminamos public parrafoError y public parrafoData ya que no se usan

  public modalOpen = {
    isOpen: false,         // Controla si el modal está abierto (antes emptyModalOpen)
    isSuccess: false,      // Indica si el mensaje es de éxito (true) o error (false)
    message: '',           // El mensaje a mostrar en el modal
    canCloseOnClickOutside: false // NUEVA: Controla si se puede cerrar haciendo clic fuera
  }

  // El objeto 'user' se está usando con [(ngModel)] pero el formulario se envía con recorUserForm.value.
  // Es una mezcla de Reactive Forms y Template-driven Forms. Aunque funciona, lo ideal es usar solo Reactive Forms.
  // Para esta tarea, lo mantendremos así, pero es un punto a considerar para refactorización.
  public user = {
    user: '',
    cedula: '',
    name: '',
    email: '',
    rol: '',
    password: ''
  }

  // Este método no se está utilizando. Considera eliminarlo si no lo necesitas.
  // public setCiValue():any{
  //   if(typeof this.user.cedula === 'number'){
  //     return 'no string'
  //   }
  // }

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
      role: [''], // Valor inicial vacío para el select de rol
      state: ['activo'] // Valor por defecto 'activo'
    });
  }

  public recordData(): void { // Añadimos void al tipo de retorno
    // Primero, cierra cualquier modal abierto y resetea el comportamiento de cierre
    this.closeModal();
    this.modalOpen.canCloseOnClickOutside = false;

    this.recordUser.createUser(this.recorUserForm.value).subscribe({
      next: (data) => {
        // Lógica para el éxito
        this.modalOpen.isOpen = true;
        this.modalOpen.message = data.message || '¡Usuario registrado exitosamente!'; // Mensaje de fallback
        this.modalOpen.isSuccess = true;
        this.modalOpen.canCloseOnClickOutside = false; // El modal de éxito NO se cierra al hacer clic fuera (se recargará la página)

        // Recargar la página solo en caso de éxito
        setTimeout(() => {
          window.location.reload();
        }, 3000);

        console.log('Respuesta de éxito:', data);
      },
      error: (e) => {
        // Lógica para el error
        this.modalOpen.isOpen = true;
        this.modalOpen.message = e.error.message || 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.'; // Mensaje de fallback
        this.modalOpen.isSuccess = false; // Es un error
        this.modalOpen.canCloseOnClickOutside = true; // El modal de error SÍ se cierra al hacer clic fuera

        console.error('Error al registrar usuario:', e);
      },
    });
    // Eliminamos las líneas que mostraban el modal incondicionalmente aquí
  }

  // Este método ahora solo se encarga de cerrar el modal. El comportamiento de "click fuera" se maneja en el HTML.
  closeModal(): void { // Añadimos void al tipo de retorno
    this.modalOpen.isOpen = false;
    // No necesitamos resetear otras propiedades aquí, se configuran cuando el modal se abre de nuevo.
  }
}