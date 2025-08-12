import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send, Phone } from "lucide-react";
import { WhatsAppService } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppNotificationProps {
  clientName?: string;
  clientPhone?: string;
  petName?: string;
}

export function WhatsAppNotification({ clientName = "", clientPhone = "", petName = "" }: WhatsAppNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName,
    clientPhone,
    petName,
    notificationType: "",
    customMessage: ""
  });
  const { toast } = useToast();

  const notificationTypes = [
    { value: "exam_reminder", label: "Recordatorio de Examen" },
    { value: "appointment_confirmation", label: "Confirmación de Cita" },
    { value: "results_ready", label: "Resultados Listos" },
    { value: "vaccination_reminder", label: "Recordatorio de Vacunación" },
    { value: "emergency_contact", label: "Contacto de Emergencia" },
    { value: "custom", label: "Mensaje Personalizado" }
  ];

  const handleSendNotification = () => {
    if (!formData.clientPhone) {
      toast({
        title: "Error",
        description: "Número de teléfono requerido",
        variant: "destructive"
      });
      return;
    }

    let message = "";
    const veterinarianName = "Dra. Alejandra Cautín Bastías";
    const clinicPhone = "+56 9 1234 5678";

    switch (formData.notificationType) {
      case "exam_reminder":
        message = WhatsAppService.sendExamReminder({
          clientName: formData.clientName,
          petName: formData.petName,
          examType: "Examen General",
          examDate: new Date().toLocaleDateString('es-CL'),
          instructions: "Ayuno de 12 horas. Traer carnet de vacunas.",
          veterinarianName,
          clinicPhone
        });
        break;
      
      case "appointment_confirmation":
        message = WhatsAppService.sendAppointmentConfirmation({
          clientName: formData.clientName,
          petName: formData.petName,
          appointmentDate: new Date().toLocaleDateString('es-CL'),
          appointmentTime: "15:00",
          service: "Consulta Veterinaria a Domicilio",
          address: "Su domicilio",
          veterinarianName,
          clinicPhone
        });
        break;
      
      case "results_ready":
        message = WhatsAppService.sendExamResultsReady(
          formData.clientName,
          formData.petName,
          "Examen General",
          veterinarianName,
          clinicPhone
        );
        break;
      
      case "vaccination_reminder":
        message = WhatsAppService.sendVaccinationReminder(
          formData.clientName,
          formData.petName,
          "Vacuna Anual",
          new Date().toLocaleDateString('es-CL'),
          veterinarianName,
          clinicPhone
        );
        break;
      
      case "emergency_contact":
        message = WhatsAppService.sendEmergencyContact(
          formData.clientName,
          formData.petName,
          "Consulta urgente",
          veterinarianName,
          clinicPhone
        );
        break;
      
      case "custom":
        message = formData.customMessage;
        break;
      
      default:
        toast({
          title: "Error",
          description: "Selecciona un tipo de notificación",
          variant: "destructive"
        });
        return;
    }

    if (message) {
      WhatsAppService.openWhatsApp(formData.clientPhone, message);
      toast({
        title: "WhatsApp abierto",
        description: "Se abrió WhatsApp con el mensaje preparado"
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4 text-green-600" />
          WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Enviar Notificación WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envía notificaciones automáticas a los clientes vía WhatsApp
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del Cliente</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="petName">Nombre de la Mascota</Label>
              <Input
                id="petName"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                placeholder="Bobby"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Número de Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+56 9 1234 5678"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationType">Tipo de Notificación</Label>
            <Select value={formData.notificationType} onValueChange={(value) => setFormData({ ...formData, notificationType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de notificación" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.notificationType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customMessage">Mensaje Personalizado</Label>
              <Textarea
                id="customMessage"
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                placeholder="Escribe tu mensaje personalizado aquí..."
                rows={4}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendNotification} className="gap-2 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}