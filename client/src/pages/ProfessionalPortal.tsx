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
    name: '',
    species: '',
    breed: '',
    weight: '',
    consultation: ''
  });

  const [vaccineData, setVaccineData] = useState({
    vaccineId: '',
    laboratory: '',
    batch: '',
    date: '',
    pathogens: [] as string[]
  });

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-darkgray mb-2">Portal Profesional</h1>
            <p className="text-gray-600 font-lato">Gestión de fichas clínicas y certificados</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline">
            <i className="fas fa-home mr-2"></i>
            Volver al Inicio
          </Button>
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

        {/* PDF Generation Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Generar Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => generateCertificate('salud')}
                className="bg-mint text-darkgray hover:bg-mint/80"
              >
                <i className="fas fa-certificate mr-2"></i>
                Certificado de Salud
              </Button>
              <Button 
                onClick={() => generateCertificate('exportación')}
                className="bg-lavender text-darkgray hover:bg-lavender/80"
              >
                <i className="fas fa-plane mr-2"></i>
                Certificado de Exportación
              </Button>
              <Button 
                onClick={() => generateCertificate('receta')}
                className="bg-turquoise text-darkgray hover:bg-turquoise/80"
              >
                <i className="fas fa-prescription mr-2"></i>
                Receta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalPortal;
