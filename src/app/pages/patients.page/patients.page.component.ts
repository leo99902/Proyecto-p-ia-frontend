import { Component, inject, signal } from '@angular/core';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ListPatientUsersComponentComponent } from './list.patient.users.component/list.patient.users.component.component';
import { RecordPatientUsersComponentComponent } from './record.patient.users.component/record.patient.users.component.component';

@Component({
  selector: 'app-patients-page',
  imports: [MainContainerComponentComponent, MatTabsModule, ListPatientUsersComponentComponent, RecordPatientUsersComponentComponent],
  templateUrl: './patients.page.component.html',
  styleUrl: './patients.page.component.scss'
})
export class PatientsPageComponent {
  // zona del servicio de la rutas
  // --------------------------------------------------
  public pathname: string;
  public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  public pathnameSignal;
  public valuePathname!: string;
  constructor(router : Router) {
    this.pathname = router.url;
    this.pathnameSignal = signal(this.serviceRute.pathname(this.pathname));
  }
  // --------------------------------------------------

}


