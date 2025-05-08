import { Component, inject, signal } from '@angular/core';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { title } from 'process';

@Component({
  selector: 'app-main-container',
  imports: [],
  templateUrl: './main.container.component.component.html',
  styleUrl: './main.container.component.component.scss'
})
export class MainContainerComponentComponent {
  public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  public rutes:any = {};

  constructor() {
    if(this.serviceRute.valuePathname === '/home'){
      this.rutes = {
        title: 'Bienvenid@ a la pagina de inicio',
        rute1: 'home1',
        rute2: 'home2',
        rute3: 'home3'
      }
    }else if(this.serviceRute.valuePathname === '/usuarios'){
      this.rutes = {
        title: 'Controlador Ususario',
        rute1: 'Ver Usuarios',
        rute2: 'Registrar Usuarios',
        rute3: 'Link'
      }
    }
  }
}