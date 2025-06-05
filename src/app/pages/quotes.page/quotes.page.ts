import { Component, inject, signal } from '@angular/core';
import { MainContainerComponentComponent } from '../../layouts/main.container.component/main.container.component.component';
import { ValuePathnameServiceService } from '../../services/value.pathname.service/value.pathname.service.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ListQuotesComponentComponent } from './list.quotes.component/list.quotes.component.component';

@Component({
  selector: 'app-quotes.page',
  imports: [MainContainerComponentComponent, MatTabsModule, ListQuotesComponentComponent],
  templateUrl: './quotes.page.html',
  styleUrl: './quotes.page.scss'
})
export class QuotesPagesComponent {
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


