import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, throwError } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants'

export interface Patient {
  _id: string;
  user: string;
  cedula: string;
  age: number;
  address: string;
  password?: string; // La contraseña es opcional, ya que no siempre se envía
  email: string;
  occupation: string;
  phone: string;
  disease: string;
  infoDisease: string;
  role: string;
  state: string;
}

export interface PatientsApiResponse {
  value: Patient[];
  total_paginas: number;
  total_registros: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShowListPatientsService{
  public BASE_URL = API_URL;

  constructor(private http: HttpClient) {}

  listUsers(body: any): Observable<PatientsApiResponse> {
    return this.http.post<PatientsApiResponse>(`${this.BASE_URL}/listPatients`, body);
  }

  // Nuevo método para obtener TODOS los pacientes para el reporte
  listAllUsers(): Observable<PatientsApiResponse> {
    return this.http.post<PatientsApiResponse>(`${this.BASE_URL}/listPatients`, { all: true });
  }
}