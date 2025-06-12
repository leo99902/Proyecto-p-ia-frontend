import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

  private API_URL = "localhost:6060";
  readonly http = inject(HttpClient)

  getUser(idUser:any): Observable<any> {
    const api = `${this.API_URL}/getUser`;
    return this.http.post(api, idUser);
  }

}
