// Calculadora de requerimientos nutricionales veterinarios
export interface NutritionCalculationParams {
  species: string;
  weight: number; // kg
  bcs: number; // Body Condition Score 1-9
  activityLevel: string; // 'sedentary', 'normal', 'active', 'working'
  reproductiveStatus: string; // 'intact', 'neutered', 'pregnant', 'lactating'
  age?: number; // años (opcional para ajustes adicionales)
}

export interface NutritionResult {
  dailyKcal: number;
  classification: string;
  recommendations: string;
  weightManagement?: string;
}

export class VeterinaryNutritionCalculator {
  
  // Cálculo de RER (Resting Energy Requirement) - Requerimiento Energético en Reposo
  static calculateRER(weight: number): number {
    // RER = 70 × (peso en kg)^0.75
    return 70 * Math.pow(weight, 0.75);
  }

  // Cálculo de DER (Daily Energy Requirement) - Requerimiento Energético Diario
  static calculateDER(params: NutritionCalculationParams): NutritionResult {
    const { species, weight, bcs, activityLevel, reproductiveStatus } = params;
    
    // Calcular RER base
    const rer = this.calculateRER(weight);
    
    // Factores multiplicadores según especie y condición
    let multiplier = 1.0;
    let classification = '';
    let recommendations = '';
    let weightManagement = '';

    if (species === 'Perro') {
      // Factores para caninos
      switch (reproductiveStatus) {
        case 'neutered':
          multiplier = 1.6;
          break;
        case 'intact':
          multiplier = 1.8;
          break;
        case 'pregnant':
          multiplier = 2.0; // Primera mitad de gestación
          break;
        case 'lactating':
          multiplier = 3.0; // Puede llegar hasta 4.0 según número de cachorros
          break;
        default:
          multiplier = 1.8;
      }

      // Ajuste por actividad física
      switch (activityLevel) {
        case 'sedentary':
          multiplier *= 0.8;
          break;
        case 'normal':
          multiplier *= 1.0;
          break;
        case 'active':
          multiplier *= 1.2;
          break;
        case 'working':
          multiplier *= 1.5;
          break;
      }

      // Ajuste por condición corporal
      if (bcs <= 3) {
        multiplier *= 1.2; // Bajo peso - incrementar
        weightManagement = 'Incrementar gradualmente la ingesta calórica para ganancia de peso.';
      } else if (bcs >= 7) {
        multiplier *= 0.8; // Sobrepeso - reducir
        weightManagement = 'Reducir la ingesta calórica para pérdida de peso controlada.';
      }

    } else if (species === 'Gato') {
      // Factores para felinos
      switch (reproductiveStatus) {
        case 'neutered':
          multiplier = 1.2;
          break;
        case 'intact':
          multiplier = 1.4;
          break;
        case 'pregnant':
          multiplier = 1.6; // Incrementa durante gestación
          break;
        case 'lactating':
          multiplier = 2.5; // Puede llegar hasta 3.0
          break;
        default:
          multiplier = 1.4;
      }

      // Ajuste por actividad física
      switch (activityLevel) {
        case 'sedentary':
          multiplier *= 0.8;
          break;
        case 'normal':
          multiplier *= 1.0;
          break;
        case 'active':
          multiplier *= 1.1;
          break;
        case 'working':
          multiplier *= 1.3; // Gatos de trabajo son menos comunes
          break;
      }

      // Ajuste por condición corporal
      if (bcs <= 3) {
        multiplier *= 1.15;
        weightManagement = 'Aumentar gradualmente las calorías para alcanzar peso ideal.';
      } else if (bcs >= 7) {
        multiplier *= 0.85;
        weightManagement = 'Dieta hipocalórica controlada para reducción de peso.';
      }
    }

    const dailyKcal = Math.round(rer * multiplier);

    // Clasificación según requerimiento
    if (dailyKcal < 200) {
      classification = 'Requerimiento bajo';
      recommendations = 'Dieta concentrada en nutrientes. Monitorear ganancia de peso.';
    } else if (dailyKcal <= 400) {
      classification = 'Requerimiento normal';
      recommendations = 'Dieta balanceada estándar. Mantener peso corporal ideal.';
    } else if (dailyKcal <= 800) {
      classification = 'Requerimiento elevado';
      recommendations = 'Dieta alta en energía. Dividir en múltiples comidas diarias.';
    } else {
      classification = 'Requerimiento muy elevado';
      recommendations = 'Dieta súper premium. Alimentar 3-4 veces al día.';
    }

    return {
      dailyKcal,
      classification,
      recommendations,
      weightManagement
    };
  }

  // Cálculo de cantidad de alimento según densidad energética
  static calculateFoodAmount(dailyKcal: number, foodKcalPer100g: number): number {
    // Retorna gramos de alimento necesarios por día
    return Math.round((dailyKcal * 100) / foodKcalPer100g);
  }

  // Distribución de comidas según peso y especie
  static getMealDistribution(species: string, weight: number): { meals: number; description: string } {
    if (species === 'Perro') {
      if (weight < 10) {
        return { meals: 3, description: '3 comidas diarias (razas pequeñas)' };
      } else if (weight < 25) {
        return { meals: 2, description: '2 comidas diarias (razas medianas)' };
      } else {
        return { meals: 2, description: '2 comidas diarias (razas grandes - prevenir torsión gástrica)' };
      }
    } else if (species === 'Gato') {
      return { meals: 3, description: '3-4 comidas pequeñas diarias (comportamiento natural felino)' };
    }
    return { meals: 2, description: '2 comidas diarias' };
  }
}

// Datos de alimentos comerciales comunes en Chile (kcal/100g)
export const commonPetFoods = {
  dog: [
    { name: 'Alimento Seco Premium Adulto', kcalPer100g: 350 },
    { name: 'Alimento Seco Super Premium', kcalPer100g: 380 },
    { name: 'Alimento Húmedo Lata', kcalPer100g: 85 },
    { name: 'Alimento Light/Senior', kcalPer100g: 320 },
    { name: 'Alimento Puppy/Cachorro', kcalPer100g: 400 }
  ],
  cat: [
    { name: 'Alimento Seco Premium Adulto', kcalPer100g: 380 },
    { name: 'Alimento Seco Super Premium', kcalPer100g: 420 },
    { name: 'Alimento Húmedo Lata', kcalPer100g: 90 },
    { name: 'Alimento Light/Senior', kcalPer100g: 350 },
    { name: 'Alimento Kitten/Gatito', kcalPer100g: 450 }
  ]
};