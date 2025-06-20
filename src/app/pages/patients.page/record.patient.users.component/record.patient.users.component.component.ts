import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de que FormsModule esté importado
import { CommonModule, NgIf, NgClass } from '@angular/common'; // Importa CommonModule, NgIf, NgClass
import { AddPatientService } from '../../../services/add.patient.service/add.patient.service';

@Component({
  selector: 'app-record-patient',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf, NgClass], // Asegura que CommonModule, NgIf, NgClass estén aquí
  templateUrl: './record.patient.users.component.component.html',
  styleUrl: './record.patient.users.component.component.scss'
})
export class RecordPatientUsersComponentComponent {

  // Propiedades para el formulario de nuevo paciente
  public newPatient: any = {
    name: '',
    cedula: '', // Asumiendo que CI se mapea a 'cedula' en el backend
    age: null,
    address: '',
    password: '',
    email: '',
    occupation: '',
    phone: '',
    disease: false, // Controlará si el checkbox está marcado
    infoDisease: '' // Para la descripción de la enfermedad
  };

  // Estas propiedades ahora se vincularán al objeto newPatient
  // Son redundantes si se usan ngModel directamente en newPatient.infoDisease
  // enfermedadPrincipal: string = ''; // No necesario si newPatient.disease ya es boolean
  // descripcionEnfermedad: string = ''; // Usar newPatient.infoDisease directamente

  // Propiedades para la modal de alerta genérica
  public showAlertModal: boolean = false;
  public alertMessage: string = '';
  public alertType: 'success' | 'error' = 'success'; // 'success' o 'error' para estilos

  // Inyectar el servicio de añadir paciente
  private addPatientService = inject(AddPatientService);

  constructor() { }

  // Método para manejar el envío del formulario de añadir paciente
  onAddPatientSubmit(): void {
    // Validar campos obligatorios antes de enviar
    if (!this.newPatient.name || !this.newPatient.cedula || !this.newPatient.email || !this.newPatient.password) {
      this.alertMessage = 'Por favor, completa los campos obligatorios: Nombre, Cédula, Email y Contraseña.';
      this.alertType = 'error';
      this.openAlertModal();
      return; // Detener la ejecución si faltan campos
    }

    // Asegurarse de que 'ci' se mapee correctamente si el backend lo espera así
    const patientDataToSend = {
      ...this.newPatient,
      ci: this.newPatient.cedula // Mapear 'cedula' del formulario a 'ci' para el backend
    };
    // Eliminar 'cedula' si el backend solo espera 'ci'
    delete patientDataToSend.cedula;

    console.log('Datos del paciente a enviar:', patientDataToSend);

    // Llama al servicio para agregar el paciente
    // Nota: El método en AddPatientService se llama `listUsers` pero realiza un `createPatient`.
    this.addPatientService.listUsers(patientDataToSend).subscribe({
      next: (response) => {
        console.log('Paciente agregado con éxito:', response);
        this.alertMessage = 'Paciente agregado con éxito.';
        this.alertType = 'success';
        this.openAlertModal(); // Muestra la modal de éxito

        // Espera 3 segundos, luego cierra la modal y recarga la página
        setTimeout(() => {
          this.closeAlertModal();
          window.location.reload(); // Recarga la página
        }, 3000);
      },
      error: (error) => {
        console.error('Error al agregar paciente:', error);
        this.alertMessage = error.error?.message || 'Ocurrió un error al agregar el paciente. Inténtalo de nuevo.';
        this.alertType = 'error';
        this.openAlertModal(); // Muestra la modal de error
      }
    });
  }

  // Métodos para controlar la modal de alerta genérica
  openAlertModal(): void {
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertMessage = ''; // Limpiar el mensaje al cerrar
    // La recarga de página solo ocurre en caso de éxito, no al cerrar manualmente.
  }
}
