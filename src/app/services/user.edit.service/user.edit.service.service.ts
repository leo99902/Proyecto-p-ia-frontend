import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEditServiceService {

  private API_URL = "http://0.0.0.0:6060";
  readonly http = inject(HttpClient)

  editUser(user: any): Observable<any> {
    const api = `${this.API_URL}/editUser`;
    return this.http.post(api, user);
  }

}
