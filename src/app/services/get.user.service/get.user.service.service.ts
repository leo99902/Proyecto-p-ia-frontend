// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class GetUserServiceService {

//   public users: any;

//   private API_URL = "https://pokeapi.co/api/v2/pokemon/ditto";

//   constructor(private http: HttpClient) {
//     this.users = [];
//   }

//   public getUser(user: any): Observable<any[]> {
//     return this.http.post<any[]>(this.API_URL, user).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Error en getUser():', error);
//         return throwError(() => error);
//       })
//     );
//   }
// }
