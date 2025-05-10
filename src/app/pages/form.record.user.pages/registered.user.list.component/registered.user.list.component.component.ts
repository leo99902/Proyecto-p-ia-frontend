import { Component, OnInit } from '@angular/core';
// import { GetUserServiceService } from '../../../services/get.user.service/get.user.service.service';

@Component({
  selector: 'app-user-list-component',
  templateUrl: './registered.user.list.component.component.html',
  styleUrls: ['./registered.user.list.component.component.scss']
})
export class RegisteredUserListComponentComponent {

  // constructor(public userService: GetUserServiceService) {}

  // ngOnInit(): void {
  //   this.getUsers();
  // }

  // public getUsers(): void {
  //   const user = { name: 'John Doe', email: 'john.doe@example.com' }; // Ejemplo de objeto user
  //   this.userService.getUser(user).subscribe({
  //     next: (data) => {
  //       this.userService.users = data; // Almacena los usuarios obtenidos
  //     },
  //     error: (e) => {
  //       console.error('Error fetching users:', e);
  //     }
  //   });
  // }
}
