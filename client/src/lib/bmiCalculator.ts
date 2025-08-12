// Calculadora de IMC veterinario y BCS (Body Condition Score)
export interface BMICalculationParams {
  species: string;
  weight: number; // en kg
  bodyLength?: number; // en cm (opcional para algunas fórmulas)
  chestCircumference?: number; // en cm (para fórmula canina)
  legLength?: number; // en cm (para fórmula felina)
  bcs?: number; // Body Condition Score 1-9
}

export interface BMIResult {
  bmi?: number;
  fbmi?: number; // Para gatos
  classification: string;
  recommendation: string;
  bcsInterpretation?: string;
  idealWeightRange?: string;
  nutritionalAdvice: string;
  exerciseRecommendation: string;
}

export class VeterinaryBMICalculator {
  
  // Fórmula FBMI para gatos (Feline Body Mass Index)
  static calculateFelineFBMI(params: BMICalculationParams): BMIResult {
    const { weight, legLength, bcs } = params;
    
    let fbmi: number | undefined;
    let classification = '';
    let recommendation = '';
    
    // FBMI Felino = (Peso corporal en kg / (Longitud de pata trasera en cm)²) × 10000
    if (legLength && legLength > 0) {
      fbmi = (weight / Math.pow(legLength, 2)) * 10000;
      console.log(`FBMI calculation: weight=${weight}, legLength=${legLength}, result=${fbmi}`);
      
      // Clasificación FBMI felina
      if (fbmi < 15) {
        classification = 'Bajo peso severo';
        recommendation = 'Evaluación nutricional urgente. Posible patología subyacente.';
      } else if (fbmi >= 15 && fbmi < 20) {
        classification = 'Bajo peso';
        recommendation = 'Incrementar aporte calórico con dieta hipercalórica.';
      } else if (fbmi >= 20 && fbmi < 30) {
        classification = 'Peso ideal';
        recommendation = 'Mantener peso actual con dieta balanceada.';
      } else if (fbmi >= 30 && fbmi < 35) {
        classification = 'Sobrepeso';
        recommendation = 'Reducir aporte calórico 10-15%. Incrementar actividad física.';
      } else {
        classification = 'Obesidad';
        recommendation = 'Plan de pérdida de peso supervisado. Dieta hipocalórica.';
      }
    } else {
      // Si no tenemos medidas, usar solo peso y BCS
      classification = 'Evaluación basada en peso y BCS';
      recommendation = 'Se requieren medidas corporales para FBMI preciso.';
    }
    
    const bcsInterpretation = this.interpretBCS(bcs || 5);
    const idealWeightRange = this.calculateIdealWeightRange(weight, bcs || 5);
    
    return {
      fbmi,
      classification,
      recommendation,
      bcsInterpretation,
      idealWeightRange,
      nutritionalAdvice: '',
      exerciseRecommendation: ''
    };
  }
  
  // Fórmula IMC canino (adaptación de Mawby)
  static calculateCanineBMI(params: BMICalculationParams): BMIResult {
    const { weight, bodyLength, chestCircumference, bcs } = params;
    
    let bmi: number | undefined;
    let classification = '';
    let recommendation = '';
    
    // IMC Canino (Mawby) = Peso (kg) / ((Longitud corporal en cm / 100)²)
    if (bodyLength && bodyLength > 0) {
      const lengthInMeters = bodyLength / 100;
      bmi = weight / Math.pow(lengthInMeters, 2);
      console.log(`Canine BMI calculation: weight=${weight}, bodyLength=${bodyLength}, lengthInMeters=${lengthInMeters}, result=${bmi}`);
      
      // Clasificación IMC canina (valores ajustados para perros)
      if (bmi < 11) {
        classification = 'Bajo peso severo';
        recommendation = 'Evaluación veterinaria inmediata. Posible enfermedad subyacente.';
      } else if (bmi >= 11 && bmi < 15) {
        classification = 'Bajo peso';
        recommendation = 'Incrementar aporte calórico. Evaluar causas de pérdida de peso.';
      } else if (bmi >= 15 && bmi < 25) {
        classification = 'Peso ideal';
        recommendation = 'Mantener peso actual con dieta equilibrada y ejercicio regular.';
      } else if (bmi >= 25 && bmi < 30) {
        classification = 'Sobrepeso';
        recommendation = 'Reducir calorías 10-20%. Incrementar ejercicio diario.';
      } else {
        classification = 'Obesidad';
        recommendation = 'Plan de pérdida de peso estricto. Control veterinario mensual.';
      }
    } else {
      // Si no tenemos medidas, usar solo peso y BCS
      classification = 'Evaluación basada en peso y BCS';
      recommendation = 'Se requieren medidas corporales para IMC preciso.';
    }
    
    const bcsInterpretation = this.interpretBCS(bcs || 5);
    const idealWeightRange = this.calculateIdealWeightRange(weight, bcs || 5);
    
    return {
      bmi,
      classification,
      recommendation,
      bcsInterpretation,
      idealWeightRange,
      nutritionalAdvice: '',
      exerciseRecommendation: ''
    };
  }
  
  // Interpretación del Body Condition Score (escala 1-9)
  static interpretBCS(bcs: number): string {
    if (bcs <= 1) {
      return 'BCS 1: Extremadamente delgado - Costillas, vértebras y huesos pélvicos claramente visibles';
    } else if (bcs <= 2) {
      return 'BCS 2: Muy delgado - Costillas fácilmente palpables sin presión';
    } else if (bcs <= 3) {
      return 'BCS 3: Delgado - Costillas palpables con ligera presión';
    } else if (bcs <= 4) {
      return 'BCS 4: Bajo del ideal - Costillas palpables con presión mínima';
    } else if (bcs === 5) {
      return 'BCS 5: Ideal - Costillas palpables sin exceso de grasa. Cintura visible';
    } else if (bcs <= 6) {
      return 'BCS 6: Sobre el ideal - Costillas palpables con ligera dificultad';
    } else if (bcs <= 7) {
      return 'BCS 7: Sobrepeso - Costillas difíciles de palpar debido a grasa';
    } else if (bcs <= 8) {
      return 'BCS 8: Obeso - Costillas muy difíciles de palpar. Depósitos de grasa evidentes';
    } else {
      return 'BCS 9: Extremadamente obeso - Costillas no palpables. Depósitos masivos de grasa';
    }
  }
  
  // Calcular rango de peso ideal basado en BCS actual
  static calculateIdealWeightRange(currentWeight: number, bcs: number): string {
    let adjustmentFactor = 1;
    
    switch (bcs) {
      case 1:
      case 2:
        adjustmentFactor = 1.20; // Necesita ganar 20%
        break;
      case 3:
        adjustmentFactor = 1.10; // Necesita ganar 10%
        break;
      case 4:
        adjustmentFactor = 1.05; // Necesita ganar 5%
        break;
      case 5:
        adjustmentFactor = 1.00; // Peso ideal
        break;
      case 6:
        adjustmentFactor = 0.95; // Necesita perder 5%
        break;
      case 7:
        adjustmentFactor = 0.85; // Necesita perder 15%
        break;
      case 8:
        adjustmentFactor = 0.75; // Necesita perder 25%
        break;
      case 9:
        adjustmentFactor = 0.65; // Necesita perder 35%
        break;
      default:
        adjustmentFactor = 1.00;
    }
    
    const idealWeight = currentWeight * adjustmentFactor;
    const lowerRange = idealWeight * 0.95;
    const upperRange = idealWeight * 1.05;
    
    return `${lowerRange.toFixed(1)} - ${upperRange.toFixed(1)} kg`;
  }

  
  // Función principal para calcular según especie
  static calculateBMI(params: BMICalculationParams): BMIResult {
    console.log('VeterinaryBMICalculator.calculateBMI called with:', params);
    const species = params.species.toLowerCase();
    console.log('Species detected:', species);
    
    if (species.includes('gato') || species.includes('felino')) {
      console.log('Using FBMI formula for cats');
      return this.calculateFelineFBMI(params);
    } else if (species.includes('perro') || species.includes('canino')) {
      console.log('Using canine BMI formula for dogs');
      return this.calculateCanineBMI(params);
    } else {
      console.log('Species not supported:', species);
      return {
        classification: 'Especie no soportada',
        recommendation: 'Cálculo de IMC disponible solo para perros y gatos',
        nutritionalAdvice: '',
        exerciseRecommendation: ''
      };
    }
  }
  
  // Validar parámetros de entrada
  static validateParams(params: BMICalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!params.weight || params.weight <= 0) {
      errors.push('El peso debe ser mayor a 0 kg');
    }
    
    if (params.weight && params.weight > 200) {
      errors.push('Peso excesivamente alto. Verificar unidad de medida (kg)');
    }
    
    if (params.bodyLength && (params.bodyLength < 5 || params.bodyLength > 200)) {
      errors.push('Longitud corporal debe estar entre 5 y 200 cm');
    }
    
    if (params.legLength && (params.legLength < 2 || params.legLength > 50)) {
      errors.push('Longitud de pata debe estar entre 2 y 50 cm');
    }
    
    if (params.chestCircumference && (params.chestCircumference < 10 || params.chestCircumference > 150)) {
      errors.push('Circunferencia torácica debe estar entre 10 y 150 cm');
    }
    
    if (params.bcs && (params.bcs < 1 || params.bcs > 9)) {
      errors.push('BCS debe estar entre 1 y 9');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}