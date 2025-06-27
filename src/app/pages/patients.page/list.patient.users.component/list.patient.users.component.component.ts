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
  private originalPatientPassword: string = ''; // NUEVA PROPIEDAD: Para almacenar la contraseña original

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
          // Assuming response.value contains objects where _id is present
          // and other patient properties are at the top level, like:
          // { _id: "...", name: "...", cedula: "...", ... }
          this.patients = response.value.map((patient: any) => ({
            ...patient,
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
   * Resets page to 1 for a new filtered search.
   */
  filterGetUserRole(): void {
    this.pageValue = 1; // Reset to first page on filter change
    this.loadPatients();
  }

  /**
   * Filter handler: Triggers patient loading when state filter changes.
   * Resets page to 1 for a new filtered search.
   */
  filterGetUserEstado(): void {
    this.pageValue = 1; // Reset to first page on filter change
    this.loadPatients();
  }

  /**
   * Search handler: Triggers patient loading when search input changes.
   * Resets page to 1 for a new search.
   */
  filterGetUserSeeker(): void {
    this.pageValue = 1; // Reset to first page on search
    this.loadPatients();
  }


  /**
   * Opens the edit modal with the selected patient's data.
   * The 'patient' object passed here is assumed to be the flat structure
   * received from the 'showListPatientsService', containing '_id' and other properties directly.
   */
  openEditPatientModal(patient: any): void {
    // NUEVO: Almacena la contraseña original del paciente, si está disponible
    this.originalPatientPassword = patient.password || ''; 
    
    // Clone the patient object to avoid direct modifications in the list
    // and ensure it includes the '_id' from the list.
    this.selectedPatientForEdit = {
      ...patient,
      // Ensure 'infoDisease' has a default value if it doesn't exist
      infoDisease: patient.infoDisease || ''
    };
    // Password is not loaded for security; it is left empty for the user to optionally change it.
    this.selectedPatientForEdit.password = ''; // Esto asegura que el campo en el modal esté vacío
    this.showEditPatientModal = true;
  }

  // Close the edit modal
  closeEditPatientModal(): void {
    this.showEditPatientModal = false;
    this.selectedPatientForEdit = null; // Clear selected patient data
    this.originalPatientPassword = ''; // Limpiar también la contraseña original
  }

  /**
   * Handles the submission of the patient edit form.
   * Constructs the data in the new specified architecture before sending.
   */
  onEditPatientSubmit(): void {
    const patientId = this.selectedPatientForEdit?._id;

    if (!this.selectedPatientForEdit || !patientId) {
      console.error('No patient selected or missing ID for editing. Current selectedPatientForEdit:', this.selectedPatientForEdit);
      alert('Error: Invalid patient ID. Please select a valid patient.');
      return;
    }

    // Construye el objeto 'patient' anidado con los campos
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

    // LÓGICA CLAVE ACTUALIZADA:
    // Si el usuario introdujo una nueva contraseña, usa esa.
    // Si el campo está vacío, significa que no quiere cambiarla, así que usa la contraseña original.
    if (this.selectedPatientForEdit.password) {
      // Si el usuario tecleó algo, usa la nueva contraseña
      patientDataForNestedObject.password = this.selectedPatientForEdit.password;
    } else if (this.originalPatientPassword) {
      // Si el usuario no tecleó nada y tenemos una contraseña original, usa la original
      patientDataForNestedObject.password = this.originalPatientPassword;
    } 
    // Si no hay nueva contraseña y tampoco había una original (ej. primer registro sin pass),
    // entonces no se añade el campo 'password' al objeto. Esto depende de la lógica de tu backend.

    // Construye el objeto final para enviar, con la estructura {_id: "...", patient: {...}}
    const finalDataToSend = {
      _id: patientId, // The _id from the top-level patient object
      patient: patientDataForNestedObject // The nested patient object
    };

    console.log('Final data to send for editing (password handled):', finalDataToSend);
    console.log('Attempting to edit patient with ID:', patientId);

    this.editPatientService.editPatient(finalDataToSend).subscribe({
      next: (response) => {
        console.log('Patient edited successfully:', response);
        this.closeEditPatientModal(); // Close the modal
        this.loadPatients(); // Reload the patient list to see the changes reflected
        alert('Patient updated successfully!'); // User notification
      },
      error: (error) => {
        console.error('Error editing patient:', error);
        let errorMessage = 'Error al actualizar el paciente.';
        
        // Intentar obtener un mensaje de error más específico
        if (error.error && typeof error.error === 'object') {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) { // Algunos backends pueden usar 'error' anidado
            errorMessage = error.error.error;
          }
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message; // Mensaje de error HTTP
        }
        
        // Añadir el código de estado HTTP si está disponible
        if (error.status) {
          errorMessage += ` (Código: ${error.status})`;
        }
        
        alert(errorMessage); // Muestra el mensaje de error mejorado
      }
    });
  }

  /**
   * Method to open the patient details view modal.
   * The 'patient' object passed here is the flat structure from the list.
   */
  openViewPatientModal(patient: any): void {
    // Clone the patient object for display, removing sensitive fields
    this.viewedPatientDetails = { ...patient };
    delete this.viewedPatientDetails.password; // Do not display the password
    // If 'id' is used in the view modal HTML instead of '_id', you might want to ensure it's set:
    // this.viewedPatientDetails.id = patient._id || patient.id; 
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
