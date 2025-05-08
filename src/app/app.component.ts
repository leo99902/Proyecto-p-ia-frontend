import { Component, inject } from '@angular/core';
import { HeaderNavigationComponentComponent } from './layouts/header.navigation.component/header.navigation.component.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MainContentGeneratorServiceService } from './services/main.content.generator.service/main.content.generator.service.service';


@Component({
  selector: 'app-root',
  imports: [HeaderNavigationComponentComponent, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // public serviceRute: ValuePathnameServiceService = inject(ValuePathnameServiceService);
  // constructor() {
  //   console.log(this.serviceRute.getPathname());
  // }

  public serviceMainContent: MainContentGeneratorServiceService = inject(MainContentGeneratorServiceService);

}
