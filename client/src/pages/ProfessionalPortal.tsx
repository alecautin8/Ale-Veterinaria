import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { validateRut, formatRut } from '@/lib/rutValidator';
import { getVaccinesBySpecies, chileanVaccines } from '@/lib/vaccines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ProfessionalPortal = () => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
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

  const [vaccineData, setVaccineData] = useState({
    vaccineId: 'zoetis-vanguard-plus5',
    laboratory: 'Zoetis',
    batch: 'VAG123ABC',
    date: new Date().toISOString().split('T')[0],
    pathogens: ['Distemper', 'Adenovirus tipo 1', 'Adenovirus tipo 2', 'Parainfluenza', 'Parvovirus']
  });

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
      defaultInstructions: 'Ayuno de 12 horas. Traer a la mascota en ayunas desde las 8:00 PM del día anterior.',
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'bioquimica',
      name: 'Perfil Bioquímico',
      category: 'Bioquímica',
      defaultInstructions: 'Ayuno de 12 horas. No dar agua 2 horas antes del examen. Evitar ejercicio intenso 24 horas antes.',
      fastingRequired: true,
      urgency: 'normal'
    },
    {
      id: 'orina',
      name: 'Examen de Orina',
      category: 'Urianálisis',
      defaultInstructions: 'Recolectar primera orina de la mañana en frasco estéril. Mantener refrigerada hasta el examen.',
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'coprologico',
      name: 'Examen Coprológico',
      category: 'Parasitología',
      defaultInstructions: 'Recolectar muestra fresca de deposición en frasco estéril. Traer dentro de 2 horas de recolectada.',
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'radiografia',
      name: 'Radiografía',
      category: 'Imagenología',
      defaultInstructions: 'No requiere ayuno. Mantener a la mascota tranquila durante el traslado.',
      fastingRequired: false,
      urgency: 'normal'
    },
    {
      id: 'ecografia',
      name: 'Ecografía Abdominal',
      category: 'Imagenología',
      defaultInstructions: 'Ayuno de 12 horas. Vejiga llena (no orinar 2 horas antes). Mantener tranquila durante el traslado.',
      fastingRequired: true,
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

  const generateCertificate = (type: string) => {
    // Here you would implement PDF generation with html2pdf
    toast({
      title: "Generando certificado",
      description: `Certificado de ${type} generándose con html2pdf`,
    });
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
              <p className="text-gray-600 font-lato">Gestión de fichas clínicas y certificados - Dra. María González</p>
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

        {/* Patient Management */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Clinical Record Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Ficha Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="petName">Nombre de la mascota</Label>
                <Input
                  id="petName"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                  placeholder="Max"
                />
              </div>
              <div>
                <Label htmlFor="species">Especie</Label>
                <Select onValueChange={(value) => setPatientData({ ...patientData, species: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canino">Canino</SelectItem>
                    <SelectItem value="Felino">Felino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  value={patientData.breed}
                  onChange={(e) => setPatientData({ ...patientData, breed: e.target.value })}
                  placeholder="Yorkshire Terrier"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso</Label>
                <Input
                  id="weight"
                  value={patientData.weight}
                  onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
                  placeholder="3.5 kg"
                />
              </div>
              <div>
                <Label htmlFor="consultation">Consulta</Label>
                <Textarea
                  id="consultation"
                  value={patientData.consultation}
                  onChange={(e) => setPatientData({ ...patientData, consultation: e.target.value })}
                  placeholder="Descripción de la consulta"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vaccine Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Gestión de Vacunas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vaccine">Vacuna</Label>
                <Select onValueChange={handleVaccineSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vacuna..." />
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="laboratory">Laboratorio</Label>
                  <Input
                    id="laboratory"
                    value={vaccineData.laboratory}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="vaccineDate">Fecha</Label>
                  <Input
                    id="vaccineDate"
                    type="date"
                    value={vaccineData.date}
                    onChange={(e) => setVaccineData({ ...vaccineData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="batch">Lote</Label>
                <Input
                  id="batch"
                  value={vaccineData.batch}
                  onChange={(e) => setVaccineData({ ...vaccineData, batch: e.target.value })}
                  placeholder="A1B2C3"
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
            </CardContent>
          </Card>
        </div>

        {/* Patient History */}
        {showPatientData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center">
                <i className="fas fa-history text-mint mr-2"></i>
                Historial Médico - {patientData.name}
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
              >
                <i className="fas fa-plane text-3xl"></i>
                <div>
                  <div className="font-semibold">Certificado de Exportación</div>
                  <div className="text-sm opacity-80">Con anexos de vacunas</div>
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
                    <Button variant="outline" size="sm">
                      <i className="fas fa-download mr-1"></i>
                      Descargar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">ORD-2023120702 - Perfil Bioquímico</span>
                      <p className="text-sm text-gray-600">Luna (Felino) - María Silva - 14/12/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-download mr-1"></i>
                      Descargar
                    </Button>
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
