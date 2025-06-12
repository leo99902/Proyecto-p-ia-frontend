import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

<<<<<<< HEAD
  private API_URL = "localhost";
=======
  private API_URL = "http://localhost:6060";
>>>>>>> bc5cdf51cf699c682109ffbf3aa59f10059de1b1
  readonly http = inject(HttpClient)

  // loginUser(user:any, password: any): Observable<any> {
  //   const api = `${this.API_URL}/login`;
  //   return this.http.post(api, { user, password });
  // }

  loginUser(user: any, password: any): Observable<any> {
  const api = `${this.API_URL}/login`;
  return this.http.post(api, { user, password }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error en la petición de login:', error);
      return throwError(() => error);
    })
  );
}

}
