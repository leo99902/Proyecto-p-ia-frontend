import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../shared/constants/app.constants';

/**
 * Service to manage patient editing operations on the backend.
 * It is assumed that "patients" are handled by the same "users" endpoints on the backend.
 */
@Injectable({
  providedIn: 'root' // Indicates that the service will be available throughout the application tree
})
export class EditPatientService { // Class name according to import in the component

  // Base API URL, imported from a shared constants file
  private API_URL = API_URL;
  
  // Dependency injection of HttpClient to make HTTP requests
  readonly http = inject(HttpClient);

  /**
   * Sends a POST request to the backend to update the data of an existing patient.
   *
   * @param id The unique ID of the patient (user) to be edited.
   * @param userData An object containing the patient data to be updated.
   * It must include the fields to be modified (e.g., name, email, ci, etc.).
   * @returns An Observable that emits the API response after attempting the edit.
   */
  editUser(id: number, userData: any): Observable<any> {
    // Construct the full URL of the edit endpoint.
    // The expected backend structure is '/api/edituser/:id', where :id is the user ID.
    const api = `${this.API_URL}/api/edituser/${id}`; // CORRECTION: Points to the user edit endpoint
    
    // Make the POST request, sending the user data in the request body.
    return this.http.post(api, userData);
  }

}
