import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants'

@Injectable({
  providedIn: 'root'
})
export class UserEditServiceService {

  private API_URL = API_URL;
  readonly http = inject(HttpClient)

  editUser(user: any): Observable<any> {
    const api = `${this.API_URL}/editUser`;
    return this.http.post(api, user);
  }

}
