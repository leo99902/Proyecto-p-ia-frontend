import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../pages/patients.page/list.patient.users.component/list.patient.users.component.component';

@Component({
  selector: 'app-modal-to-edit',
  imports: [FormsModule, NgIf],
  templateUrl: './modal.to.edit.component.html',
  styleUrl: './modal.to.edit.component.scss'
})
export class ModalToEditComponent {

  @Input()
  selectedPatientForEdit: Patient | null = null;

  @Input()
  showEditPatientModal: any;

  @Input()
  showMessage: any;

  @Input()
  messageText: any;

  @Input()
  messageType: any;

  @Output()
  saveEdit = new EventEmitter();

  @Output()
  closeModal = new EventEmitter();

  closeEditPatientModal(){
    this.closeModal.emit()
  }

  onEditPatientSubmit(){
    this.saveEdit.emit()
  }

}
