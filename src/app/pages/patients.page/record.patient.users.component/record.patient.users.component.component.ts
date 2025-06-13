import { Component, NgModule } from '@angular/core';
import { FormsModule, NgControl, NgModel, NgModelGroup } from '@angular/forms';

@Component({
  selector: 'app-record-patient',
  imports: [FormsModule],
  templateUrl: './record.patient.users.component.component.html',
  styleUrl: './record.patient.users.component.component.scss'
})
export class RecordPatientUsersComponentComponent {
  tieneEnfermedad = false;
  descripcionEnfermedad = '';
}

