import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../shared/constants/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private API_URL = API_URL;
  readonly http = inject(HttpClient);
  private authService = inject(AuthService);

  changePassword(data: { currentPassword: string, newPassword: string, confirmNewPassword: string }): Observable<any> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const payload = { ...data, _id: userId };
    const api = `${this.API_URL}/renewPassword`;
    return this.http.post(api, payload);
  }
}
