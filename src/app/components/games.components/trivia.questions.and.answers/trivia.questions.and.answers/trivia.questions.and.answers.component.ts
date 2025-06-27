import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como *ngIf y *ngFor
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)] si se usa en el futuro

@Component({
  selector: 'app-trivia-game', // Selector HTML para usar este componente
  standalone: true, // Define el componente como autónomo (standalone)
  imports: [CommonModule, FormsModule], // Módulos necesarios para el componente
  templateUrl: './trivia.questions.and.answers.component.html',
  styleUrl: './trivia.questions.and.answers.component.scss'
})
export class TriviaQuestionsAndAnswersComponent implements OnInit {

  // Definición de las preguntas y respuestas del juego de trivia
  questions = [
    {
      question: "¿Cuál es el animal más grande del mundo?",
      options: ["Elefante", "Ballena azul", "Jirafa", "Tiburón blanco"],
      answer: "Ballena azul"
    },
    {
      question: "¿Cuántos planetas hay en nuestro sistema solar?",
      options: ["7", "8", "9", "10"],
      answer: "8"
    },
    {
      question: "¿Cuál es la capital de Francia?",
      options: ["Roma", "Londres", "París", "Berlín"],
      answer: "París"
    },
    {
      question: "¿Qué gas respiramos los seres humanos?",
      options: ["Dióxido de carbono", "Nitrógeno", "Oxígeno", "Metano"],
      answer: "Oxígeno"
    },
    {
      question: "¿Qué deporte se conoce como el 'rey de los deportes'?",
      options: ["Baloncesto", "Fútbol", "Tenis", "Natación"],
      answer: "Fútbol"
    },
    {
      question: "¿Cuántos lados tiene un triángulo?",
      options: ["2", "3", "4", "5"],
      answer: "3"
    },
    {
      question: "¿Cuál es el color primario que falta: rojo, azul y...?",
      options: ["Verde", "Amarillo", "Naranja", "Morado"],
      answer: "Amarillo"
    },
    {
      question: "¿Qué estación del año sigue al otoño?",
      options: ["Verano", "Primavera", "Invierno", "Estación seca"],
      answer: "Invierno"
    },
    {
      question: "¿Cuál es el océano más grande del mundo?",
      options: ["Océano Atlántico", "Océano Índico", "Océano Pacífico", "Océano Ártico"],
      answer: "Océano Pacífico"
    },
    {
      question: "¿Cuántos dedos tiene una mano (sin contar el pulgar)?",
      options: ["3", "4", "5", "Todos"],
      answer: "4"
            },
            {
                question: "¿Qué fruta es conocida por mantener alejados a los médicos?",
                options: ["Naranja", "Manzana", "Plátano", "Uva"],
                answer: "Manzana"
            },
            {
                question: "¿Cuál es el animal que ladra?",
                options: ["Gato", "Perro", "Vaca", "Pez"],
                answer: "Perro"
            },
            {
                question: "¿Qué bebida se obtiene de las uvas?",
                options: ["Cerveza", "Vino", "Leche", "Café"],
                answer: "Vino"
            },
            {
                question: "¿Cuántos colores tiene el arcoíris?",
                options: ["5", "6", "7", "8"],
                answer: "7"
            },
            {
                question: "¿Qué animal es el rey de la selva?",
                options: ["Tigre", "León", "Elefante", "Mono"],
                answer: "León"
            },
            {
                question: "¿Cuál es la capital de España?",
                options: ["Barcelona", "Madrid", "Lisboa", "Roma"],
                answer: "Madrid"
            },
            {
                question: "¿Qué es el sol?",
                options: ["Planeta", "Estrella", "Luna", "Galaxia"],
                answer: "Estrella"
            },
            {
                question: "¿Qué se usa para escribir en un pizarrón blanco?",
                options: ["Lápiz", "Pluma", "Marcador", "Crayola"],
                answer: "Marcador"
            },
            {
                question: "¿Qué animal produce leche para beber?",
                options: ["Gallina", "Cerdo", "Vaca", "Caballo"],
                answer: "Vaca"
            },
            {
                question: "¿Cuál es el opuesto de 'frío'?",
                options: ["Húmedo", "Mojado", "Caliente", "Seco"],
                answer: "Caliente"
            }
  ];

  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  score: number = 0; // Puntuación del jugador
  selectedOption: string | null = null; // Opción seleccionada por el usuario (para feedback visual)
  showResult: boolean = false; // Bandera para mostrar la sección de resultados finales
  feedbackMessage: string = ''; // Mensaje de retroalimentación para cada respuesta

  constructor() { }

  ngOnInit(): void {
    // Inicializa el juego al cargar el componente
    this.resetGame();
  }

  /**
   * Verifica la respuesta seleccionada por el usuario.
   * @param option La opción seleccionada por el usuario.
   */
  checkAnswer(option: string): void {
    this.selectedOption = option; // Guarda la opción seleccionada para la vista
    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (option === currentQuestion.answer) {
      this.score++; // Incrementa la puntuación si es correcta
      this.feedbackMessage = '¡Correcto!';
    } else {
      this.feedbackMessage = `Incorrecto. La respuesta correcta era: ${currentQuestion.answer}`;
    }

    // Pasa a la siguiente pregunta después de un breve retraso para mostrar el feedback
    setTimeout(() => {
      this.feedbackMessage = ''; // Limpia el mensaje de feedback
      this.selectedOption = null; // Reinicia la opción seleccionada
      this.nextQuestion();
    }, 1500); // Muestra el feedback por 1.5 segundos
  }

  /**
   * Avanza a la siguiente pregunta o finaliza el juego si no hay más preguntas.
   */
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++; // Pasa a la siguiente pregunta
    } else {
      this.showResult = true; // Muestra el resultado final
    }
  }

  /**
   * Reinicia el juego al estado inicial.
   */
  resetGame(): void {
    this.currentQuestionIndex = 0; // Vuelve a la primera pregunta
    this.score = 0; // Resetea la puntuación
    this.selectedOption = null; // Limpia la opción seleccionada
    this.showResult = false; // Oculta el resultado final
    this.feedbackMessage = ''; // Limpia el mensaje de feedback
  }

  /**
   * Obtiene las clases CSS para los botones de opción, aplicando estilos basados en la selección y corrección.
   * @param option La opción del botón a la que se le aplicarán las clases.
   * @returns Una cadena de clases CSS.
   */
  getOptionClass(option: string): string {
    if (this.selectedOption) { // Solo aplica estilos de feedback si ya se ha seleccionado una opción
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (option === currentQuestion.answer) {
        return 'option-button correct'; // La respuesta correcta
      } else if (option === this.selectedOption) {
        return 'option-button incorrect'; // La opción incorrecta seleccionada por el usuario
      }
    }
    return 'option-button default'; // Estilo por defecto si no se ha seleccionado o si es otra opción incorrecta
  }
}
