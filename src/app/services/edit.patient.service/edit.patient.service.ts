import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class EditPatientService {

  private API_URL = API_URL;
  
  readonly http = inject(HttpClient);

  editPatient(patientFullData: any): Observable<any> { // Un solo parámetro, el objeto completo
    // Según tu captura de Postman, el _id va en el cuerpo, no en la URL.
    // No necesitamos extraer patientId para la URL aquí.
    
    // La URL de la API se ajusta para que coincida con la de Postman
    // Asumiendo que tu API_URL es 'http://localhost:6060'
    const api = `${this.API_URL}/editPatient`; // CAMBIO CLAVE: quitado '/api/edituser/' y el ID de la URL
    
    // CAMBIO CLAVE: Usando .post() en lugar de .put()
    return this.http.post(api, patientFullData); 
  }

}
