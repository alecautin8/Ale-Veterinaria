export interface RutValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

export const formatRut = (rut: string): string => {
  // Remove all non-numeric characters except 'k' or 'K'
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  
  if (cleanRut.length < 2) return cleanRut;
  
  // Separate body and check digit
  const body = cleanRut.slice(0, -1);
  const checkDigit = cleanRut.slice(-1).toUpperCase();
  
  // Format body with dots
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${checkDigit}`;
};

export const validateRut = (rut: string): RutValidationResult => {
  try {
    // Clean the RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    
    if (cleanRut.length < 2) {
      return {
        isValid: false,
        formatted: rut,
        error: 'RUT debe tener al menos 2 caracteres'
      };
    }
    
    // Separate body and check digit
    const body = cleanRut.slice(0, -1);
    const checkDigit = cleanRut.slice(-1).toUpperCase();
    
    // Validate body is numeric
    if (!/^\d+$/.test(body)) {
      return {
        isValid: false,
        formatted: formatRut(rut),
        error: 'El cuerpo del RUT debe ser numérico'
      };
    }
    
    // Validate length
    if (body.length < 7 || body.length > 8) {
      return {
        isValid: false,
        formatted: formatRut(rut),
        error: 'RUT debe tener entre 7 y 8 dígitos más el dígito verificador'
      };
    }
    
    // Calculate check digit using module 11 algorithm
    const calculatedCheckDigit = calculateCheckDigit(body);
    
    if (checkDigit !== calculatedCheckDigit) {
      return {
        isValid: false,
        formatted: formatRut(rut),
        error: 'Dígito verificador inválido'
      };
    }
    
    return {
      isValid: true,
      formatted: formatRut(rut)
    };
    
  } catch (error) {
    return {
      isValid: false,
      formatted: rut,
      error: 'Error al validar RUT'
    };
  }
};

const calculateCheckDigit = (body: string): string => {
  let sum = 0;
  let multiplier = 2;
  
  // Calculate sum from right to left
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  
  if (checkDigit === 11) return '0';
  if (checkDigit === 10) return 'K';
  return checkDigit.toString();
};

export const isValidRut = (rut: string): boolean => {
  return validateRut(rut).isValid;
};

export const extractRutBody = (rut: string): string => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  return cleanRut.slice(0, -1);
};

export const extractCheckDigit = (rut: string): string => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  return cleanRut.slice(-1).toUpperCase();
};
