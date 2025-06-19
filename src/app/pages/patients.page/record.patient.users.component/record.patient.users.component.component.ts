import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de que FormsModule esté importado

@Component({
  selector: 'app-record-patient',
  standalone: true, // Esto es común en Angular 15+, si no lo tenías, agrégalo.
  imports: [FormsModule],
  templateUrl: './record.patient.users.component.component.html',
  styleUrl: './record.patient.users.component.component.scss'
})
export class RecordPatientUsersComponentComponent {
  // CAMBIO: Ahora es un string que guarda el nombre de la enfermedad
  enfermedadPrincipal: string = '';
  // Esta propiedad sigue siendo para el contenido del textarea
  descripcionEnfermedad: string = '';
}