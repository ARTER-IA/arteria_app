import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    AccordionModule,
    PanelModule,
    InputIconModule,
    IconFieldModule
  ],
  templateUrl: './help-support.component.html',
  styleUrl: './help-support.component.css',
  styles: [
    `
        :host ::ng-deep .p-inputtext {
            width: 100%;
            margin-bottom: 20px;
        }

        :host ::ng-deep .p-panel {
            margin-bottom: 15px;
        }

        :host ::ng-deep .p-panel-header-icon {
            background-color: #2a2d77;
            color: #ffffff;
        }

        :host ::ng-deep .p-panel-header {
            background-color: #2a2d77;
            border-color: #2a2d77;
            color: #ffffff;
        }

        :host ::ng-deep .p-panel-content {
            border-color: #2a2d77;
        }
    `
],
})
export class HelpSupportComponent {
  searchQuery: string = '';  // Texto de búsqueda
  faqs: any[] = [
    {
      title: '¿Cómo ingresar los datos del paciente en el sistema?',
      content: 'Para ingresar los datos de un paciente, dirígete a la vista Agregar Nuevo Paciente y completa los campos obligatorios del formulario, incluyendo información personal, factores de riesgo como edad, sexo, antecedentes familiares de enfermedades cardíacas, hipertensión, diabetes, entre otros, y datos clínicos como los resultados de los electrocardiogramas. Asegúrate de revisar la información antes de enviar el formulario para garantizar la precisión de la predicción.'
    },
    {
      title: '¿Qué significan los resultados de predicción proporcionados por el sistema?',
      content: 'El resultado de la predicción se muestra en forma de un porcentaje que indica la probabilidad de que el paciente tenga Enfermedad Arterial Coronaria (EAC). Cuanto más alto sea el porcentaje, mayor es la probabilidad de que el paciente esté en riesgo. Además del porcentaje, el sistema proporciona un informe detallado con recomendaciones basadas en las mejores prácticas médicas y directrices clínicas actuales para ayudar en la toma de decisiones.'
    },
    {
      title: '¿Cómo se calcula la probabilidad de Enfermedad Arterial Coronaria (EAC)?',
      content: 'La probabilidad de EAC se calcula utilizando un modelo de machine learning que integra diversos factores como la edad, el sexo, factores de riesgo (hipertensión, diabetes, colesterol alto), y resultados de electrocardiogramas. El modelo ha sido entrenado con datos clínicos para identificar patrones que ayudan a predecir la probabilidad de EAC en nuevos pacientes.'
    },
    {
      title: '¿Es necesario realizar pruebas adicionales antes de usar el sistema de predicción?',
      content: 'No es necesario realizar pruebas de ejercicio u otras pruebas invasivas para utilizar el sistema. El modelo está diseñado para funcionar con información de electrocardiogramas en reposo y datos clínicos básicos. Sin embargo, se recomienda que los datos ingresados sean precisos y estén actualizados para obtener los mejores resultados de predicción.'
    },
    {
      title: '¿Cómo asegurar la precisión y seguridad de los datos ingresados en la aplicación?',
      content: 'La precisión de los resultados depende de la calidad de los datos ingresados. Asegúrate de que toda la información sea correcta y esté actualizada. En cuanto a la seguridad, la aplicación cumple con las normativas de privacidad de datos y utiliza cifrado para proteger la información sensible del paciente. Además, solo los usuarios autorizados pueden acceder a la plataforma.'
    },
    {
      title: '¿Qué hacer si el sistema muestra resultados inesperados o inusuales?',
      content: 'Si el sistema muestra resultados que parecen inconsistentes o inesperados, primero verifica que todos los datos del paciente hayan sido ingresados correctamente. Si los datos son precisos y el resultado sigue siendo inusual, te recomendamos consultar con un especialista en cardiología para una evaluación más detallada. También puedes contactar a nuestro equipo de soporte técnico para resolver cualquier duda o problema técnico.'
    }
  ];

  filteredFaqs: any[] = [...this.faqs];  // Lista de preguntas filtradas

  searchFaqs() {
    // Filtra las preguntas según el texto ingresado en el campo de búsqueda
    this.filteredFaqs = this.faqs.filter(faq => faq.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

}
