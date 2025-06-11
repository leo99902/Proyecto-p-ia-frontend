import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private API_URL = "http://192.168.100.30:6060";
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
