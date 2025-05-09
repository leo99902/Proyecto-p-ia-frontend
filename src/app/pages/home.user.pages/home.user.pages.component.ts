import { Component, signal, inject} from '@angular/core';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';
import { Router } from '@angular/router'

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
  constructor(router : Router) {
    this.pathname = router.url;
    this.pathnameSignal = signal(this.serviceRute.pathname(this.pathname));
  }
  // --------------------------------------------------


}

