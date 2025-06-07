import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordUserService {

  public users: any;
  private API_URL = "http://0.0.0.0:6060";
  readonly http = inject(HttpClient)

  constructor() {
    this.users = [];
  }

  createUser(user: any): Observable<any> {
    const api = `${this.API_URL}/createUser`;
    return this.http.post(api, user);
  }

}
