import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private API_URL = "http://localhost:6060";
  readonly http = inject(HttpClient)

  loginUser(user:any, password: any): Observable<any> {
    const api = `${this.API_URL}/login`;
    return this.http.post(api, { user, password });
  }

}
