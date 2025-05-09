import { Component, inject, signal } from '@angular/core';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { RouterLink, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { HeaderNavigationComponentComponent } from '../header.navigation.component/header.navigation.component.component';
import { RecordUserComponentComponent } from '../../pages/form.record.user.pages/record.user.component/record.user.component.component';


@Component({
  selector: 'app-main-container',
  imports: [ RouterModule, MatTabsModule,],
  templateUrl: './main.container.component.component.html',
  styleUrl: './main.container.component.component.scss'
})
export class MainContainerComponentComponent {
  public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  public mainContent:any = {};

  constructor() {
    if(this.serviceRute.valuePathname === '/home'){
      this.mainContent = {
        title: 'Bienvenid@ a la pagina de inicio',
        rute1: {name: 'home1', link: 'ver', content: ''
        },
        rute2: 'home2',
        rute3: 'home3',

      }
    }else if(this.serviceRute.valuePathname === '/usuarios'){
      this.mainContent = {
        title: 'Controlador Ususario',
        rute1: {name: 'Listar Usuarios', link: '/ver-usuarios', content: '<app-record-user></app-record-user>'
        },
        rute2: 'Registrar Usuarios',
        rute3: 'Link'
      }
    }
  }
}