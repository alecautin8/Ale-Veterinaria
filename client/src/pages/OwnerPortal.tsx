import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const OwnerPortal = () => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mock data - in real implementation, this would come from Firebase
  const [userPets] = useState([
    {
      id: '1',
      name: 'Max',
      species: 'Yorkshire Terrier',
      photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300',
      lastVisit: '15/12/2023',
      nextVaccine: '15/01/2024'
    }
  ]);

  const [medicalHistory] = useState([
    {
      id: '1',
      type: 'Vacunación',
      description: 'Vanguard Plus 5 - Zoetis',
      date: '15/12/2023',
      borderColor: 'border-mint'
    },
    {
      id: '2',
      type: 'Consulta General',
      description: 'Revisión rutinaria - Estado de salud excelente',
      date: '10/11/2023',
      borderColor: 'border-turquoise'
    }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  const downloadDocument = (recordId: string) => {
    // Here you would implement PDF download from Firebase Storage
    toast({
      title: "Descargando documento",
      description: `Documento ${recordId} descargándose desde Firebase Storage`,
    });
  };

  const viewPetHistory = (petId: string) => {
    // Here you would implement pet history view with Firebase data
    toast({
      title: "Historial de mascota",
      description: `Mostrando historial completo de la mascota ${petId}`,
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
            <h1 className="text-3xl font-poppins font-bold text-darkgray mb-2">Portal del Tutor</h1>
            <p className="text-gray-600 font-lato">Historial médico de tus mascotas</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline">
            <i className="fas fa-home mr-2"></i>
            Volver al Inicio
          </Button>
        </div>

        {/* Pet Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userPets.map((pet) => (
            <Card key={pet.id} className="hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <img 
                    src={pet.photo} 
                    alt={pet.name} 
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-3" 
                  />
                  <h3 className="text-xl font-poppins font-semibold text-darkgray">{pet.name}</h3>
                  <p className="text-gray-600 font-lato">{pet.species}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última consulta:</span>
                    <span className="font-medium">{pet.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Próxima vacuna:</span>
                    <span className="font-medium">{pet.nextVaccine}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => viewPetHistory(pet.id)}
                  className="w-full mt-4 bg-mint text-darkgray hover:bg-mint/80"
                >
                  Ver Historial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Historial Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalHistory.map((record) => (
                <div key={record.id} className={`border-l-4 ${record.borderColor} pl-4 py-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-poppins font-medium text-darkgray">{record.type}</h4>
                      <p className="text-gray-600 font-lato">{record.description}</p>
                      <p className="text-sm text-gray-500 font-lato">{record.date}</p>
                    </div>
                    <Button 
                      onClick={() => downloadDocument(record.id)}
                      size="sm"
                      className="bg-lavender text-darkgray hover:bg-lavender/80"
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
      </div>
    </div>
  );
};

export default OwnerPortal;
