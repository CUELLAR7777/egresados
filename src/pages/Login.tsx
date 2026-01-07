import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession, setSession, getUserByEmail, initializeData } from '@/lib/storage';
import { Eye, EyeOff, LogIn, AlertCircle, Copy, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Inicializar datos de prueba
    initializeData();
    
    // Si ya hay sesión, redirigir
    const session = getSession();
    if (session) {
      const redirectPath = session.rol === 'coordinador' 
        ? '/dashboard/coordinador' 
        : '/dashboard/egresado';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = getUserByEmail(formData.email);
      
      if (!user) {
        setError('No existe una cuenta con ese correo electrónico');
        setLoading(false);
        return;
      }
      
      if (user.password !== formData.password) {
        setError('Contraseña incorrecta');
        setLoading(false);
        return;
      }
      
      if (user.status !== 'approved') {
        if (user.status === 'pending') {
          setError('Tu cuenta está pendiente de aprobación. Por favor, espera a que un coordinador la apruebe.');
        } else {
          setError('Tu cuenta ha sido rechazada. Contacta al administrador.');
        }
        setLoading(false);
        return;
      }
      
      // Crear sesión
      setSession({
        userId: user.id,
        email: user.email,
        rol: user.rol,
        nombres: user.nombres,
        apellidos: user.apellidos,
      });
      
      toast({
        title: 'Bienvenido',
        description: `Hola, ${user.nombres}`,
      });
      
      // Redirigir según rol
      const redirectPath = user.rol === 'coordinador' 
        ? '/dashboard/coordinador' 
        : '/dashboard/egresado';
      navigate(redirectPath, { replace: true });
      
    } catch {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container flex flex-col min-h-screen">
      <Header showNav={false} />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg card-shadow border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Iniciar Sesión</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Cards de Credenciales de Ejemplo */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              {/* Card Coordinador */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setFormData({
                    email: 'admin@gmail.com',
                    password: 'Admin123!'
                  });
                  setError('');
                  toast({
                    title: 'Credenciales cargadas',
                    description: 'Formulario rellenado con credenciales de coordinador',
                  });
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Coordinador</h3>
                      <p className="text-xs text-muted-foreground">Acceso completo</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        admin@gmail.com
                      </code>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText('admin@gmail.com');
                          toast({ title: 'Copiado', description: 'Email copiado al portapapeles' });
                        }}
                        className="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Copiar email"
                      >
                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contraseña:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        Admin123!
                      </code>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText('Admin123!');
                          toast({ title: 'Copiado', description: 'Contraseña copiada al portapapeles' });
                        }}
                        className="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Usar estas credenciales
                </div>
              </div>

              {/* Card Egresado */}
              <div 
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setFormData({
                    email: 'egresado.demo@gmail.com',
                    password: 'Egresado123!'
                  });
                  setError('');
                  toast({
                    title: 'Credenciales cargadas',
                    description: 'Formulario rellenado con credenciales de egresado',
                  });
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Egresado</h3>
                      <p className="text-xs text-muted-foreground">Acceso limitado</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        egresado.demo@gmail.com
                      </code>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText('egresado.demo@gmail.com');
                          toast({ title: 'Copiado', description: 'Email copiado al portapapeles' });
                        }}
                        className="p-1.5 hover:bg-green-200 dark:hover:bg-green-900 rounded transition-colors"
                        title="Copiar email"
                      >
                        <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contraseña:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        Egresado123!
                      </code>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText('Egresado123!');
                          toast({ title: 'Copiado', description: 'Contraseña copiada al portapapeles' });
                        }}
                        className="p-1.5 hover:bg-green-200 dark:hover:bg-green-900 rounded transition-colors"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Usar estas credenciales
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="label-field">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="correo@gmail.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="label-field">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
