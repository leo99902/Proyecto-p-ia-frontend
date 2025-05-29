import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.navigation.component.component.html',
  styleUrls: ['./header.navigation.component.component.scss']
})
export class HeaderNavigationComponentComponent {
  public navVisible = false;

  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeNav() {
    this.navVisible = false;
  }
}