import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants'

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

  private API_URL = API_URL;
  readonly http = inject(HttpClient)

  getUser(idUser:any): Observable<any> {
    const api = `${this.API_URL}/getUser`;
    return this.http.post(api, idUser);
  }

}
