import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.navigation.component.component.html',
  styleUrls: ['./header.navigation.component.component.scss']
})
export class HeaderNavigationComponentComponent {
  public navVisible = false;

  public rute = inject(Router);

  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeNav() {
    this.navVisible = false;
  }



  public closeSession(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTimeout(() => {
      this.rute.navigate(['/']);
      this.navVisible = false;
    }, 1000);
  }




}

