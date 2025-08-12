interface WhatsAppMessage {
  to: string;
  message: string;
}

interface ExamNotificationData {
  clientName: string;
  petName: string;
  examType: string;
  examDate: string;
  instructions: string;
  veterinarianName: string;
  clinicPhone: string;
}

interface AppointmentNotificationData {
  clientName: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  address: string;
  veterinarianName: string;
  clinicPhone: string;
}

export class WhatsAppService {
  private static formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters and ensure Chilean format
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 56 (Chile code), keep it
    if (cleaned.startsWith('56')) {
      return cleaned;
    }
    
    // If it starts with 9 (mobile), add Chile code
    if (cleaned.startsWith('9')) {
      return `56${cleaned}`;
    }
    
    // Otherwise, assume it needs Chile code
    return `56${cleaned}`;
  }

  static generateWhatsAppURL({ to, message }: WhatsAppMessage): string {
    const formattedPhone = this.formatPhoneNumber(to);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }

  static sendExamReminder(data: ExamNotificationData): string {
    const message = `🏥 *RECORDATORIO DE EXAMEN VETERINARIO*

Hola ${data.clientName}! 👋

Te recordamos que ${data.petName} tiene programado:
📋 *${data.examType}*
📅 *Fecha:* ${data.examDate}

📝 *INSTRUCCIONES IMPORTANTES:*
${data.instructions}

👩‍⚕️ *Veterinaria:* ${data.veterinarianName}
📞 *Consultas:* ${data.clinicPhone}

Por favor confirma tu asistencia respondiendo este mensaje.

_VetCare Chile - Cuidado veterinario a domicilio_ 🐾`;

    return message;
  }

  static sendAppointmentConfirmation(data: AppointmentNotificationData): string {
    const message = `✅ *CITA CONFIRMADA - VETCARE CHILE*

Hola ${data.clientName}! 

Tu cita veterinaria ha sido confirmada:

🐾 *Paciente:* ${data.petName}
🏥 *Servicio:* ${data.service}
📅 *Fecha:* ${data.appointmentDate}
🕐 *Hora:* ${data.appointmentTime}
📍 *Dirección:* ${data.address}

👩‍⚕️ *Veterinaria:* ${data.veterinarianName}
📞 *Contacto:* ${data.clinicPhone}

*IMPORTANTE:*
- La veterinaria llegará 15 min antes de la hora
- Ten listo el carnet de vacunas de tu mascota
- Prepara un espacio cómodo y bien iluminado

¿Necesitas cambiar la hora? Responde este mensaje.

_VetCare Chile - Tu veterinaria de confianza a domicilio_ 🏠🐾`;

    return message;
  }

  static sendExamResultsReady(clientName: string, petName: string, examType: string, veterinarianName: string, phone: string): string {
    const message = `📋 *RESULTADOS LISTOS - VETCARE CHILE*

Hola ${clientName}! 

Los resultados del examen de ${petName} ya están disponibles:

🔬 *Examen:* ${examType}
🐾 *Paciente:* ${petName}
👩‍⚕️ *Veterinaria:* ${veterinarianName}

Los resultados han sido enviados a tu correo electrónico y están disponibles en el portal de clientes.

📞 *Consultas:* ${phone}

_VetCare Chile - Resultados profesionales para el cuidado de tu mascota_ 🩺`;

    return message;
  }

  static sendVaccinationReminder(clientName: string, petName: string, vaccineType: string, dueDate: string, veterinarianName: string, phone: string): string {
    const message = `💉 *RECORDATORIO DE VACUNACIÓN*

Hola ${clientName}! 

Es hora de vacunar a ${petName}:

🐾 *Mascota:* ${petName}
💉 *Vacuna:* ${vaccineType}
📅 *Fecha recomendada:* ${dueDate}
👩‍⚕️ *Veterinaria:* ${veterinarianName}

Para agendar la vacunación a domicilio, responde este mensaje o llama al ${phone}.

*Beneficios del servicio a domicilio:*
- Sin estrés para tu mascota
- Comodidad de tu hogar
- Atención personalizada

_VetCare Chile - Vacunación segura en la comodidad de tu hogar_ 🏠💉`;

    return message;
  }

  static sendEmergencyContact(clientName: string, petName: string, issue: string, veterinarianName: string, phone: string): string {
    const message = `🚨 *CONTACTO DE EMERGENCIA - VETCARE*

${clientName}, hemos recibido tu consulta de emergencia.

🐾 *Paciente:* ${petName}
⚠️ *Motivo:* ${issue}
👩‍⚕️ *Veterinaria de guardia:* ${veterinarianName}

📞 *LLAMA INMEDIATAMENTE:* ${phone}

Mientras tanto:
- Mantén a tu mascota calmada
- No le des comida ni agua
- Observa síntomas y anótalos

La veterinaria te contactará en los próximos 15 minutos.

_VetCare Chile - Emergencias veterinarias 24/7_ 🏥`;

    return message;
  }

  // Method to open WhatsApp with pre-filled message
  static openWhatsApp(phoneNumber: string, message: string): void {
    const url = this.generateWhatsAppURL({ to: phoneNumber, message });
    window.open(url, '_blank');
  }
}

export default WhatsAppService;