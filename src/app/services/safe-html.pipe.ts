import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    // 1. Reemplazar saltos de línea con <br>
    let html = value.replace(/\n/g, '<br>');

    // 2. Convertir negritas (**texto**) a <strong>texto</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Convertir bloques de listas desordenadas (* item) a <ul><li>...</li></ul>
    html = html.replace(/(?:<br>\* (?:.*?))+/g, (match) => {
      const items = match.replace(/<br>\* /g, '<li>') + '</li>';
      return `<ul>${items}</ul>`;
    });

    // 4. Convertir bloques de listas ordenadas (1. item) a <ol><li>...</li></ol>
    html = html.replace(/(?:<br>\d+\. (?:.*?))+/g, (match) => {
      const items = match.replace(/<br>\d+\. /g, '<li>') + '</li>';
      return `<ol>${items}</ol>`;
    });

    // 5. Sanitizar el HTML resultante para prevenir ataques XSS y devolverlo como SafeHtml
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}