import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

<<<<<<< HEAD
  private API_URL = "localhost:6060";
=======
  private API_URL = "http://localhost:6060";
>>>>>>> bc5cdf51cf699c682109ffbf3aa59f10059de1b1
  readonly http = inject(HttpClient)

  getUser(idUser:any): Observable<any> {
    const api = `${this.API_URL}/getUser`;
    return this.http.post(api, idUser);
  }

}
