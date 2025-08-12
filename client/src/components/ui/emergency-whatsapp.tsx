import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { WhatsAppService } from "@/lib/whatsapp";

interface EmergencyWhatsAppProps {
  veterinarianName?: string;
  veterinarianPhone?: string;
}

export function EmergencyWhatsApp({ 
  veterinarianName = "Dra. Alejandra Cautín Bastías",
  veterinarianPhone = "+56912345678"
}: EmergencyWhatsAppProps) {

  const handleEmergencyContact = () => {
    const emergencyMessage = WhatsAppService.sendEmergencyContact(
      "Propietario",
      "Mi mascota",
      "Emergencia veterinaria",
      veterinarianName,
      veterinarianPhone
    );

    WhatsAppService.openWhatsApp(veterinarianPhone, emergencyMessage);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleEmergencyContact}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full p-4 h-auto animate-pulse"
        size="lg"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full"></div>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold">EMERGENCIA</div>
            <div className="text-xs opacity-90">WhatsApp 24/7</div>
          </div>
        </div>
      </Button>
    </div>
  );
}