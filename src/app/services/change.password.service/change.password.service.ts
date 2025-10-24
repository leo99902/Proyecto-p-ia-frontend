import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private API_URL = API_URL;
  readonly http = inject(HttpClient);

  changePassword(data: { currentPassword: string, newPassword: string, confirmNewPassword: string }): Observable<any> {
    const api = `${this.API_URL}/renewPassword`;
    return this.http.post(api, data);
  }
}
