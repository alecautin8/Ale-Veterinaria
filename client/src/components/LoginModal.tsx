import { useState } from 'react';
import { useLocation } from 'wouter';
import { signInUser } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tutor' | 'profesional';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInUser(email, password);
      toast({
        title: "Acceso exitoso",
        description: `Bienvenido al portal ${type === 'tutor' ? 'del tutor' : 'profesional'}`,
      });
      
      // Redirect to appropriate portal
      setLocation(type === 'tutor' ? '/portal/tutor' : '/portal/profesional');
      onClose();
    } catch (error: any) {
      toast({
        title: "Error de acceso",
        description: "Email o contraseña incorrectos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center mb-4">
            <i className="fas fa-user-circle text-4xl text-mint mb-4"></i>
            <DialogTitle className="text-2xl font-poppins font-bold text-darkgray">
              {type === 'tutor' ? 'Portal del Tutor' : 'Portal Profesional'}
            </DialogTitle>
            <p className="text-gray-600 font-lato mt-2">
              {type === 'tutor' ? 'Accede al historial de tus mascotas' : 'Gestiona fichas clínicas y certificados'}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-darkgray font-poppins font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-2 p-4 rounded-xl border-2 border-gray-200 focus:border-mint"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-darkgray font-poppins font-medium">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 p-4 rounded-xl border-2 border-gray-200 focus:border-lavender"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mint text-darkgray py-4 px-8 rounded-xl font-poppins font-semibold hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Iniciando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i>
                Iniciar Sesión
              </>
            )}
          </Button>
          
          <div className="text-center">
            <button type="button" className="text-turquoise font-poppins font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
