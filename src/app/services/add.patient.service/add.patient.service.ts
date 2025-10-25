import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants'

@Injectable({
  providedIn: 'root'
})
export class AddPatientService{
  
  public BASE_URL = API_URL;

  constructor(private http: HttpClient) {}

  listUsers(patient: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/createPatient`, patient);
  }
}
