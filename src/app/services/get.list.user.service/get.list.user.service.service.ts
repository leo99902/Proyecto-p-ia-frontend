import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../shared/constants/app.constants'

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class GetListUserService{
  public users = {
    name: 'leonardo'
  };
  public BASE_URL = API_URL;

  constructor(private http: HttpClient) {}

  listUsers(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/listUsers`, body);
  }
}