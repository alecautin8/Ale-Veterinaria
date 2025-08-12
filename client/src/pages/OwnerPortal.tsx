import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { VaccineCalculator } from '@/lib/vaccineCalculator';

const OwnerPortal = () => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('pets');

  // Mock data - en producción vendría de Firebase
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
      weight: '3.5 kg'
    }
  ]);

  const [vaccinations, setVaccinations] = useState([
    {
      id: '1',
      petId: '1',
      vaccine: 'Quíntuple (Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis)',
      date: '2023-12-15',
      nextDue: '2024-12-15',
      veterinarian: 'Dra. Alejandra Cautín Bastías',
      batchNumber: 'VAG123ABC',
      laboratory: 'Zoetis',
      validityDays: 365
    },
    {
      id: '2',
      petId: '1',
      vaccine: 'Antirrábica',
      date: '2023-11-20',
      nextDue: '2024-11-20',
      veterinarian: 'Dra. Alejandra Cautín Bastías',
      batchNumber: 'RAB456DEF',
      laboratory: 'Zoetis',
      validityDays: 365
    }
  ]);

  const [dewormings, setDewormings] = useState([
    {
      id: '1',
      petId: '1',
      type: 'internal',
      product: 'Drontal Plus',
      activeIngredient: 'Praziquantel + Pirantel + Febantel',
      date: '2023-12-01',
      nextDue: '2024-03-01',
      veterinarian: 'Dra. Alejandra Cautín Bastías',
      laboratory: 'Bayer',
      batchNumber: 'DP789XYZ'
    },
    {
      id: '2',
      petId: '1',
      type: 'external',
      product: 'Frontline Plus',
      activeIngredient: 'Fipronil + S-Metopreno',
      date: '2023-12-01',
      nextDue: '2024-01-01',
      veterinarian: 'Dra. Alejandra Cautín Bastías',
      laboratory: 'Boehringer Ingelheim',
      batchNumber: 'FP456ABC'
    }
  ]);

  const [newDeworming, setNewDeworming] = useState({
    petId: '1',
    type: 'internal',
    product: '',
    activeIngredient: '',
    date: new Date().toISOString().split('T')[0],
    laboratory: '',
    batchNumber: '',
    notes: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const addDeworming = () => {
    if (!newDeworming.product || !newDeworming.date) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    // Calcular próxima fecha según tipo
    const nextDueDate = new Date(newDeworming.date);
    if (newDeworming.type === 'internal') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 3); // Cada 3 meses
    } else {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Cada mes
    }

    const newDewormingRecord = {
      id: Date.now().toString(),
      ...newDeworming,
      nextDue: nextDueDate.toISOString().split('T')[0],
      veterinarian: 'Tutor (Aplicación domiciliaria)'
    };

    setDewormings([...dewormings, newDewormingRecord]);
    
    // Reset form
    setNewDeworming({
      petId: '1',
      type: 'internal',
      product: '',
      activeIngredient: '',
      date: new Date().toISOString().split('T')[0],
      laboratory: '',
      batchNumber: '',
      notes: ''
    });

    toast({
      title: "Desparasitación registrada",
      description: "El registro se ha agregado exitosamente y aparecerá en la ficha clínica"
    });
  };

  const printVaccineCard = () => {
    const printContent = generateVaccineCardHTML();
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  };

  const generateVaccineCardHTML = () => {
    const pet = pets[0]; // Para demo, tomar la primera mascota
    const petVaccinations = vaccinations.filter(v => v.petId === pet.id);
    const petDewormings = dewormings.filter(d => d.petId === pet.id);

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carnet de Vacunas - ${pet.name}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.4;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #4ECDC4;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .pet-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
            }
            .pet-info h3 {
                margin-top: 0;
                color: #2C3E50;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px dotted #ccc;
            }
            .section {
                margin-bottom: 40px;
            }
            .section h3 {
                background: #4ECDC4;
                color: white;
                padding: 10px 15px;
                margin: 0 0 20px 0;
                border-radius: 5px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .table th, .table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
                font-size: 12px;
            }
            .table th {
                background: #f1f1f1;
                font-weight: bold;
            }
            .status-overdue {
                color: #e74c3c;
                font-weight: bold;
            }
            .status-due-soon {
                color: #f39c12;
                font-weight: bold;
            }
            .status-current {
                color: #27ae60;
                font-weight: bold;
            }
            .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 10px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            .vet-signature {
                margin-top: 40px;
                text-align: right;
            }
            .signature-line {
                border-top: 1px solid #000;
                width: 300px;
                margin: 40px 0 10px auto;
                text-align: center;
                padding-top: 5px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🐾 CARNET DE VACUNAS Y DESPARASITACIÓN 🐾</h1>
            <h2>VetCare Chile - Servicios Veterinarios a Domicilio</h2>
        </div>

        <div class="pet-info">
            <h3>Información de la Mascota</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Nombre:</strong>
                    <span>${pet.name}</span>
                </div>
                <div class="info-item">
                    <strong>Especie:</strong>
                    <span>${pet.species}</span>
                </div>
                <div class="info-item">
                    <strong>Raza:</strong>
                    <span>${pet.breed}</span>
                </div>
                <div class="info-item">
                    <strong>Sexo:</strong>
                    <span>${pet.sex}</span>
                </div>
                <div class="info-item">
                    <strong>Color:</strong>
                    <span>${pet.color}</span>
                </div>
                <div class="info-item">
                    <strong>Fecha de Nacimiento:</strong>
                    <span>${new Date(pet.birthDate).toLocaleDateString('es-CL')}</span>
                </div>
                <div class="info-item">
                    <strong>Microchip:</strong>
                    <span>${pet.microchipId || 'No registrado'}</span>
                </div>
                <div class="info-item">
                    <strong>Peso:</strong>
                    <span>${pet.weight}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>📋 Historial de Vacunación</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Vacuna</th>
                        <th>Laboratorio</th>
                        <th>Lote</th>
                        <th>Próxima Dosis</th>
                        <th>Estado</th>
                        <th>Veterinario</th>
                    </tr>
                </thead>
                <tbody>
                    ${petVaccinations.map(vaccination => {
                      const result = VaccineCalculator.calculateNextVaccination({
                        vaccinationDate: vaccination.date,
                        customDuration: vaccination.validityDays
                      });
                      const statusClass = result.alertLevel === 'red' ? 'status-overdue' : 
                                        result.alertLevel === 'yellow' ? 'status-due-soon' : 'status-current';
                      const statusText = result.isOverdue ? 'VENCIDA' : 
                                       result.daysUntilDue <= 30 ? 'PRÓXIMA' : 'VIGENTE';
                      
                      return `
                      <tr>
                          <td>${new Date(vaccination.date).toLocaleDateString('es-CL')}</td>
                          <td>${vaccination.vaccine}</td>
                          <td>${vaccination.laboratory}</td>
                          <td>${vaccination.batchNumber}</td>
                          <td>${new Date(vaccination.nextDue).toLocaleDateString('es-CL')}</td>
                          <td class="${statusClass}">${statusText}</td>
                          <td>${vaccination.veterinarian}</td>
                      </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>🐛 Historial de Desparasitación</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Producto</th>
                        <th>Principio Activo</th>
                        <th>Laboratorio</th>
                        <th>Lote</th>
                        <th>Próxima Dosis</th>
                        <th>Aplicado por</th>
                    </tr>
                </thead>
                <tbody>
                    ${petDewormings.map(deworming => `
                    <tr>
                        <td>${new Date(deworming.date).toLocaleDateString('es-CL')}</td>
                        <td>${deworming.type === 'internal' ? 'Interna' : 'Externa'}</td>
                        <td>${deworming.product}</td>
                        <td>${deworming.activeIngredient}</td>
                        <td>${deworming.laboratory}</td>
                        <td>${deworming.batchNumber}</td>
                        <td>${new Date(deworming.nextDue).toLocaleDateString('es-CL')}</td>
                        <td>${deworming.veterinarian}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="vet-signature">
            <div class="signature-line">
                Firma y Timbre Veterinario
            </div>
        </div>

        <div class="footer">
            <p><strong>VetCare Chile</strong> - Servicios Veterinarios a Domicilio</p>
            <p>📞 +56 9 1234 5678 | 📧 info@vetcarechile.com</p>
            <p>Documento generado el ${new Date().toLocaleDateString('es-CL')} a las ${new Date().toLocaleTimeString('es-CL')}</p>
        </div>
    </body>
    </html>`;
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
              <h1 className="text-3xl font-poppins font-bold text-darkgray mb-2">Portal del Tutor</h1>
              <p className="text-gray-600 font-lato">Gestiona la información de tus mascotas</p>
            </div>
            <Button onClick={() => setLocation('/')} variant="outline">
              <i className="fas fa-home mr-2"></i>
              Volver al Inicio
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6">
            <Button
              onClick={() => setActiveTab('pets')}
              className={`${activeTab === 'pets' ? 'bg-mint text-darkgray' : 'bg-white text-gray-600 hover:bg-mint/20'}`}
            >
              <i className="fas fa-paw mr-2"></i>
              Mis Mascotas
            </Button>
            <Button
              onClick={() => setActiveTab('vaccines')}
              className={`${activeTab === 'vaccines' ? 'bg-mint text-darkgray' : 'bg-white text-gray-600 hover:bg-mint/20'}`}
            >
              <i className="fas fa-syringe mr-2"></i>
              Carnet de Vacunas
            </Button>
            <Button
              onClick={() => setActiveTab('deworming')}
              className={`${activeTab === 'deworming' ? 'bg-mint text-darkgray' : 'bg-white text-gray-600 hover:bg-mint/20'}`}
            >
              <i className="fas fa-bug mr-2"></i>
              Desparasitación
            </Button>
          </div>
        </div>

        {/* Pets Tab */}
        {activeTab === 'pets' && (
          <div className="grid md:grid-cols-2 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id}>
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center">
                    <i className="fas fa-paw text-mint mr-2"></i>
                    {pet.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Especie:</span>
                      <span>{pet.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Raza:</span>
                      <span>{pet.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sexo:</span>
                      <span>{pet.sex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Peso:</span>
                      <span>{pet.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Microchip:</span>
                      <span className="text-sm">{pet.microchipId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Vaccines Tab */}
        {activeTab === 'vaccines' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-poppins font-bold text-darkgray">Carnet de Vacunas</h2>
              <Button onClick={printVaccineCard} className="bg-turquoise text-darkgray hover:bg-turquoise/80">
                <i className="fas fa-print mr-2"></i>
                Imprimir Carnet
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">Historial de Vacunación - {pets[0]?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Fecha</th>
                        <th className="border border-gray-300 p-3 text-left">Vacuna</th>
                        <th className="border border-gray-300 p-3 text-left">Laboratorio</th>
                        <th className="border border-gray-300 p-3 text-left">Próxima Dosis</th>
                        <th className="border border-gray-300 p-3 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaccinations.map((vaccination) => {
                        const result = VaccineCalculator.calculateNextVaccination({
                          vaccinationDate: vaccination.date,
                          customDuration: vaccination.validityDays
                        });
                        
                        return (
                          <tr key={vaccination.id}>
                            <td className="border border-gray-300 p-3">
                              {new Date(vaccination.date).toLocaleDateString('es-CL')}
                            </td>
                            <td className="border border-gray-300 p-3">{vaccination.vaccine}</td>
                            <td className="border border-gray-300 p-3">{vaccination.laboratory}</td>
                            <td className="border border-gray-300 p-3">
                              {new Date(vaccination.nextDue).toLocaleDateString('es-CL')}
                            </td>
                            <td className="border border-gray-300 p-3">
                              <span className={`font-medium ${
                                result.alertLevel === 'red' ? 'text-red-600' :
                                result.alertLevel === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {result.isOverdue ? 'Vencida' : result.daysUntilDue <= 30 ? 'Próxima' : 'Vigente'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deworming Tab */}
        {activeTab === 'deworming' && (
          <div className="space-y-6">
            {/* Add New Deworming */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">Agregar Nueva Desparasitación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dewormingType">Tipo de Desparasitación</Label>
                    <Select value={newDeworming.type} onValueChange={(value) => setNewDeworming({...newDeworming, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Interna</SelectItem>
                        <SelectItem value="external">Externa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product">Producto *</Label>
                    <Input
                      id="product"
                      value={newDeworming.product}
                      onChange={(e) => setNewDeworming({...newDeworming, product: e.target.value})}
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="activeIngredient">Principio Activo</Label>
                    <Input
                      id="activeIngredient"
                      value={newDeworming.activeIngredient}
                      onChange={(e) => setNewDeworming({...newDeworming, activeIngredient: e.target.value})}
                      placeholder="Principio activo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="laboratory">Laboratorio</Label>
                    <Input
                      id="laboratory"
                      value={newDeworming.laboratory}
                      onChange={(e) => setNewDeworming({...newDeworming, laboratory: e.target.value})}
                      placeholder="Laboratorio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="batchNumber">Lote</Label>
                    <Input
                      id="batchNumber"
                      value={newDeworming.batchNumber}
                      onChange={(e) => setNewDeworming({...newDeworming, batchNumber: e.target.value})}
                      placeholder="Número de lote"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Fecha de Aplicación *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newDeworming.date}
                      onChange={(e) => setNewDeworming({...newDeworming, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      value={newDeworming.notes}
                      onChange={(e) => setNewDeworming({...newDeworming, notes: e.target.value})}
                      placeholder="Observaciones adicionales..."
                      rows={3}
                    />
                  </div>
                </div>
                <Button onClick={addDeworming} className="mt-4 bg-mint text-darkgray hover:bg-mint/80">
                  <i className="fas fa-plus mr-2"></i>
                  Agregar Desparasitación
                </Button>
              </CardContent>
            </Card>

            {/* Deworming History */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">Historial de Desparasitación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Fecha</th>
                        <th className="border border-gray-300 p-3 text-left">Tipo</th>
                        <th className="border border-gray-300 p-3 text-left">Producto</th>
                        <th className="border border-gray-300 p-3 text-left">Principio Activo</th>
                        <th className="border border-gray-300 p-3 text-left">Próxima Dosis</th>
                        <th className="border border-gray-300 p-3 text-left">Aplicado por</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dewormings.map((deworming) => (
                        <tr key={deworming.id}>
                          <td className="border border-gray-300 p-3">
                            {new Date(deworming.date).toLocaleDateString('es-CL')}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              deworming.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {deworming.type === 'internal' ? 'Interna' : 'Externa'}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3">{deworming.product}</td>
                          <td className="border border-gray-300 p-3">{deworming.activeIngredient}</td>
                          <td className="border border-gray-300 p-3">
                            {new Date(deworming.nextDue).toLocaleDateString('es-CL')}
                          </td>
                          <td className="border border-gray-300 p-3 text-sm">{deworming.veterinarian}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPortal;