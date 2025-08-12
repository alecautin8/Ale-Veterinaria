import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { validateRut, formatRut } from '@/lib/rutValidator';
import { getVaccinesBySpecies, chileanVaccines } from '@/lib/vaccines';
import { veterinarianConfig } from '@/config/veterinarian';
import { getBreedsBySpecies } from '@/lib/breeds';
import { VaccineCalculator } from '@/lib/vaccineCalculator';
import { VeterinaryBMICalculator } from '@/lib/bmiCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WhatsAppNotification } from '@/components/ui/whatsapp-notification';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppService } from '@/lib/whatsapp';

const ProfessionalPortal = () => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  // Usar configuración profesional desde archivo separado
  const veterinarianInfo = veterinarianConfig;
  
  const [searchData, setSearchData] = useState({
    recordNumber: '',
    name: '',
    rut: ''
  });

  const [patientData, setPatientData] = useState({
    name: 'Max',
    species: 'Canino',
    breed: 'Yorkshire Terrier',
    weight: '3.5 kg',
    consultation: 'Control rutinario - paciente en excelente estado de salud.'
  });

  const [showPatientData, setShowPatientData] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  
  // Mock data for pets, medical records, and vaccinations
  const [pets] = useState([
    {
      id: '1',
      name: 'Max',
      species: 'Perro',
      breed: 'Yorkshire Terrier',
      sex: 'Macho',
      color: 'Marrón y negro',
      birthDate: '2020-05-15',
      microchipId: '9840000123456789',
      ownerId: '1'
    },
    {
      id: '2',
      name: 'Luna',
      species: 'Gato',
      breed: 'Persa',
      sex: 'Hembra',
      color: 'Blanco',
      birthDate: '2019-08-22',
      microchipId: '9840000987654321',
      ownerId: '2'
    }
  ]);

  const [medicalRecords] = useState([
    {
      id: '1',
      petId: '1',
      date: '2023-12-15',
      diagnosis: 'Control rutinario',
      treatment: 'Vacunación y desparasitación',
      notes: 'Paciente en excelente estado de salud',
      veterinarianId: '1'
    }
  ]);

  const [vaccinations] = useState([
    {
      id: '1',
      petId: '1',
      vaccine: 'Vanguard Plus 5 (Distemper, Adenovirus, Parvovirus, Parainfluenza)',
      date: '2023-12-15',
      nextDue: '2024-12-15',
      veterinarianId: '1',
      batchNumber: 'VAG123ABC',
      laboratory: 'Zoetis'
    },
    {
      id: '2',
      petId: '1',
      vaccine: 'Antirrábica',
      date: '2023-11-20',
      nextDue: '2024-11-20',
      veterinarianId: '1',
      batchNumber: 'RAB456DEF',
      laboratory: 'Zoetis'
    }
  ]);

  const [vaccineData, setVaccineData] = useState({
    vaccineId: 'zoetis-vanguard-plus5',
    laboratory: 'Zoetis',
    batch: 'VAG123ABC',
    date: new Date().toISOString().split('T')[0],
    pathogens: ['Distemper', 'Adenovirus tipo 1', 'Adenovirus tipo 2', 'Parainfluenza', 'Parvovirus'],
    validityDays: 365,
    vaccineType: 'viva modificada',
    serialNumber: '',
    applicationSite: 'Cuello (subcutáneo)',
    veterinarianNotes: ''
  });

  const [dewormingData, setDewormingData] = useState({
    type: 'internal',
    product: '',
    activeIngredient: '',
    laboratory: '',
    batch: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    notes: ''
  });

  const [petFormData, setPetFormData] = useState({
    name: '',
    species: '',
    breed: '',
    sex: '',
    color: '',
    birthDate: '',
    weight: '',
    microchipId: '',
    ownerName: '',
    ownerRUT: '',
    ownerPhone: '',
    ownerAddress: '',
    ownerEmail: '',
    bodyLength: '',
    chestCircumference: '',
    legLength: '',
    bcs: 5
  });

  const [bmiResult, setBmiResult] = useState(null);

  // Function to calculate BMI automatically
  const calculateBMI = (formData) => {
    console.log('calculateBMI called with:', formData);
    const weight = parseFloat(formData.weight);
    if (!weight || weight <= 0 || !formData.species) {
      setBmiResult(null);
      return;
    }

    const params = {
      species: formData.species,
      weight: weight,
      bodyLength: parseFloat(formData.bodyLength) || undefined,
      chestCircumference: parseFloat(formData.chestCircumference) || undefined,
      legLength: parseFloat(formData.legLength) || undefined,
      bcs: formData.bcs || 5
    };

    console.log('BMI params:', params);
    
    const validation = VeterinaryBMICalculator.validateParams(params);
    if (!validation.isValid) {
      console.warn('BMI calculation validation errors:', validation.errors);
      return;
    }

    const result = VeterinaryBMICalculator.calculateBMI(params);
    console.log('BMI result:', result);
    setBmiResult(result);
  };

  const [examData, setExamData] = useState({
    examType: '',
    urgency: 'normal',
    fastingRequired: false,
    instructions: '',
    observations: ''
  });

  // Mock data for demonstration
  const [patientHistory] = useState([
    {
      id: '001',
      date: '15/12/2023',
      type: 'Vacunación',
      vaccine: 'Vanguard Plus 5 - Zoetis',
      doctor: 'Dra. María González',
      notes: 'Vacuna aplicada sin complicaciones'
    },
    {
      id: '002', 
      date: '10/11/2023',
      type: 'Consulta',
      description: 'Control rutinario',
      doctor: 'Dra. María González',
      notes: 'Paciente en excelente estado'
    }
  ]);

  // Available exams with automatic instructions
  const availableExams = [
    {
      id: 'hemograma',
      name: 'Hemograma Completo',
      category: 'Hematología',
      defaultInstructions: `PREPARACIÓN PARA HEMOGRAMA COMPLETO:

• AYUNO: 12 horas mínimo
• HORARIO: No alimentar desde las 20:00 hrs del día anterior
• AGUA: Permitida hasta 2 horas antes del examen
• MEDICAMENTOS: Consultar si debe suspender algún medicamento
• EJERCICIO: Evitar ejercicio intenso 24 horas antes
• LLEGADA: Puntual a la hora agendada para evitar estrés

IMPORTANTE: Traer a la mascota tranquila y en ayunas completo.`,
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'bioquimica',
      name: 'Perfil Bioquímico Completo',
      category: 'Bioquímica',
      defaultInstructions: `PREPARACIÓN PARA PERFIL BIOQUÍMICO:

• AYUNO ESTRICTO: 12-14 horas
• HORARIO: No alimentar desde las 19:00 hrs del día anterior
• AGUA: Retirar 3 horas antes del examen
• MEDICAMENTOS: Suspender vitaminas y suplementos 24 hrs antes
• EJERCICIO: Reposo relativo 24 horas previas
• ESTRÉS: Mantener ambiente calmado antes del examen

INCLUYE: Función renal, hepática, glucosa, proteínas, electrolitos.`,
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'orina',
      name: 'Examen Completo de Orina',
      category: 'Urianálisis',
      defaultInstructions: `RECOLECCIÓN DE MUESTRA DE ORINA:

• RECOLECCIÓN: Primera orina de la mañana (más concentrada)
• CONTENEDOR: Frasco estéril (proporcionado por laboratorio)
• TIEMPO: Máximo 2 horas entre recolección y entrega
• CONSERVACIÓN: Mantener refrigerada (NO congelar)
• CANTIDAD: Mínimo 10ml para análisis completo
• HIGIENE: Limpiar área genital antes de recolectar

INCLUYE: Físico-químico, sedimento urinario, densidad.`,
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'coprologico',
      name: 'Examen Coprológico y Parasitológico',
      category: 'Parasitología',
      defaultInstructions: `RECOLECCIÓN DE MUESTRA FECAL:

• FRESCURA: Muestra de menos de 2 horas
• CANTIDAD: 2-3 cucharadas en frasco estéril
• MÚLTIPLES MUESTRAS: 3 días consecutivos (recomendado)
• CONSERVACIÓN: Temperatura ambiente, NO refrigerar
• EVITAR: Muestras del suelo o contaminadas
• MEDICAMENTOS: No desparasitar 7 días antes

DETECTA: Parásitos, huevos, larvas, protozoarios, sangre oculta.`,
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'radiografia',
      name: 'Radiografía Digital',
      category: 'Diagnóstico por Imagen',
      defaultInstructions: `PREPARACIÓN PARA RADIOGRAFÍA:

• AYUNO: 8-12 horas (según región a examinar)
• OBJETOS METÁLICOS: Retirar collar, tags, arnés
• SEDACIÓN: Evaluar necesidad según temperamento
• POSICIONAMIENTO: Requerirá quietud durante toma
• ÁREAS: Especificar región exacta a radiografiar
• ESTUDIOS PREVIOS: Traer radiografías anteriores si existen

APLICACIONES: Fracturas, displasia, cuerpos extraños, tórax, abdomen.`,
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'ecografia',
      name: 'Ecografía Abdominal Completa',
      category: 'Diagnóstico por Imagen',
      defaultInstructions: `PREPARACIÓN PARA ECOGRAFÍA ABDOMINAL:

• AYUNO: 12 horas estricto
• VEJIGA: Debe estar moderadamente llena
• RASURADO: Área abdominal completa (realizado en consulta)
• SEDACIÓN: Generalmente no necesaria
• TRANQUILIDAD: Mantener relajado durante procedimiento
• AGUA: 1-2 horas antes dar pequeña cantidad

EVALÚA: Hígado, riñones, vesícula, bazo, intestinos, vejiga, próstata/útero.`,
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'cultivo',
      name: 'Cultivo Bacteriológico',
      category: 'Microbiología',
      defaultInstructions: `TOMA DE MUESTRA PARA CULTIVO:

• ANTIBIÓTICOS: Suspender 48-72 horas antes (consultar veterinario)
• ASEPSIA: Toma de muestra con técnica estéril
• SITIOS: Especificar sitio exacto (oído, piel, orina, herida)
• TRANSPORTE: Medio de cultivo apropiado
• TIEMPO: Entregar inmediatamente al laboratorio
• IDENTIFICACIÓN: Clara identificación del sitio

INCLUYE: Identificación bacteriana, antibiograma, sensibilidad.`,
      fastingRequired: false,
      urgency: 'urgente'
    },
    {
      id: 'citologia',
      name: 'Citología',
      category: 'Patología',
      defaultInstructions: `PREPARACIÓN PARA CITOLOGÍA:

• LESIÓN: No limpiar ni medicar 24 horas antes
• ASPIRADO: Técnica de aspiración con aguja fina
• IMPRESIÓN: Múltiples impresiones en portaobjetos
• FIJACIÓN: Secado al aire, no fijar con alcohol
• SITIOS: Especificar ubicación exacta de lesión
• MÚLTIPLES: Varias muestras aumentan precisión

EVALÚA: Células inflamatorias, neoplásicas, infecciosas.`,
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'histopatologia',
      name: 'Histopatología',
      category: 'Patología',
      defaultInstructions: `TOMA DE BIOPSIA PARA HISTOPATOLOGÍA:

• TÉCNICA ASÉPTICA: Instrumental estéril para biopsia
• TAMAÑO: Muestra representativa del tejido
• FIJACIÓN: Inmediata en formalina tamponada 10%
• PROPORCIÓN: 1 parte tejido : 10 partes formalina
• IDENTIFICACIÓN: Clara ubicación anatómica
• REFRIGERACIÓN: NO congelar, temperatura ambiente

TIEMPO RESULTADO: 7-10 días hábiles. Diagnóstico histológico definitivo.`,
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'otros',
      name: 'Otros Exámenes',
      category: 'Varios',
      defaultInstructions: `EXÁMENES ESPECIALIZADOS:

• ESPECIFICAR: Tipo de examen exacto solicitado
• PREPARACIÓN: Según indicaciones específicas del examen
• LABORATORIO: Confirmar disponibilidad en laboratorio
• TIEMPO: Consultar tiempo de entrega de resultados
• COSTO: Confirmar valor antes de realizar
• MUESTRA: Seguir protocolo específico de recolección

EJEMPLOS: Hormonas tiroideas, cortisol, progesterona, pruebas alérgicas.`,
      fastingRequired: false,
      urgency: 'normal'
    }
  ];

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const handleSearch = () => {
    // Validate RUT if provided
    if (searchData.rut) {
      const rutValidation = validateRut(searchData.rut);
      if (!rutValidation.isValid) {
        toast({
          title: "RUT inválido",
          description: rutValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    // Here you would implement the actual search logic with Firebase
    toast({
      title: "Búsqueda realizada",
      description: "Funcionalidad de búsqueda implementada con Firebase",
    });
  };

  const handleVaccineSelect = (vaccineId: string) => {
    const vaccine = chileanVaccines.find(v => v.id === vaccineId);
    if (vaccine) {
      setVaccineData({
        ...vaccineData,
        vaccineId,
        laboratory: vaccine.laboratory,
        pathogens: vaccine.pathogens
      });
    }
  };

  const handleRutInput = (value: string) => {
    const formatted = formatRut(value);
    setSearchData({ ...searchData, rut: formatted });
  };

  const handleExamSelect = (examId: string) => {
    const exam = availableExams.find(e => e.id === examId);
    if (exam) {
      setExamData({
        ...examData,
        examType: examId,
        fastingRequired: exam.fastingRequired,
        instructions: exam.defaultInstructions,
        urgency: exam.urgency
      });
    }
  };

  const generateExamOrder = () => {
    const exam = availableExams.find(e => e.id === examData.examType);
    if (!exam) {
      toast({
        title: "Error",
        description: "Selecciona un tipo de examen",
        variant: "destructive"
      });
      return;
    }

    const orderNumber = `ORD-${Date.now()}`;
    
    // Here you would implement PDF generation with html2pdf
    toast({
      title: "Orden de examen generada",
      description: `Orden ${orderNumber} para ${exam.name} generándose con html2pdf`,
    });

    // Reset form
    setExamData({
      examType: '',
      urgency: 'normal',
      fastingRequired: false,
      instructions: '',
      observations: ''
    });
  };

  const sendExamInstructionsWhatsApp = (petName: string, clientPhone: string) => {
    const exam = availableExams.find(e => e.id === examData.examType);
    if (!exam) return;

    const message = WhatsAppService.sendExamReminder({
      clientName: "Cliente",
      petName: petName,
      examType: exam.name,
      examDate: "Próximamente",
      instructions: exam.defaultInstructions,
      veterinarianName: veterinarianInfo.name,
      clinicPhone: veterinarianInfo.phone
    });

    WhatsAppService.openWhatsApp(clientPhone, message);
    
    toast({
      title: "WhatsApp abierto",
      description: "Se enviarán las instrucciones del examen al cliente"
    });
  };

  const generateCertificate = async (type: string) => {
    if (type === 'exportación') {
      await generateSAGExportCertificate();
    } else {
      // Otros tipos de certificados
      toast({
        title: "Generando certificado",
        description: `Certificado de ${type} generándose con html2pdf`,
      });
    }
  };

  const generateSAGExportCertificate = async () => {
    if (!selectedPet) {
      toast({
        title: "Error",
        description: "Selecciona una mascota para generar el certificado",
        variant: "destructive"
      });
      return;
    }

    try {
      // Importar dinámicamente el servicio SAG
      const { SAGCertificateService } = await import('@/lib/sagCertificate');
      
      // Obtener datos de la mascota seleccionada
      const petData = pets.find(p => p.id === selectedPet);
      if (!petData) {
        throw new Error("No se encontraron datos de la mascota");
      }

      // Obtener registros médicos y vacunas de la mascota
      const petMedicalRecords = medicalRecords.filter(record => record.petId === selectedPet);
      const petVaccinations = vaccinations.filter(vaccination => vaccination.petId === selectedPet);

      // Datos simulados del dueño (en una app real esto vendría de la base de datos)
      const ownerData = {
        name: "Juan Pérez González",
        rut: "12.345.678-9",
        phone: "+56 9 8765 4321",
        address: "Av. Las Condes 1234, Las Condes, Santiago"
      };

      // Generar datos del certificado SAG
      const certificateData = SAGCertificateService.generateCertificateData(
        petData,
        ownerData,
        petMedicalRecords,
        petVaccinations
      );

      // Generar HTML del certificado
      const certificateHTML = SAGCertificateService.generateHTMLCertificate(certificateData);

      // Crear una nueva ventana para mostrar el certificado
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(certificateHTML);
        printWindow.document.close();
        
        // Esperar a que cargue e imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        };
      }

      toast({
        title: "Certificado SAG generado",
        description: "Certificado de exportación oficial generado correctamente",
      });

    } catch (error) {
      console.error('Error generando certificado SAG:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el certificado de exportación",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmbeige flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-mint mb-4"></i>
          <p className="text-darkgray font-poppins">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmbeige pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-darkgray mb-2">Portal Profesional</h1>
              <p className="text-gray-600 font-lato">Gestión de fichas clínicas y certificados - {veterinarianInfo.name}</p>
              <p className="text-sm text-gray-500 font-lato">{veterinarianInfo.title} • {veterinarianInfo.speciality} • {veterinarianInfo.license}</p>
            </div>
            <Button onClick={() => setLocation('/')} variant="outline">
              <i className="fas fa-home mr-2"></i>
              Volver al Inicio
            </Button>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-mint to-turquoise text-white">
              <CardContent className="p-6 text-center">
                <i className="fas fa-paw text-3xl mb-3"></i>
                <div className="text-2xl font-poppins font-bold">24</div>
                <div className="text-sm opacity-90">Pacientes Activos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-lavender to-palerose text-darkgray">
              <CardContent className="p-6 text-center">
                <i className="fas fa-syringe text-3xl mb-3"></i>
                <div className="text-2xl font-poppins font-bold">8</div>
                <div className="text-sm opacity-70">Vacunas Hoy</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-turquoise to-mint text-white">
              <CardContent className="p-6 text-center">
                <i className="fas fa-certificate text-3xl mb-3"></i>
                <div className="text-2xl font-poppins font-bold">12</div>
                <div className="text-sm opacity-90">Certificados Mes</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-palerose to-lavender text-darkgray">
              <CardContent className="p-6 text-center">
                <i className="fas fa-calendar-check text-3xl mb-3"></i>
                <div className="text-2xl font-poppins font-bold">5</div>
                <div className="text-sm opacity-70">Citas Pendientes</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'dashboard' 
                    ? 'border-mint text-mint' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'patients' 
                    ? 'border-mint text-mint' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-paw mr-2"></i>
                Pacientes
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'exams' 
                    ? 'border-mint text-mint' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-flask mr-2"></i>
                Solicitar Exámenes
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'certificates' 
                    ? 'border-mint text-mint' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-certificate mr-2"></i>
                Certificados
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'profile' 
                    ? 'border-mint text-mint' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-user-md mr-2"></i>
                Mi Perfil
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Search Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-poppins">Buscar Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="recordNumber">Número de ficha</Label>
                <Input
                  id="recordNumber"
                  value={searchData.recordNumber}
                  onChange={(e) => setSearchData({ ...searchData, recordNumber: e.target.value })}
                  placeholder="12345"
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre (sin tildes)</Label>
                <Input
                  id="name"
                  value={searchData.name}
                  onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
                  placeholder="max"
                />
              </div>
              <div>
                <Label htmlFor="rut">RUT del tutor</Label>
                <Input
                  id="rut"
                  value={searchData.rut}
                  onChange={(e) => handleRutInput(e.target.value)}
                  placeholder="12345678-9"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-mint text-darkgray hover:bg-mint/80">
              <i className="fas fa-search mr-2"></i>
              Buscar
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Pet Information Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center">
              <i className="fas fa-paw text-mint mr-2"></i>
              Información Completa del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="petName">Nombre de la Mascota</Label>
                <Input
                  id="petName"
                  value={petFormData.name}
                  onChange={(e) => setPetFormData({...petFormData, name: e.target.value})}
                  placeholder="Nombre de la mascota"
                />
              </div>
              <div>
                <Label htmlFor="species">Especie</Label>
                <Select value={petFormData.species} onValueChange={(value) => {
                  setPetFormData({...petFormData, species: value, breed: ''});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perro">Perro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Hurón">Hurón</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="breed">Raza</Label>
                <Select 
                  value={petFormData.breed} 
                  onValueChange={(value) => setPetFormData({...petFormData, breed: value})}
                  disabled={!petFormData.species}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={petFormData.species ? "Selecciona raza" : "Primero selecciona especie"} />
                  </SelectTrigger>
                  <SelectContent>
                    {petFormData.species && getBreedsBySpecies(petFormData.species).map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sex">Sexo</Label>
                <Select value={petFormData.sex} onValueChange={(value) => setPetFormData({...petFormData, sex: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                    <SelectItem value="Macho Castrado">Macho Castrado</SelectItem>
                    <SelectItem value="Hembra Esterilizada">Hembra Esterilizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={petFormData.color}
                  onChange={(e) => setPetFormData({...petFormData, color: e.target.value})}
                  placeholder="Color del pelaje"
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={petFormData.birthDate}
                  onChange={(e) => setPetFormData({...petFormData, birthDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  value={petFormData.weight}
                  onChange={(e) => {
                    const updatedData = {...petFormData, weight: e.target.value};
                    setPetFormData(updatedData);
                    calculateBMI(updatedData);
                  }}
                  placeholder="3.5"
                  type="number"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="microchip">Microchip (Opcional)</Label>
                <Input
                  id="microchip"
                  value={petFormData.microchipId}
                  onChange={(e) => setPetFormData({...petFormData, microchipId: e.target.value})}
                  placeholder="9840000123456789"
                />
              </div>
            </div>

            {/* BMI and BCS Calculation Section */}
            <div className="mt-6">
              <h4 className="font-poppins font-semibold text-darkgray mb-4">Evaluación Corporal y Nutricional</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bcs">BCS (Body Condition Score) 1-9</Label>
                  <Select value={petFormData.bcs.toString()} onValueChange={(value) => {
                    const newBcs = parseInt(value);
                    const updatedData = {...petFormData, bcs: newBcs};
                    setPetFormData(updatedData);
                    calculateBMI(updatedData);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona BCS" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9].map(score => (
                        <SelectItem key={score} value={score.toString()}>
                          BCS {score} - {score <= 3 ? 'Bajo peso' : score <= 6 ? 'Normal' : 'Sobrepeso'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {petFormData.species === 'Perro' && (
                  <>
                    <div>
                      <Label htmlFor="chestCircumference">Circunferencia Torácica (cm)</Label>
                      <Input
                        id="chestCircumference"
                        value={petFormData.chestCircumference}
                        onChange={(e) => {
                          const updatedData = {...petFormData, chestCircumference: e.target.value};
                          setPetFormData(updatedData);
                          calculateBMI(updatedData);
                        }}
                        placeholder="65"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legLength">Longitud Pata Trasera (cm)</Label>
                      <Input
                        id="legLength"
                        value={petFormData.legLength}
                        onChange={(e) => {
                          const updatedData = {...petFormData, legLength: e.target.value};
                          setPetFormData(updatedData);
                          calculateBMI(updatedData);
                        }}
                        placeholder="30"
                        type="number"
                      />
                    </div>
                  </>
                )}
                
                {petFormData.species === 'Gato' && (
                  <>
                    <div>
                      <Label htmlFor="chestCircumference">Circunferencia Torácica (cm)</Label>
                      <Input
                        id="chestCircumference"
                        value={petFormData.chestCircumference}
                        onChange={(e) => {
                          const updatedData = {...petFormData, chestCircumference: e.target.value};
                          setPetFormData(updatedData);
                          calculateBMI(updatedData);
                        }}
                        placeholder="35"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legLength">Longitud Tibia (cm)</Label>
                      <Input
                        id="legLength"
                        value={petFormData.legLength}
                        onChange={(e) => {
                          const updatedData = {...petFormData, legLength: e.target.value};
                          setPetFormData(updatedData);
                          calculateBMI(updatedData);
                        }}
                        placeholder="12"
                        type="number"
                      />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                        Circunferencia: detrás de patas delanteras, nivel esternón
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-info-circle text-green-500 mr-1"></i>
                        Tibia: punto medio rótula a maléolo lateral tobillo
                      </div>
                    </div>
                  </>
                )}
                
                {petFormData.species === 'Perro' && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                      Circunferencia: detrás de patas delanteras, nivel esternón
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-info-circle text-green-500 mr-1"></i>
                      Pata trasera: trocánter mayor a maléolo lateral del tarso
                    </div>
                  </div>
                )}
              </div>

              {/* BMI Results Display */}
              {bmiResult && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <h5 className="font-poppins font-semibold text-darkgray mb-3">
                    Evaluación Nutricional Automática
                  </h5>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {bmiResult.bmi && (
                        <div className="bg-white p-3 rounded">
                          <Label className="font-medium text-blue-800">IMC Canino:</Label>
                          <p className="text-lg font-bold text-blue-600">{bmiResult.bmi.toFixed(1)}</p>
                        </div>
                      )}
                      
                      {bmiResult.fbmi && (
                        <div className="bg-white p-3 rounded">
                          <Label className="font-medium text-green-800">FBMI Felino:</Label>
                          <p className="text-lg font-bold text-green-600">{bmiResult.fbmi.toFixed(1)}</p>
                        </div>
                      )}
                      
                      <div className="bg-white p-3 rounded">
                        <Label className="font-medium text-purple-800">Clasificación:</Label>
                        <p className={`font-semibold ${
                          bmiResult.classification.includes('ideal') ? 'text-green-600' :
                          bmiResult.classification.includes('sobrepeso') ? 'text-yellow-600' :
                          bmiResult.classification.includes('obesidad') ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {bmiResult.classification}
                        </p>
                      </div>
                      
                      {bmiResult.idealWeightRange && (
                        <div className="bg-white p-3 rounded">
                          <Label className="font-medium text-indigo-800">Peso Ideal:</Label>
                          <p className="font-semibold text-indigo-600">{bmiResult.idealWeightRange}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded">
                        <Label className="font-medium text-gray-800">BCS Interpretación:</Label>
                        <p className="text-sm text-gray-600">{bmiResult.bcsInterpretation}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <Label className="font-medium text-orange-800">Recomendación:</Label>
                        <p className="text-sm text-orange-600">{bmiResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                  

                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-poppins font-semibold text-darkgray mb-4">Información del Tutor</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Nombre Completo del Tutor</Label>
                  <Input
                    id="ownerName"
                    value={petFormData.ownerName}
                    onChange={(e) => setPetFormData({...petFormData, ownerName: e.target.value})}
                    placeholder="Juan Pérez González"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerRUT">RUT del Tutor</Label>
                  <Input
                    id="ownerRUT"
                    value={petFormData.ownerRUT}
                    onChange={(e) => setPetFormData({...petFormData, ownerRUT: formatRut(e.target.value)})}
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Teléfono</Label>
                  <Input
                    id="ownerPhone"
                    value={petFormData.ownerPhone}
                    onChange={(e) => setPetFormData({...petFormData, ownerPhone: e.target.value})}
                    placeholder="+56 9 8765 4321"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerEmail">Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={petFormData.ownerEmail}
                    onChange={(e) => setPetFormData({...petFormData, ownerEmail: e.target.value})}
                    placeholder="juan@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ownerAddress">Dirección Completa</Label>
                  <Input
                    id="ownerAddress"
                    value={petFormData.ownerAddress}
                    onChange={(e) => setPetFormData({...petFormData, ownerAddress: e.target.value})}
                    placeholder="Av. Las Condes 1234, Las Condes, Santiago"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Vaccination and Deworming Forms */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins flex items-center">
                <i className="fas fa-syringe text-lavender mr-2"></i>
                Registro de Vacunación Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vaccine">Vacuna</Label>
                <Select value={vaccineData.vaccineId} onValueChange={(value) => {
                  const selectedVaccine = chileanVaccines.find(v => v.id === value);
                  if (selectedVaccine) {
                    setVaccineData({
                      ...vaccineData,
                      vaccineId: value,
                      laboratory: selectedVaccine.laboratory,
                      pathogens: selectedVaccine.pathogens
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una vacuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {chileanVaccines.map((vaccine) => (
                      <SelectItem key={vaccine.id} value={vaccine.id}>
                        {vaccine.name} - {vaccine.laboratory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="laboratory">Laboratorio</Label>
                  <Input
                    id="laboratory"
                    value={vaccineData.laboratory}
                    onChange={(e) => setVaccineData({ ...vaccineData, laboratory: e.target.value })}
                    placeholder="Laboratorio"
                  />
                </div>
                <div>
                  <Label htmlFor="vaccineDate">Fecha de Aplicación</Label>
                  <Input
                    id="vaccineDate"
                    type="date"
                    value={vaccineData.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setVaccineData({ 
                        ...vaccineData, 
                        date: newDate
                      });
                    }}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batch">Lote</Label>
                  <Input
                    id="batch"
                    value={vaccineData.batch}
                    onChange={(e) => setVaccineData({ ...vaccineData, batch: e.target.value })}
                    placeholder="A1B2C3"
                  />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Número de Serie</Label>
                  <Input
                    id="serialNumber"
                    value={vaccineData.serialNumber}
                    onChange={(e) => setVaccineData({ ...vaccineData, serialNumber: e.target.value })}
                    placeholder="Número de serie"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vaccineType">Tipo de Vacuna</Label>
                  <Select value={vaccineData.vaccineType} onValueChange={(value) => setVaccineData({...vaccineData, vaccineType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de vacuna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viva modificada">Vacuna viva modificada</SelectItem>
                      <SelectItem value="inactivada">Vacuna inactivada</SelectItem>
                      <SelectItem value="mixta">Vacuna mixta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="validityDays">Vigencia (días)</Label>
                  <Input
                    id="validityDays"
                    type="number"
                    value={vaccineData.validityDays}
                    onChange={(e) => setVaccineData({ ...vaccineData, validityDays: parseInt(e.target.value) || 365 })}
                    placeholder="365"
                  />
                </div>
              </div>
              {vaccineData.date && vaccineData.validityDays && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Label className="font-medium text-blue-800">Próxima Vacunación:</Label>
                  <p className="text-blue-600">
                    {VaccineCalculator.calculateNextVaccination({
                      vaccinationDate: vaccineData.date,
                      customDuration: vaccineData.validityDays
                    }).nextDueDate}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="applicationSite">Sitio de Aplicación</Label>
                <Input
                  id="applicationSite"
                  value={vaccineData.applicationSite}
                  onChange={(e) => setVaccineData({ ...vaccineData, applicationSite: e.target.value })}
                  placeholder="Cuello (subcutáneo)"
                />
              </div>
              {vaccineData.pathogens.length > 0 && (
                <div>
                  <Label>Patógenos cubiertos</Label>
                  <div className="mt-2 text-sm text-gray-600">
                    {vaccineData.pathogens.join(', ')}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="vetNotes">Notas del Veterinario</Label>
                <Textarea
                  id="vetNotes"
                  value={vaccineData.veterinarianNotes}
                  onChange={(e) => setVaccineData({ ...vaccineData, veterinarianNotes: e.target.value })}
                  placeholder="Observaciones sobre la vacunación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-poppins flex items-center">
                <i className="fas fa-bug text-turquoise mr-2"></i>
                Registro de Desparasitación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dewormingType">Tipo de Desparasitación</Label>
                <Select value={dewormingData.type} onValueChange={(value) => setDewormingData({...dewormingData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Desparasitación Interna</SelectItem>
                    <SelectItem value="external">Desparasitación Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dewormingProduct">Producto</Label>
                  <Input
                    id="dewormingProduct"
                    value={dewormingData.product}
                    onChange={(e) => setDewormingData({...dewormingData, product: e.target.value})}
                    placeholder="Drontal Plus / Frontline Plus"
                  />
                </div>
                <div>
                  <Label htmlFor="dewormingLab">Laboratorio</Label>
                  <Input
                    id="dewormingLab"
                    value={dewormingData.laboratory}
                    onChange={(e) => setDewormingData({...dewormingData, laboratory: e.target.value})}
                    placeholder="Bayer / Boehringer Ingelheim"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="activeIngredient">Principio Activo</Label>
                <Input
                  id="activeIngredient"
                  value={dewormingData.activeIngredient}
                  onChange={(e) => setDewormingData({...dewormingData, activeIngredient: e.target.value})}
                  placeholder="Praziquantel + Pirantel + Febantel"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dewormingBatch">Lote</Label>
                  <Input
                    id="dewormingBatch"
                    value={dewormingData.batch}
                    onChange={(e) => setDewormingData({...dewormingData, batch: e.target.value})}
                    placeholder="DP789XYZ"
                  />
                </div>
                <div>
                  <Label htmlFor="dewormingDate">Fecha</Label>
                  <Input
                    id="dewormingDate"
                    type="date"
                    value={dewormingData.date}
                    onChange={(e) => setDewormingData({...dewormingData, date: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dewormingTime">Hora de Aplicación</Label>
                <Input
                  id="dewormingTime"
                  type="time"
                  value={dewormingData.time}
                  onChange={(e) => setDewormingData({...dewormingData, time: e.target.value})}
                />
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Label className="font-medium text-green-800">Próxima Desparasitación:</Label>
                <p className="text-green-600 text-sm">
                  {dewormingData.type === 'internal' ? 'Interna: Cada 3-6 meses' : 'Externa: Mensual o según exposición'}
                </p>
              </div>
              <div>
                <Label htmlFor="dewormingNotes">Notas</Label>
                <Textarea
                  id="dewormingNotes"
                  value={dewormingData.notes}
                  onChange={(e) => setDewormingData({...dewormingData, notes: e.target.value})}
                  placeholder="Observaciones sobre la desparasitación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient History */}
        {showPatientData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-history text-mint mr-2"></i>
                  Historial Médico - {patientData.name}
                </div>
                <div className="flex items-center gap-2">
                  <WhatsAppNotification 
                    clientName="Juan Pérez"
                    clientPhone="+56912345678"
                    petName={patientData.name}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientHistory.map((record) => (
                  <div key={record.id} className="border-l-4 border-mint pl-4 py-3 bg-white/50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-poppins font-medium text-darkgray flex items-center">
                          <i className={`${record.type === 'Vacunación' ? 'fas fa-syringe text-lavender' : 'fas fa-stethoscope text-turquoise'} mr-2`}></i>
                          {record.type}
                        </h4>
                        <p className="text-gray-600 font-lato">
                          {record.vaccine || record.description}
                        </p>
                        <p className="text-sm text-gray-500 font-lato">{record.date} - {record.doctor}</p>
                        <p className="text-sm text-gray-600 font-lato italic">{record.notes}</p>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-palerose text-darkgray hover:bg-palerose/80"
                      >
                        <i className="fas fa-download mr-1"></i>
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Generation Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center">
              <i className="fas fa-file-pdf text-turquoise mr-2"></i>
              Generar Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pet Selection for Certificate Generation */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="petSelect" className="font-poppins font-medium">Seleccionar Mascota para Certificados</Label>
              <Select value={selectedPet || ''} onValueChange={setSelectedPet}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona una mascota..." />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} - {pet.species} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPet && (
                <div className="mt-2 text-sm text-gray-600">
                  <i className="fas fa-check-circle text-green-600 mr-1"></i>
                  Mascota seleccionada: {pets.find(p => p.id === selectedPet)?.name}
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={() => generateCertificate('salud')}
                className="bg-mint text-darkgray hover:bg-mint/80 p-6 h-auto flex flex-col items-center space-y-2"
              >
                <i className="fas fa-certificate text-3xl"></i>
                <div>
                  <div className="font-semibold">Certificado de Salud</div>
                  <div className="text-sm opacity-80">Para consultas veterinarias</div>
                </div>
              </Button>
              <Button 
                onClick={() => generateCertificate('exportación')}
                className="bg-lavender text-darkgray hover:bg-lavender/80 p-6 h-auto flex flex-col items-center space-y-2"
                disabled={!selectedPet}
              >
                <i className="fas fa-plane text-3xl"></i>
                <div>
                  <div className="font-semibold">Certificado SAG de Exportación</div>
                  <div className="text-sm opacity-80">Formato oficial - Llenado automático</div>
                  {!selectedPet && <div className="text-xs text-red-600 mt-1">Selecciona una mascota</div>}
                </div>
              </Button>
              <Button 
                onClick={() => generateCertificate('receta')}
                className="bg-turquoise text-darkgray hover:bg-turquoise/80 p-6 h-auto flex flex-col items-center space-y-2"
              >
                <i className="fas fa-prescription text-3xl"></i>
                <div>
                  <div className="font-semibold">Receta Médica</div>
                  <div className="text-sm opacity-80">Prescripciones y tratamientos</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins flex items-center">
              <i className="fas fa-bolt text-palerose mr-2"></i>
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <i className="fas fa-plus-circle text-mint text-2xl"></i>
                <span className="text-sm">Nueva Consulta</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <i className="fas fa-syringe text-lavender text-2xl"></i>
                <span className="text-sm">Registrar Vacuna</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <i className="fas fa-pills text-turquoise text-2xl"></i>
                <span className="text-sm">Desparasitación</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
                <i className="fas fa-camera text-palerose text-2xl"></i>
                <span className="text-sm">Subir Imagen</span>
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>
        )}

        {/* Exam Request Tab */}
        {activeTab === 'exams' && (
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center">
                  <i className="fas fa-flask text-mint mr-2"></i>
                  Solicitar Exámenes de Laboratorio
                </CardTitle>
                <p className="text-gray-600 font-lato">Genera automáticamente órdenes médicas con indicaciones para el tutor</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <Label className="text-base font-semibold">Información del Paciente</Label>
                  <div className="grid md:grid-cols-3 gap-4 mt-2 p-4 bg-mint/5 rounded-lg">
                    <div>
                      <Label htmlFor="patientName">Nombre de la mascota</Label>
                      <Input
                        id="patientName"
                        placeholder="Max"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutorName">Nombre del tutor</Label>
                      <Input
                        id="tutorName"
                        placeholder="Juan Pérez"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutorPhone">Teléfono</Label>
                      <Input
                        id="tutorPhone"
                        placeholder="+56 9 1234 5678"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Exam Selection */}
                <div>
                  <Label className="text-base font-semibold">Tipo de Examen</Label>
                  <Select onValueChange={handleExamSelect}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Seleccionar tipo de examen" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{exam.name}</span>
                            <span className="text-sm text-gray-500">{exam.category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Exam Details */}
                {examData.examType && (
                  <div className="p-4 bg-lavender/10 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-darkgray">
                        {availableExams.find(e => e.id === examData.examType)?.name}
                      </h4>
                      {examData.fastingRequired && (
                        <div className="flex items-center space-x-2 text-orange-600">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span className="text-sm font-medium">Requiere ayuno</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="urgency">Urgencia</Label>
                        <Select 
                          value={examData.urgency}
                          onValueChange={(value) => setExamData({ ...examData, urgency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal (2-3 días)</SelectItem>
                            <SelectItem value="urgente">Urgente (24 horas)</SelectItem>
                            <SelectItem value="emergencia">Emergencia (inmediato)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="fasting"
                          checked={examData.fastingRequired}
                          onChange={(e) => setExamData({ ...examData, fastingRequired: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="fasting">Requiere ayuno</Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <Label htmlFor="instructions" className="text-base font-semibold">
                    Instrucciones para el Tutor
                  </Label>
                  <textarea
                    id="instructions"
                    value={examData.instructions}
                    onChange={(e) => setExamData({ ...examData, instructions: e.target.value })}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg h-24 resize-none"
                    placeholder="Las instrucciones se generan automáticamente según el tipo de examen..."
                  />
                </div>

                {/* Observations */}
                <div>
                  <Label htmlFor="observations">Observaciones Médicas (Opcional)</Label>
                  <textarea
                    id="observations"
                    value={examData.observations}
                    onChange={(e) => setExamData({ ...examData, observations: e.target.value })}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg h-20 resize-none"
                    placeholder="Información adicional sobre el paciente o el examen solicitado..."
                  />
                </div>

                {/* Generate Button */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setExamData({
                      examType: '',
                      urgency: 'normal',
                      fastingRequired: false,
                      instructions: '',
                      observations: ''
                    })}
                  >
                    Limpiar Formulario
                  </Button>
                  <WhatsAppNotification 
                    clientName="Juan Pérez"
                    clientPhone="+56912345678"
                    petName="Max"
                  />
                  <Button
                    onClick={generateExamOrder}
                    className="bg-mint text-darkgray hover:bg-mint/80"
                    disabled={!examData.examType}
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    Generar Orden de Examen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins flex items-center">
                  <i className="fas fa-file-contract text-turquoise mr-2"></i>
                  Órdenes Generadas Recientemente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">ORD-2023120801 - Hemograma Completo</span>
                      <p className="text-sm text-gray-600">Max (Canino) - Juan Pérez - 15/12/2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <WhatsAppNotification 
                        clientName="Juan Pérez"
                        clientPhone="+56912345678"
                        petName="Max"
                      />
                      <Button variant="outline" size="sm">
                        <i className="fas fa-download mr-1"></i>
                        Descargar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">ORD-2023120702 - Perfil Bioquímico</span>
                      <p className="text-sm text-gray-600">Luna (Felino) - María Silva - 14/12/2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <WhatsAppNotification 
                        clientName="María Silva"
                        clientPhone="+56987654321"
                        petName="Luna"
                      />
                      <Button variant="outline" size="sm">
                        <i className="fas fa-download mr-1"></i>
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center">
                  <i className="fas fa-user-md text-mint mr-2"></i>
                  Mi Información Profesional
                </CardTitle>
                <p className="text-gray-600 font-lato">Personaliza tu información para que aparezca en certificados y documentos</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="vetName" className="text-base font-semibold">Nombre Completo</Label>
                    <Input
                      id="vetName"
                      defaultValue={veterinarianInfo.name}
                      placeholder="Dr./Dra. Tu Nombre"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vetTitle" className="text-base font-semibold">Título Profesional</Label>
                    <Input
                      id="vetTitle"
                      defaultValue={veterinarianInfo.title}
                      placeholder="Médico Veterinario"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vetSpeciality" className="text-base font-semibold">Especialidad</Label>
                    <Input
                      id="vetSpeciality"
                      defaultValue={veterinarianInfo.speciality}
                      placeholder="Medicina Interna, Cirugía, etc."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vetLicense" className="text-base font-semibold">Número de Colegiatura</Label>
                    <Input
                      id="vetLicense"
                      defaultValue={veterinarianInfo.license}
                      placeholder="MV 12345"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vetPhone" className="text-base font-semibold">Teléfono</Label>
                    <Input
                      id="vetPhone"
                      defaultValue={veterinarianInfo.phone}
                      placeholder="+56 9 1234 5678"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vetEmail" className="text-base font-semibold">Email</Label>
                    <Input
                      id="vetEmail"
                      defaultValue={veterinarianInfo.email}
                      placeholder="tu@email.cl"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clinicName" className="text-base font-semibold">Nombre de la Clínica</Label>
                    <Input
                      id="clinicName"
                      defaultValue={veterinarianInfo.clinicName}
                      placeholder="Nombre de tu clínica"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clinicAddress" className="text-base font-semibold">Dirección</Label>
                    <Input
                      id="clinicAddress"
                      defaultValue={veterinarianInfo.address}
                      placeholder="Comuna, Ciudad"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-darkgray mb-1">Actualizar Información</h4>
                      <p className="text-sm text-gray-600">Los cambios se aplicarán a todos los documentos generados</p>
                    </div>
                    <Button className="bg-mint text-darkgray hover:bg-mint/80">
                      <i className="fas fa-save mr-2"></i>
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins flex items-center">
                  <i className="fas fa-info-circle text-turquoise mr-2"></i>
                  Cómo Personalizar tu Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-mint/10 rounded-lg">
                    <h4 className="font-semibold text-darkgray mb-2">
                      <i className="fas fa-edit mr-2"></i>
                      Opción 1: Editar directamente en el código
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Para cambios permanentes, edita el archivo <code className="bg-gray-200 px-1 rounded">client/src/config/veterinarian.ts</code>
                    </p>
                    <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono">
                      <div>// CONFIGURACIÓN PROFESIONAL</div>
                      <div>export const veterinarianConfig = {'{'}...</div>
                      <div>&nbsp;&nbsp;name: 'Tu Nombre Aquí',</div>
                      <div>&nbsp;&nbsp;title: 'Tu Título Profesional',</div>
                      <div>&nbsp;&nbsp;speciality: 'Tu Especialidad',</div>
                      <div>&nbsp;&nbsp;license: 'Tu Número de Colegiatura',</div>
                      <div>&nbsp;&nbsp;phone: 'Tu Teléfono',</div>
                      <div>&nbsp;&nbsp;email: 'Tu Email',</div>
                      <div>&nbsp;&nbsp;clinicName: 'Nombre de tu Clínica',</div>
                      <div>&nbsp;&nbsp;address: 'Tu Dirección'</div>
                      <div>{'};'}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-lavender/10 rounded-lg">
                    <h4 className="font-semibold text-darkgray mb-2">
                      <i className="fas fa-database mr-2"></i>
                      Opción 2: Conexión con base de datos (Próximamente)
                    </h4>
                    <p className="text-sm text-gray-700">
                      Los cambios en este formulario se podrán guardar automáticamente en la base de datos
                      para persistir entre sesiones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfessionalPortal;
