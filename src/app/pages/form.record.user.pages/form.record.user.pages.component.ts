import { Component, inject, signal } from '@angular/core';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { RecordUserComponentComponent } from './record.user.component/record.user.component.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form.record.user.pages',
  imports: [MainContainerComponentComponent, RecordUserComponentComponent, MatTabsModule],
  templateUrl: './form.record.user.pages.component.html',
  styleUrl: './form.record.user.pages.component.scss'
})
export class FormRecordUserPagesComponent {
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
