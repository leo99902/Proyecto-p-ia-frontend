import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowListPatientsService } from '../../../services/show.list.patients.service/show.list.patients.service';
import { EditPatientService } from '../../../services/edit.patient.service/edit.patient.service';

@Component({
  selector: 'app-list-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './list.patient.users.component.component.html',
  styleUrl: './list.patient.users.component.component.scss'
})
export class ListPatientUsersComponentComponent implements OnInit {

  // Dashboard data for total patients
  dashboardData = {
    totalPatients: 0,
    patientsDescription: 'Pacientes activos',
  };

  public patients: any[] = [];
  public isLoadingPatients: boolean = true;
  public patientsErrorMessage: string | null = null;

  public showEditPatientModal: boolean = false;
  public selectedPatientForEdit: any = null;
  private originalPatientPassword: string = '';

  public showViewPatientModal: boolean = false;
  public viewedPatientDetails: any = null;

  // Propiedades para mensajes de estado
  public showMessage: boolean = false;
  public messageType: 'success' | 'error' = 'error';
  public messageText: string = '';
  private messageTimeout: any;

  // Properties for filtering and pagination
  public pageValue: number = 1;
  public cantidadPages: number = 0;
  public filtro = {
    filtroRole: '',
    filtroEstado: ''
  };
  public filterSeekerValue: string = '';

  // Inject services
  private showListPatientsService = inject(ShowListPatientsService);
  private editPatientService = inject(EditPatientService);

  constructor() { }

  ngOnInit(): void {
    this.filtro.filtroRole = '';
    this.filtro.filtroEstado = '';
    this.pageValue = 1;
    this.loadPatients();
  }

  /**
   * Muestra un mensaje de alerta
   */
  private showAlertMessage(type: 'success' | 'error', message: string, duration: number = 5000): void {
    this.showMessage = true;
    this.messageType = type;
    this.messageText = message;
    
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    
    this.messageTimeout = setTimeout(() => {
      this.hideAlertMessage();
    }, duration);
  }

  /**
   * Oculta el mensaje de alerta
   */
  private hideAlertMessage(): void {
    this.showMessage = false;
    this.messageText = '';
  }

  loadPatients(): void {
    this.isLoadingPatients = true;
    this.patientsErrorMessage = null;

    const params: any = {
      page: this.pageValue
    };

    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
      params.state = this.filtro.filtroEstado;
    }
    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
      params.role = this.filtro.filtroRole;
    }
    if (this.filterSeekerValue) {
      params.search = this.filterSeekerValue;
    }

    this.showListPatientsService.listUsers(params).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.value)) {
          this.patients = response.value.map((patient: any) => ({
            ...patient,
            ci: patient.ci || patient.cedula,
            cedula: patient.cedula || patient.ci
          }));

          this.dashboardData.totalPatients = response.total_registros || this.patients.length;
          this.cantidadPages = response.total_paginas || 1;

        } else {
          console.warn('Server response for listPatients does not contain a "value" property or is not an array:', response);
          this.patients = [];
          this.dashboardData.totalPatients = 0;
          this.cantidadPages = 1;
          this.patientsErrorMessage = 'Unexpected patient data format from the server.';
        }
        this.isLoadingPatients = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patientsErrorMessage = 'Could not load patients. Please try again later.';
        this.isLoadingPatients = false;
        this.showAlertMessage('error', 'Error al cargar los pacientes');
      }
    });
  }

  setpageincrease(): void {
    if (this.pageValue < this.cantidadPages) {
      this.pageValue++;
      this.loadPatients();
    }
  }

  setpagedecrease(): void {
    if (this.pageValue > 1) {
      this.pageValue--;
      this.loadPatients();
    }
  }

  filterGetUserRole(): void {
    this.pageValue = 1;
    this.loadPatients();
  }

  filterGetUserEstado(): void {
    this.pageValue = 1;
    this.loadPatients();
  }

  filterGetUserSeeker(): void {
    this.pageValue = 1;
    this.loadPatients();
  }

  openEditPatientModal(patient: any): void {
    this.originalPatientPassword = patient.password || '';
    this.selectedPatientForEdit = {
      ...patient,
      infoDisease: patient.infoDisease || ''
    };
    this.selectedPatientForEdit.password = '';
    this.showEditPatientModal = true;
    this.hideAlertMessage(); // Ocultar mensajes previos al abrir el modal
  }

  closeEditPatientModal(): void {
    this.showEditPatientModal = false;
    this.selectedPatientForEdit = null;
    this.originalPatientPassword = '';
  }

  onEditPatientSubmit(): void {
    const patientId = this.selectedPatientForEdit?._id;

    if (!this.selectedPatientForEdit || !patientId) {
      console.error('No patient selected or missing ID for editing:', this.selectedPatientForEdit);
      this.showAlertMessage('error', 'Error: ID de paciente inválido');
      return;
    }

    const patientDataForNestedObject: any = {
      name: this.selectedPatientForEdit.name,
      cedula: this.selectedPatientForEdit.cedula || this.selectedPatientForEdit.ci,
      age: this.selectedPatientForEdit.age,
      address: this.selectedPatientForEdit.address,
      email: this.selectedPatientForEdit.email,
      occupation: this.selectedPatientForEdit.occupation,
      phone: this.selectedPatientForEdit.phone,
      disease: this.selectedPatientForEdit.disease,
      infoDisease: this.selectedPatientForEdit.infoDisease,
      state: this.selectedPatientForEdit.state
    };

    if (this.selectedPatientForEdit.password) {
      patientDataForNestedObject.password = this.selectedPatientForEdit.password;
    } else if (this.originalPatientPassword) {
      patientDataForNestedObject.password = this.originalPatientPassword;
    }

    const finalDataToSend = {
      _id: patientId,
      patient: patientDataForNestedObject
    };

    this.editPatientService.editPatient(finalDataToSend).subscribe({
      next: (response) => {
        console.log('Patient edited successfully:', response);
        this.showAlertMessage('success', 'Paciente actualizado correctamente');
        this.closeEditPatientModal();
        this.loadPatients();
      },
      error: (error) => {
        console.error('Error editing patient:', error);
        let errorMessage = 'Error al actualizar el paciente';
        
        if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.message || error.error.error || errorMessage;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        if (error.status) {
          errorMessage += ` (Código: ${error.status})`;
        }
        
        this.showAlertMessage('error', errorMessage);
      }
    });
  }

  openViewPatientModal(patient: any): void {
    this.viewedPatientDetails = { ...patient };
    delete this.viewedPatientDetails.password;
    this.showViewPatientModal = true;
  }

  closeViewPatientModal(): void {
    this.showViewPatientModal = false;
    this.viewedPatientDetails = null;
  }

  onNewPatientClick(): void {
    console.log('New Patient button clicked.');
  }
}