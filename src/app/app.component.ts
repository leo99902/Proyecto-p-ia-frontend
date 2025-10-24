import { Component, inject, signal} from '@angular/core';
import { HeaderNavigationComponentComponent } from './layouts/header.navigation.component/header.navigation.component.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MainContentGeneratorServiceService } from './services/main.content.generator.service/main.content.generator.service.service';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NavComponent } from './layouts/nav.component/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderNavigationComponentComponent, RouterOutlet, RouterModule,
    MatButtonModule, MatDividerModule, MatIconModule, NavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
 
  constructor(private activatedRoute: ActivatedRoute, private rute: Router) {}

  public getRute(){
    const rutaActual = this.activatedRoute.snapshot.url;
    const ruteValue = this.rute.url
    return ruteValue
  }

  // public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  // constructor() {
  //   console.log(this.serviceRute.getPathname());
  // }

  public serviceMainContent: MainContentGeneratorServiceService = inject(MainContentGeneratorServiceService);

}
