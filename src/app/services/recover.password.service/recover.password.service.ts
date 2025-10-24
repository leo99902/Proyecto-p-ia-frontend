import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordService {
  private API_URL = API_URL;
  readonly http = inject(HttpClient);

  recoverPassword(mail: any): Observable<any> {
    const api = `${this.API_URL}/recoverPassword`;
    return this.http.post(api, mail);
  }
}
