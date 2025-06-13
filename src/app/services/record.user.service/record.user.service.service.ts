import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants'

@Injectable({
  providedIn: 'root'
})
export class RecordUserService {

  public users: any;
  private API_URL = API_URL;
  readonly http = inject(HttpClient)

  constructor() {
    this.users = [];
  }

  createUser(user: any): Observable<any> {
    const api = `${this.API_URL}/createUser`;
    return this.http.post(api, user);
  }

}
