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
    </div>
  );
};

export default ProfessionalPortal;
