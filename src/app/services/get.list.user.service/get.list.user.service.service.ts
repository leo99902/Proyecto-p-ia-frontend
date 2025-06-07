import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  public BASE_URL = "http://localhost:6060";

  constructor(private http: HttpClient) {}

  listUsers(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/listUsers`, body);
  }
}