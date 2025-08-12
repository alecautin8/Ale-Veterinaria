// Calculadora de fechas de próximas vacunas según vigencia
export interface VaccineSchedule {
  vaccineType: string;
  standardDuration: number; // en días
  description: string;
}

export const VACCINE_SCHEDULES: Record<string, VaccineSchedule> = {
  // Vacunas para perros
  'distemper': {
    vaccineType: 'Distemper',
    standardDuration: 365,
    description: 'Anual'
  },
  'parvovirus': {
    vaccineType: 'Parvovirus',
    standardDuration: 365,
    description: 'Anual'
  },
  'hepatitis': {
    vaccineType: 'Hepatitis/Adenovirus',
    standardDuration: 365,
    description: 'Anual'
  },
  'parainfluenza': {
    vaccineType: 'Parainfluenza',
    standardDuration: 365,
    description: 'Anual'
  },
  'leptospirosis': {
    vaccineType: 'Leptospirosis',
    standardDuration: 365,
    description: 'Anual'
  },
  'bordetella': {
    vaccineType: 'Bordetella (Tos de las Perreras)',
    standardDuration: 365,
    description: 'Anual'
  },
  'rabia_perro': {
    vaccineType: 'Antirrábica',
    standardDuration: 365,
    description: 'Anual'
  },

  // Vacunas para gatos
  'panleucopenia': {
    vaccineType: 'Panleucopenia Felina',
    standardDuration: 365,
    description: 'Anual'
  },
  'rinotraqueitis': {
    vaccineType: 'Rinotraqueitis Felina',
    standardDuration: 365,
    description: 'Anual'
  },
  'calicivirus': {
    vaccineType: 'Calicivirus Felino',
    standardDuration: 365,
    description: 'Anual'
  },
  'leucemia': {
    vaccineType: 'Leucemia Felina (FeLV)',
    standardDuration: 365,
    description: 'Anual'
  },
  'rabia_gato': {
    vaccineType: 'Antirrábica',
    standardDuration: 365,
    description: 'Anual'
  },

  // Vacunas combinadas comunes
  'quintuple': {
    vaccineType: 'Quíntuple (Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis)',
    standardDuration: 365,
    description: 'Anual'
  },
  'triple_felina': {
    vaccineType: 'Triple Felina (Panleucopenia, Rinotraqueitis, Calicivirus)',
    standardDuration: 365,
    description: 'Anual'
  }
};

export interface VaccinationCalculationParams {
  vaccinationDate: string;
  customDuration?: number; // días personalizados
  vaccineType?: string;
}

export interface VaccinationResult {
  nextDueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
  validityPeriod: string;
  alertLevel: 'green' | 'yellow' | 'red';
}

export class VaccineCalculator {
  
  static calculateNextVaccination(params: VaccinationCalculationParams): VaccinationResult {
    const { vaccinationDate, customDuration, vaccineType } = params;
    
    const vaccinationDateObj = new Date(vaccinationDate);
    const today = new Date();
    
    // Determinar duración (personalizada o estándar)
    let durationDays = customDuration;
    
    if (!durationDays && vaccineType) {
      const schedule = this.findVaccineSchedule(vaccineType);
      durationDays = schedule?.standardDuration || 365;
    }
    
    if (!durationDays) {
      durationDays = 365; // Por defecto 1 año
    }
    
    // Calcular fecha de próxima vacuna
    const nextDueDate = new Date(vaccinationDateObj);
    nextDueDate.setDate(nextDueDate.getDate() + durationDays);
    
    // Calcular días hasta vencimiento
    const diffTime = nextDueDate.getTime() - today.getTime();
    const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Determinar estado y nivel de alerta
    const isOverdue = daysUntilDue < 0;
    const alertLevel = this.getAlertLevel(daysUntilDue);
    
    // Formatear período de validez
    const validityPeriod = this.formatValidityPeriod(durationDays);
    
    return {
      nextDueDate: nextDueDate.toISOString().split('T')[0],
      daysUntilDue,
      isOverdue,
      validityPeriod,
      alertLevel
    };
  }
  
  private static findVaccineSchedule(vaccineType: string): VaccineSchedule | undefined {
    const normalizedType = vaccineType.toLowerCase();
    
    // Buscar coincidencia exacta o parcial
    for (const [key, schedule] of Object.entries(VACCINE_SCHEDULES)) {
      if (normalizedType.includes(key) || 
          schedule.vaccineType.toLowerCase().includes(normalizedType) ||
          normalizedType.includes(schedule.vaccineType.toLowerCase())) {
        return schedule;
      }
    }
    
    return undefined;
  }
  
  private static getAlertLevel(daysUntilDue: number): 'green' | 'yellow' | 'red' {
    if (daysUntilDue < 0) {
      return 'red'; // Vencida
    } else if (daysUntilDue <= 30) {
      return 'yellow'; // Próxima a vencer
    } else {
      return 'green'; // Vigente
    }
  }
  
  private static formatValidityPeriod(days: number): string {
    if (days === 365) {
      return '1 año';
    } else if (days === 730) {
      return '2 años';
    } else if (days === 1095) {
      return '3 años';
    } else if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (remainingDays === 0) {
        return `${years} año${years > 1 ? 's' : ''}`;
      } else {
        return `${years} año${years > 1 ? 's' : ''} y ${remainingDays} días`;
      }
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) {
        return `${months} mes${months > 1 ? 'es' : ''}`;
      } else {
        return `${months} mes${months > 1 ? 'es' : ''} y ${remainingDays} días`;
      }
    } else {
      return `${days} día${days > 1 ? 's' : ''}`;
    }
  }
  
  static getVaccineRecommendations(species: string, age?: number): string[] {
    const recommendations: string[] = [];
    
    if (species.toLowerCase().includes('perro') || species.toLowerCase().includes('canino')) {
      recommendations.push(
        'Quíntuple (Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis)',
        'Antirrábica',
        'Bordetella (Tos de las Perreras)'
      );
    } else if (species.toLowerCase().includes('gato') || species.toLowerCase().includes('felino')) {
      recommendations.push(
        'Triple Felina (Panleucopenia, Rinotraqueitis, Calicivirus)',
        'Antirrábica',
        'Leucemia Felina (FeLV)'
      );
    }
    
    return recommendations;
  }
  
  static getDewormingSchedule(): { internal: string, external: string } {
    return {
      internal: 'Cada 3-6 meses según riesgo',
      external: 'Mensual o según exposición a parásitos'
    };
  }
}