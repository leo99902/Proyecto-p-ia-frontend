import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { AddPatientService } from '../../../services/add.patient.service/add.patient.service';

@Component({
  selector: 'app-record-patient',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf, NgClass],
  templateUrl: './record.patient.users.component.component.html',
  styleUrl: './record.patient.users.component.component.scss'
})
export class RecordPatientUsersComponentComponent {

  public newPatient: any = {
    name: '',
    cedula: '',
    age: null,
    address: '',
    password: '',
    email: '',
    occupation: '',
    phone: '',
    disease: false,
    infoDisease: ''
  };

  public showAlertModal: boolean = false;
  public alertMessage: string = '';
  public alertType: 'success' | 'error' = 'success';

  private addPatientService = inject(AddPatientService);

  constructor() { }

  // Método para manejar el envío del formulario de añadir paciente
  onAddPatientSubmit(): void {
    // Validar campos obligatorios antes de enviar
    if (!this.newPatient.name || !this.newPatient.cedula || !this.newPatient.email || !this.newPatient.password) {
      this.alertMessage = 'Por favor, completa los campos obligatorios: Nombre, Cédula, Email y Contraseña.';
      this.alertType = 'error';
      this.openAlertModal();
      return;
    }

    // *** CAMBIO CLAVE AQUÍ: YA NO SE MANIPULA 'cedula' PARA EL BACKEND ***
    // El objeto this.newPatient ya tiene la estructura correcta con 'cedula'
    // Se crea una copia para evitar mutaciones directas, pero no se elimina 'cedula'.
    const patientDataToSend = {
      ...this.newPatient,
      // Asegúrate de enviar 'disease' y 'infoDisease' correctamente
      // Si el checkbox está desmarcado, `disease` será `false` y `infoDisease` podría ser un string vacío
      disease: this.newPatient.disease,
      infoDisease: this.newPatient.disease ? this.newPatient.infoDisease : '' // Envía infoDisease solo si disease es true
    };


    console.log('Datos del paciente a enviar:', patientDataToSend);

    // Llama al servicio para agregar el paciente
    this.addPatientService.listUsers(patientDataToSend).subscribe({
      next: (response) => {
        console.log('Paciente agregado con éxito:', response);
        this.alertMessage = 'Paciente agregado con éxito.';
        this.alertType = 'success';
        this.openAlertModal();

        setTimeout(() => {
          this.closeAlertModal();
          window.location.reload();
        }, 3000);
      },
      error: (error) => {
        console.error('Error al agregar paciente:', error);
        this.alertMessage = error.error?.message || 'Ocurrió un error al agregar el paciente. Inténtalo de nuevo.';
        this.alertType = 'error';
        this.openAlertModal();
      }
    });
  }

  openAlertModal(): void {
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertMessage = '';
  }
}
