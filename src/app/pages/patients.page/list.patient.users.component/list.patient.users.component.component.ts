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
    totalPatients: 0, // Total patients count, will be updated by loadPatients
    patientsDescription: 'Pacientes activos', // Description for patients
  };

  public patients: any[] = []; // Property to store the list of patients displayed in the table
  public isLoadingPatients: boolean = true; // To control the patient loading state
  public patientsErrorMessage: string | null = null; // To display patient loading error messages

  public showEditPatientModal: boolean = false; // Controls the visibility of the edit modal
  public selectedPatientForEdit: any = null; // Stores the data of the selected patient for editing

  public showViewPatientModal: boolean = false; // Controls the visibility of the view modal
  public viewedPatientDetails: any = null; // Stores the data of the patient for viewing

  // Properties for filtering and pagination (from previous user list component)
  public pageValue: number = 1; // Current page number for pagination
  public cantidadPages: number = 0; // Total number of pages
  public filtro = {
    filtroRole: '', // Filter by role: 'Administrador', 'Secretario', or '' for all
    filtroEstado: '' // Filter by state: 'activo', 'inactivo', or '' for all
  };
  public filterSeekerValue: string = ''; // Search input value

  // Inject services
  private showListPatientsService = inject(ShowListPatientsService);
  private editPatientService = inject(EditPatientService);

  constructor() { }

  ngOnInit(): void {
    // Initialize filters and then load patients
    this.filtro.filtroRole = ''; // Default to all roles
    this.filtro.filtroEstado = ''; // Default to all states
    this.pageValue = 1; // Start on the first page
    this.loadPatients(); // Load patients on component initialization
  }

  /**
   * Loads the list of patients from the backend, applying current filters and pagination.
   * This method centralizes all data fetching.
   */
  loadPatients(): void {
    this.isLoadingPatients = true;
    this.patientsErrorMessage = null; // Clear any previous error messages

    const params: any = {
      page: this.pageValue
    };

    // Add filters to parameters if they are selected
    if (this.filtro.filtroEstado && this.filtro.filtroEstado !== 'Todos los Estados') {
      params.state = this.filtro.filtroEstado;
    }
    if (this.filtro.filtroRole && this.filtro.filtroRole !== 'Todos los roles') {
      params.role = this.filtro.filtroRole;
    }
    if (this.filterSeekerValue) {
      params.search = this.filterSeekerValue; // Assuming your API supports a 'search' parameter
    }

    // Call the service with the constructed parameters
    this.showListPatientsService.listUsers(params).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.value)) {
          // Map response data to patient objects, ensuring 'id' is a number if it exists
          this.patients = response.value.map((patient: any) => ({
            ...patient,
            id: typeof patient.id === 'string' ? parseInt(patient.id, 10) : patient.id,
            // Ensure ci/cedula consistency if both are possible
            ci: patient.ci || patient.cedula,
            cedula: patient.cedula || patient.ci
          }));

          this.dashboardData.totalPatients = response.total_registros || this.patients.length; // Update total count from response or array length
          this.cantidadPages = response.total_paginas || 1; // Update total pages from response or default to 1

        } else {
          console.warn('Server response for listPatients does not contain a "value" property or is not an array:', response);
          this.patients = []; // Ensure the list is empty
          this.dashboardData.totalPatients = 0;
          this.cantidadPages = 1;
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

  /**
   * Pagination: Increases the page number and reloads patients.
   */
  setpageincrease(): void {
    if (this.pageValue < this.cantidadPages) {
      this.pageValue++;
      this.loadPatients();
    }
  }

  /**
   * Pagination: Decreases the page number and reloads patients.
   */
  setpagedecrease(): void {
    if (this.pageValue > 1) {
      this.pageValue--;
      this.loadPatients();
    }
  }

  /**
   * Filter handler: Triggers patient loading when role filter changes.
   */
  filterGetUserRole(): void {
    this.pageValue = 1; // Reset to first page on filter change
    this.loadPatients();
  }

  /**
   * Filter handler: Triggers patient loading when state filter changes.
   */
  filterGetUserEstado(): void {
    this.pageValue = 1; // Reset to first page on filter change
    this.loadPatients();
  }

  /**
   * Search handler: Triggers patient loading when search input changes.
   */
  filterGetUserSeeker(): void {
    this.pageValue = 1; // Reset to first page on search
    this.loadPatients();
  }


  // Open the edit modal with the selected patient's data
  openEditPatientModal(patient: any): void {
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

  // Method to open the patient details view modal
  openViewPatientModal(patient: any): void {
    // Clone the patient object for display, removing sensitive fields
    this.viewedPatientDetails = { ...patient };
    delete this.viewedPatientDetails.password; // Do not display the password
    // Keep role if it's part of the viewable details, otherwise delete:
    // delete this.viewedPatientDetails.role;
    this.showViewPatientModal = true;
  }

  // Method to close the patient details view modal
  closeViewPatientModal(): void {
    this.showViewPatientModal = false;
    this.viewedPatientDetails = null; // Clear data on close
  }

  // Method for the "New Patient" button (currently not in HTML, but kept for future use)
  onNewPatientClick(): void {
    console.log('New Patient button clicked.');
    // Logic for adding a new patient, e.g., opening an add modal.
  }
}
