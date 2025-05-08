import { Component, inject, signal } from '@angular/core';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';


@Component({
  selector: 'app-form.record.user.pages',
  imports: [MainContainerComponentComponent],
  templateUrl: './form.record.user.pages.component.html',
  styleUrl: './form.record.user.pages.component.scss'
})
export class FormRecordUserPagesComponent {
  // zona del servicio de la rutas
  // --------------------------------------------------
  public pathname: string;
  public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  public pathnameSignal;
  constructor() {
    this.pathname = window.location.pathname;
    this.pathnameSignal = signal(this.serviceRute.pathname(this.pathname));
  }
  // --------------------------------------------------

}
