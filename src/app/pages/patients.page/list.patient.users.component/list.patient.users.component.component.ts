import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowListPatientsService, Patient } from '../../../services/show.list.patients.service/show.list.patients.service';
import { EditPatientService } from '../../../services/edit.patient.service/edit.patient.service';
import { ShowPatientService } from '../../../services/show.patient.service/show.patient.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NewNote, Note, NotesService } from '../../../services/notes.service';
import { ChatbotService } from '../../../services/chatbot.service';

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
public newNote: Partial<NewNote> = {
  title: '',
  content: ''
};
public showNotesModal = false;
public selectedPatientForNotes: any;
public patientNotes: Note[] = [];
public isLoadingNotes = false;
public showDeleteNoteConfirmModal = false;
public noteToDelete: Note | null = null;
  public patients: Patient[] = [];
  public isLoadingPatients: boolean = true;
  public patientsErrorMessage: string | null = null;

  public showEditPatientModal: boolean = false;
  public selectedPatientForEdit: Patient | null = null;
  private originalPatientPassword: string = '';

  public showViewPatientModal: boolean = false;
  public viewedPatientDetails: Partial<Patient> | null = null;

  public promptsCount: number | null = null;
  public isLoadingPromptsCount: boolean = false;

  // Propiedades para mensajes de estado
  public showMessage: boolean = false;
  public messageType: 'success' | 'error' = 'error';
  public messageText: string = '';
  private messageTimeout: any;

  // Properties for filtering and pagination
  public pageValue: number = 1; // Initialized here
  public cantidadPages: number = 0;
  public filtro = {
    filtroRole: '',
    filtroEstado: ''
  };
  public filterSeekerValue: string = '';

  // Inject services
  private showListPatientsService = inject(ShowListPatientsService);
  private editPatientService = inject(EditPatientService);
  private showPatientService = inject(ShowPatientService);
  private notesService = inject(NotesService);
  private chatbotService = inject(ChatbotService);

  constructor() { }

  
  ngOnInit(): void {
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
      error: (error: HttpErrorResponse) => {
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

  applyFilter(): void {
    this.pageValue = 1;
    this.loadPatients();
  }

  openEditPatientModal(patient: Patient): void {
    if (!patient._id) {
      this.showAlertMessage('error', 'El paciente no tiene un ID válido.');
      return;
    }
  
    this.hideAlertMessage(); // Ocultar mensajes previos
  
    this.showPatientService.getUser({ _id: patient._id }).subscribe({
      next: (patientData) => {
        if (patientData && patientData._id) {
          this.originalPatientPassword = patientData.password || '';
          this.selectedPatientForEdit = {
            ...patientData,
            infoDisease: patientData.infoDisease || '',
            password: '' // Limpiar el campo de contraseña directamente al asignar el objeto
          };
          this.showEditPatientModal = true;
        } else {
          this.showAlertMessage('error', 'No se pudo obtener una respuesta válida para los detalles del paciente.');
        }
        console.log("pacientedata:",patientData)
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching patient details:', error);
        this.showAlertMessage('error', 'No se pudieron obtener los detalles del paciente. Inténtalo de nuevo.');
      }
    });
  }  

  closeEditPatientModal(): void {
    this.showEditPatientModal = false;
    this.selectedPatientForEdit = null;
    this.originalPatientPassword = '';
  }

  openNotesModal(patient: any): void {
  this.selectedPatientForNotes = patient;
  this.patientNotes = []; // Limpiar notas anteriores
  this.showNotesModal = true;
  if (patient._id) {
    this.loadPatientNotes(patient._id);
  }
}

closeNotesModal(): void {
  this.showNotesModal = false;
  this.selectedPatientForNotes = null;
  this.patientNotes = [];
}

openDeleteConfirmModal(note: Note): void {
  this.noteToDelete = note;
  this.showDeleteNoteConfirmModal = true;
}

closeDeleteConfirmModal(): void {
  this.showDeleteNoteConfirmModal = false;
  this.noteToDelete = null;
}

confirmDeleteNote(): void {
  if (!this.noteToDelete || !this.noteToDelete._id) {
    this.showAlertMessage('error', 'No se ha seleccionado ninguna nota para eliminar.');
    return;
  }

  this.notesService.deleteNote(this.noteToDelete._id).subscribe({
    next: () => {
      this.showAlertMessage('success', 'Nota eliminada correctamente.');
      this.closeDeleteConfirmModal();
      // Recargar las notas para reflejar la eliminación
      if (this.selectedPatientForNotes?._id) {
        this.loadPatientNotes(this.selectedPatientForNotes._id);
      }
    },
    error: () => this.showAlertMessage('error', 'Error al eliminar la nota.')
  });
}

loadPatientNotes(patientId: string): void {
  this.isLoadingNotes = true;
  this.notesService.listNotes(patientId).subscribe({
    next: (notes) => {
      this.patientNotes = notes;
      this.isLoadingNotes = false;
    },
    error: (error) => {
      console.error('Error al cargar las notas del paciente:', error);
      this.showAlertMessage('error', 'No se pudieron cargar las notas del paciente.');
      this.isLoadingNotes = false;
    }
  });
}


onSaveNote(): void {
  if (!this.selectedPatientForNotes || !this.selectedPatientForNotes._id) {
    this.showAlertMessage('error', 'No se ha seleccionado un paciente para añadir la nota.');
    return;
  }

  if (!this.newNote.title || !this.newNote.content) {
    this.showAlertMessage('error', 'El título y el contenido de la nota son obligatorios.');
    return;
  }

  const noteToSave: NewNote = {
    title: this.newNote.title,
    content: this.newNote.content,
    noteList: true,
    idPatient: this.selectedPatientForNotes._id
  };

  this.notesService.createNote(noteToSave).subscribe({
    next: () => {
      this.showAlertMessage('success', 'Nota guardada correctamente.');
      // Recargar las notas para mostrar la nueva
      if (this.selectedPatientForNotes?._id) {
        this.loadPatientNotes(this.selectedPatientForNotes._id);
      }
      // Resetear el formulario de nueva nota
      this.newNote = { title: '', content: '' };
    },
    error: () => this.showAlertMessage('error', 'Error al guardar la nota.')
  });
}

  onEditPatientSubmit(): void {
    const patientId = this.selectedPatientForEdit?._id;

    if (!this.selectedPatientForEdit || !patientId) {
      console.error('No patient selected or missing ID for editing:', this.selectedPatientForEdit);
      this.showAlertMessage('error', 'Error: ID de paciente inválido');
      return;
    }

    const patientDataForNestedObject: Partial<Patient> = {
      user: this.selectedPatientForEdit.user,
      cedula: this.selectedPatientForEdit.cedula || this.selectedPatientForEdit.cedula,
      birthDate: this.selectedPatientForEdit.birthDate,
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
        this.showAlertMessage('success', 'Paciente actualizado correctamente');
        this.closeEditPatientModal();
        this.loadPatients();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error editing patient:', error);
        let errorMessage = 'Error al actualizar el paciente';
        
        if (error.error && typeof error.error === 'object' && error.error.message) {
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

  openViewPatientModal(patient: Patient): void {
    if (!patient._id) {
      this.showAlertMessage('error', 'El paciente no tiene un ID válido.');
      return;
    }
    this.viewedPatientDetails = { ...patient };
    delete this.viewedPatientDetails.password;
    this.showViewPatientModal = true;

    this.isLoadingPromptsCount = true;
    this.promptsCount = null;
    this.chatbotService.getNumberOfPrompts(patient._id).subscribe({
      next: (count) => {
        // Si count es null o undefined, lo tratamos como 0.
        this.promptsCount = count ?? 0;
        this.isLoadingPromptsCount = false;
      },
      error: () => {
        this.promptsCount = 0; // O mostrar un mensaje de error
        this.isLoadingPromptsCount = false;
      }
    });
  }

  closeViewPatientModal(): void {
    this.showViewPatientModal = false;
    this.viewedPatientDetails = null;
    this.promptsCount = null;
  }

  onNewPatientClick(): void {
  }
}