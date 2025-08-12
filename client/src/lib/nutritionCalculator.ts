// Calculadora de requerimientos nutricionales veterinarios
export interface NutritionCalculationParams {
  species: string;
  weight: number; // kg
  bcs: number; // Body Condition Score 1-9
  activityLevel: string; // 'puppy_under4', 'puppy_over4', 'neutered_sedentary', 'active', 'light_work', 'heavy_work', 'weight_loss', 'weight_gain', 'geriatric', 'kitten', 'indoor_sedentary', 'outdoor_active', 'pregnant', 'lactating'
  reproductiveStatus?: string; // Mantenido para compatibilidad pero ahora se maneja en activityLevel
  age?: number; // años (opcional para ajustes adicionales)
}

export interface NutritionResult {
  dailyKcal: number;
  classification: string;
  recommendations: string;
  weightManagement?: string;
  description?: string;
  meals?: number;
  nutritionalRequirements?: {
    protein: number; // g/día
    fat: number; // g/día
    linoleicAcid: number; // g/1000 kcal
    alphaLinolenicAcid?: number; // g/1000 kcal (solo perros)
    arachidonicAcid?: number; // g/1000 kcal (solo gatos)
    epaDha?: string; // recomendación EPA+DHA
  };
}

export class VeterinaryNutritionCalculator {
  
  // Cálculo de RER (Resting Energy Requirement) - Requerimiento Energético en Reposo
  static calculateRER(weight: number): number {
    // RER = 70 × (peso en kg)^0.75
    return 70 * Math.pow(weight, 0.75);
  }

  // Cálculo de DER (Daily Energy Requirement) - Requerimiento Energético Diario
  static calculateDER(params: NutritionCalculationParams): NutritionResult {
    const { species, weight, bcs, activityLevel } = params;
    
    // Calcular RER base
    const rer = this.calculateRER(weight);
    
    // Factores multiplicadores según especie y condición específica
    let multiplier = 1.0;
    let classification = '';
    let recommendations = '';
    let weightManagement = '';

    if (species === 'Perro') {
      // Factores específicos para caninos según tabla veterinaria
      switch (activityLevel) {
        case 'puppy_under4':
          multiplier = 3.0;
          classification = 'Cachorro < 4 meses';
          recommendations = 'Alimentación frecuente, alimento para cachorros de alta calidad.';
          break;
        case 'puppy_over4':
          multiplier = 2.0;
          classification = 'Cachorro > 4 meses';
          recommendations = 'Transición gradual a alimento adulto según raza.';
          break;
        case 'neutered_sedentary':
          multiplier = 1.6;
          classification = 'Adulto esterilizado/sedentario';
          recommendations = 'Control de peso, ejercicio regular moderado.';
          break;
        case 'active':
          multiplier = 2.0;
          classification = 'Adulto activo';
          recommendations = 'Paseos largos diarios, juegos activos.';
          break;
        case 'light_work':
          multiplier = 3.0; // Promedio de 2.5-4.0
          classification = 'Trabajo ligero';
          recommendations = 'Deporte, agility, actividades de entrenamiento.';
          break;
        case 'heavy_work':
          multiplier = 6.0; // Promedio de 4.0-8.0
          classification = 'Trabajo pesado';
          recommendations = 'Trineo, búsqueda y rescate, trabajo en climas extremos.';
          break;
        case 'weight_loss':
          multiplier = 1.0;
          classification = 'Pérdida de peso';
          recommendations = 'Dieta hipocalórica estricta, ejercicio controlado.';
          weightManagement = 'Plan de pérdida de peso supervisado por veterinario.';
          break;
        case 'weight_gain':
          multiplier = 1.3; // Promedio de 1.2-1.4
          classification = 'Ganancia de peso';
          recommendations = 'Dieta hipercalórica, múltiples comidas pequeñas.';
          weightManagement = 'Incrementar calorías gradualmente hasta peso objetivo.';
          break;
        case 'geriatric':
          multiplier = 1.3; // Promedio de 1.2-1.4
          classification = 'Geriátrico';
          recommendations = 'Alimento senior, fácil digestión, suplementos según necesidad.';
          break;
        default:
          multiplier = 1.6; // Esterilizado/sedentario por defecto
      }

    } else if (species === 'Gato') {
      // Factores específicos para felinos según tabla veterinaria
      switch (activityLevel) {
        case 'kitten':
          multiplier = 2.5;
          classification = 'Gatito en crecimiento';
          recommendations = 'Alimento para gatitos, alimentación libre o frecuente.';
          break;
        case 'indoor_sedentary':
          multiplier = 1.3; // Promedio de 1.2-1.4
          classification = 'Adulto esterilizado/indoor';
          recommendations = 'Control de peso, estimulación ambiental, juegos.';
          break;
        case 'outdoor_active':
          multiplier = 1.5; // Promedio de 1.4-1.6
          classification = 'Adulto activo/outdoor';
          recommendations = 'Acceso exterior, alta estimulación, caza natural.';
          break;
        case 'pregnant':
          multiplier = 2.0;
          classification = 'Gestación';
          recommendations = 'Alimento para gatitas gestantes, alimentación libre.';
          break;
        case 'lactating':
          multiplier = 4.0; // Promedio de 2.0-6.0 (máxima producción)
          classification = 'Lactancia';
          recommendations = 'Alimentación libre, alimento de alta calidad y densidad.';
          break;
        case 'weight_loss':
          multiplier = 0.8;
          classification = 'Pérdida de peso';
          recommendations = 'Dieta prescrita, control veterinario estricto.';
          weightManagement = 'Reducción calórica controlada para evitar lipidosis hepática.';
          break;
        case 'weight_gain':
          multiplier = 1.2;
          classification = 'Ganancia de peso';
          recommendations = 'Dieta alta en calorías, palatabilidad aumentada.';
          weightManagement = 'Incremento calórico gradual hasta peso ideal.';
          break;
        case 'geriatric':
          multiplier = 1.05; // Promedio de 1.0-1.1
          classification = 'Geriátrico sedentario';
          recommendations = 'Alimento senior, fácil digestión, monitoreo renal.';
          break;
        default:
          multiplier = 1.3; // Indoor/sedentario por defecto
      }
    }

    // Calcular DER final
    const dailyKcal = Math.round(rer * multiplier);
    
    // Calcular peso metabólico (kg^0.75)
    const metabolicWeight = Math.pow(weight, 0.75);
    
    // Calcular requerimientos nutricionales según NRC/AAFCO
    let nutritionalRequirements;
    let description = '';
    let meals = 2; // Por defecto 2 comidas
    
    if (species === 'Perro') {
      // Requerimientos para perros adultos (NRC/AAFCO)
      nutritionalRequirements = {
        protein: Math.round(2.62 * metabolicWeight * 10) / 10, // g/día
        fat: Math.round(1.3 * metabolicWeight * 10) / 10, // g/día
        linoleicAcid: Math.round((2.8 * dailyKcal / 1000) * 10) / 10, // g/1000 kcal
        alphaLinolenicAcid: Math.round((0.08 * dailyKcal / 1000) * 100) / 100, // g/1000 kcal
        epaDha: '0.05-0.1 g/1000 kcal (beneficioso)'
      };
      
      description = '≈18% proteína, ≈5.5% grasa de energía metabolizable';
      
      // Ajustar número de comidas según clasificación
      if (activityLevel === 'puppy_under4') {
        meals = 4;
      } else if (activityLevel === 'puppy_over4') {
        meals = 3;
      } else if (activityLevel === 'heavy_work') {
        meals = 3;
      }
      
    } else if (species === 'Gato') {
      // Requerimientos para gatos adultos (NRC/AAFCO)
      nutritionalRequirements = {
        protein: Math.round(5.0 * metabolicWeight * 10) / 10, // g/día
        fat: Math.round(2.0 * metabolicWeight * 10) / 10, // g/día
        linoleicAcid: Math.round((2.0 * dailyKcal / 1000) * 10) / 10, // g/1000 kcal
        arachidonicAcid: Math.round((0.02 * dailyKcal / 1000) * 100) / 100, // g/1000 kcal (solo gatos)
        epaDha: '0.05-0.1 g/1000 kcal (recomendado)'
      };
      
      description = '≈26% proteína, ≈9% grasa de energía metabolizable';
      
      // Ajustar número de comidas según clasificación
      if (activityLevel === 'kitten') {
        meals = 4;
      } else if (activityLevel === 'pregnant' || activityLevel === 'lactating') {
        meals = 3;
      }
    }

    return {
      dailyKcal,
      classification,
      recommendations,
      weightManagement,
      description,
      meals,
      nutritionalRequirements
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