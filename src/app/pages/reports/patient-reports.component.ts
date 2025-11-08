import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowListPatientsService, Patient, PatientsApiResponse } from '../../services/show.list.patients.service/show.list.patients.service';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-reports.component.html',
  styleUrls: ['./patient-reports.component.css']
})
export class PatientReportsComponent implements OnInit {
  private patientsService = inject(ShowListPatientsService);

  patients = signal<Patient[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Por ahora, enviamos un cuerpo vacío. Puedes añadir paginación o filtros aquí.
    this.patientsService.listUsers({}).subscribe({
      next: (response: PatientsApiResponse) => {
        this.patients.set(response.value || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        this.error.set('No se pudieron cargar los pacientes. Inténtalo de nuevo más tarde.');
        this.isLoading.set(false);
      }
    });
  }

  async downloadReport(patient: Patient): Promise<void> {
    if (!patient) {
      console.error('No se encontró el paciente para generar el reporte.');
      this.error.set('No se pudo generar el reporte para el paciente seleccionado.');
      return;
    }
    
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    doc.text(`Reporte del Paciente: ${patient.user}`, 14, 20);
    doc.text(`Cédula: ${patient.cedula}`, 14, 30);
    doc.text(`Email: ${patient.email}`, 14, 40);
    doc.text(`Teléfono: ${patient.phone}`, 14, 50);
    doc.text(`Estado: ${patient.state}`, 14, 60);
    doc.text(`Ocupación: ${patient.occupation}`, 14, 70);
    doc.text(`Enfermedad: ${patient.disease}`, 14, 80);
    
    doc.save(`reporte-${patient.user.replace(/\s/g, '_')}.pdf`);
  }
  
  async generateGlobalReport(): Promise<void> {
    this.isLoading.set(true); // Muestra el indicador de carga
    this.error.set(null); // Limpia errores previos

    // Llama al servicio para obtener TODOS los pacientes, sin paginación.
    this.patientsService.listAllUsers().subscribe({
      next: async (response) => {
        try {
          const allPatients = response.value || []; // Usa la lista completa de la respuesta

          if (allPatients.length === 0) {
            this.error.set('No hay pacientes para generar el reporte.');
            this.isLoading.set(false);
            return;
          }

          // Lógica manual para generar el PDF, igual que en el reporte individual
          const { default: jsPDF } = await import('jspdf');
          
          const doc = new jsPDF();
          let yPos = 20; // Posición Y inicial
          const pageHeight = doc.internal.pageSize.height;
          const margin = 20;
          
          doc.text("Reporte General de Pacientes", 14, 15);
          
          // Itera sobre la lista completa de pacientes
          allPatients.forEach(patient => {
            // Si el contenido excede la página, añade una nueva
            if (yPos > pageHeight - margin) {
              doc.addPage();
              yPos = margin; // Reinicia la posición en la nueva página
            }

            doc.text(`Nombre: ${patient.user}`, 14, yPos);
            doc.text(`Cédula: ${patient.cedula}`, 14, yPos += 7);
            doc.text(`Email: ${patient.email}`, 14, yPos += 7);
            doc.text(`Teléfono: ${patient.phone}`, 14, yPos += 7);
            doc.text(`Estado: ${patient.state}`, 14, yPos += 7);
            doc.line(14, yPos + 2, 196, yPos + 2); // Separador
            yPos += 12; // Espacio para el siguiente paciente
          });
          
          doc.save('reporte-general-pacientes.pdf');
        } catch (pdfError) {
          console.error('Error al generar el PDF:', pdfError);
          this.error.set('Ocurrió un error al generar el archivo PDF.');
        } finally {
          this.isLoading.set(false); // Asegura que el loading se quite siempre
        }
      },
      error: (err) => {
        console.error('Error fetching all patients for report:', err);
        this.error.set('No se pudo generar el reporte global. Inténtalo de nuevo.');
        this.isLoading.set(false);
      }
    });
  }
}