import { Component, signal, inject} from '@angular/core';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';

@Component({
  selector: 'app-home.user.pages',
  imports: [MainContainerComponentComponent],
  templateUrl: './home.user.pages.component.html',
  styleUrl: './home.user.pages.component.scss'
})
export class HomeUserPagesComponent {

  // zona del servicio de la rutas
  // --------------------------------------------------
  public pathname: string;
  public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  public pathnameSignal;
  public valuePathname!: string;
  constructor() {
    this.pathname = window.location.pathname;
    this.pathnameSignal = signal(this.serviceRute.pathname(this.pathname));
  }
  // --------------------------------------------------


}

