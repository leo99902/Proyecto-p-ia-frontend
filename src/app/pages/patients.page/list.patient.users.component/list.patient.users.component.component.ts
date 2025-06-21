import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // Importa CommonModule, NgIf, NgFor
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
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

  // Dashboard data adjusted: only for Total Patients
  dashboardData = {
    totalPatients: 0, // Total patients
    patientsDescription: 'Active patients', // Description for patients
  };

  public patients: any[] = []; // Property to store the list of patients
  public isLoadingPatients: boolean = true; // To control the patient loading state
  public patientsErrorMessage: string | null = null; // To display patient loading error messages

  public showEditPatientModal: boolean = false; // Controls the visibility of the edit modal
  public selectedPatientForEdit: any = null; // Stores the data of the selected patient for editing

  // NUEVAS PROPIEDADES PARA LA MODAL DE VISUALIZACIÓN
  public showViewPatientModal: boolean = false; // Controla la visibilidad de la modal de visualización
  public viewedPatientDetails: any = null; // Almacena los datos del paciente para visualizar

  // Inject services
  private showListPatientsService = inject(ShowListPatientsService);
  private editPatientService = inject(EditPatientService);

  constructor() { }

  ngOnInit(): void {
    this.loadPatients(); // Load patients on component initialization
  }

  // Method to load the list of patients
  loadPatients(): void {
    this.isLoadingPatients = true;
    this.patientsErrorMessage = null; // Clear any previous error messages

    // Pass an empty body or the necessary one for your patient listing endpoint
    // Based on `listUsers(body: any)` from ShowListPatientsService
    this.showListPatientsService.listUsers({}).subscribe({
      next: (response) => { 
        if (response && Array.isArray(response.value)) { 
          // CORRECCIÓN CLAVE: Ensure each patient's ID is explicitly a number.
          // This prevents "Invalid patient ID" errors if the ID comes as a string.
          this.patients = response.value.map((patient: any) => ({
            ...patient,
            id: typeof patient.id === 'string' ? parseInt(patient.id, 10) : patient.id
          }));
          this.dashboardData.totalPatients = this.patients.length; // Update the patient count
        } else {
          // If the response does not have the expected structure
          console.warn('Server response for listPatients does not contain a "value" property or is not an array:', response);
          this.patients = []; // Ensure the list is empty
          this.dashboardData.totalPatients = 0;
          this.patientsErrorMessage = 'Unexpected patient data format from the server.';
        }
        this.isLoadingPatients = false;
        console.log('Patients loaded:', this.patients);
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patientsErrorMessage = 'Could not load patients. Please try again later.';
        this.isLoadingPatients = false;
      }
    });
  }

  // Open the edit modal with the selected patient's data
  openEditPatientModal(patient: any): void {
    // No need for re-parsing ID here if `loadPatients` already ensures `id` is a number
    // Clone the patient object to avoid direct modifications in the list
    this.selectedPatientForEdit = { 
      ...patient,
      // Ensure 'infoDisease' has a default value if it doesn't exist
      infoDisease: patient.infoDisease || '' 
    };
    // Password is not loaded for security; it is left empty for the user to optionally change it.
    this.selectedPatientForEdit.password = '';
    this.showEditPatientModal = true;
  }

  // Close the edit modal
  closeEditPatientModal(): void {
    this.showEditPatientModal = false;
    this.selectedPatientForEdit = null; // Clear selected patient data
  }

  // Handle the submission of the patient edit form
  onEditPatientSubmit(): void {
    // Re-validation: Ensures `id` is a number before sending to service.
    // This check should now always pass if `loadPatients` worked correctly.
    if (!this.selectedPatientForEdit || typeof this.selectedPatientForEdit.id !== 'number' || isNaN(this.selectedPatientForEdit.id)) {
      console.error('No patient selected or invalid ID for editing. Current ID:', this.selectedPatientForEdit?.id);
      alert('Error: Invalid patient ID. Please select a valid patient.');
      return;
    }

    // Clone the data to send
    const patientDataToSend = { ...this.selectedPatientForEdit };
    
    // Remove the role to ensure it is NOT modified (as per previous requirements)
    delete patientDataToSend.role; 
    
    // Only include the password if the user has provided a new one
    if (!patientDataToSend.password) {
      delete patientDataToSend.password;
    }

    console.log('Patient data to send for editing:', patientDataToSend);

    // CALL THE EDIT SERVICE: Pass the patient ID and data separately.
    // This sends the data to your backend for persistence.
    this.editPatientService.editUser(this.selectedPatientForEdit.id, patientDataToSend).subscribe({
      next: (response) => {
        console.log('Patient edited successfully:', response);
        this.closeEditPatientModal(); // Close the modal
        this.loadPatients(); // Reload the patient list to see the changes reflected
        alert('Patient updated successfully!'); // User notification
      },
      error: (error) => {
        console.error('Error editing patient:', error);
        alert('Error updating patient: ' + (error.error?.message || 'Unknown error')); // Show backend error message
      }
    });
  }

  // NUEVO: Método para abrir la modal de visualización de paciente
  openViewPatientModal(patient: any): void {
    // Clona el objeto del paciente para mostrarlo, eliminando campos sensibles
    this.viewedPatientDetails = { ...patient };
    delete this.viewedPatientDetails.password; // No mostrar la contraseña
    delete this.viewedPatientDetails.role; // No mostrar el rol

    this.showViewPatientModal = true;
  }

  // NUEVO: Método para cerrar la modal de visualización
  closeViewPatientModal(): void {
    this.showViewPatientModal = false;
    this.viewedPatientDetails = null; // Limpiar datos al cerrar
  }

  // Method for the "New Patient" button
  onNewPatientClick(): void {
    console.log('New Patient button clicked.');
    // Logic for adding a new patient, e.g., opening an add modal.
  }
}
