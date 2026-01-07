import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, updateUser, User } from '@/lib/storage';
import { Briefcase, Building2, DollarSign, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EgresadoEstadoLaboral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const initializedRef = useRef(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    estadoLaboral: '',
    empresa: '',
    cargo: '',
    salarioRango: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    // Solo inicializar una vez
    if (initializedRef.current) return;
    
    const users = getUsers();
    const currentUser = users.find(u => u.id === session.userId);
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        estadoLaboral: currentUser.estadoLaboral || '',
        empresa: currentUser.empresa || '',
        cargo: currentUser.cargo || '',
        salarioRango: currentUser.salarioRango || '',
      });
      initializedRef.current = true;
    }
  }, [navigate]);
  
  const session = getSession();
  if (!session || !user) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      updateUser(session.userId, {
        estadoLaboral: formData.estadoLaboral as User['estadoLaboral'],
        empresa: formData.empresa,
        cargo: formData.cargo,
        salarioRango: formData.salarioRango,
      });
      
      // Actualizar el estado del usuario después de guardar
      const users = getUsers();
      const updatedUser = users.find(u => u.id === session.userId);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      toast({
        title: 'Estado laboral actualizado',
        description: 'Tu información ha sido guardada',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la información',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const estadosLaborales = [
    { value: 'empleado', label: 'Empleado', icon: Briefcase },
    { value: 'desempleado', label: 'Desempleado', icon: Briefcase },
    { value: 'independiente', label: 'Independiente/Freelance', icon: Building2 },
    { value: 'estudiando', label: 'Estudiando', icon: Briefcase },
  ];
  
  const rangosalario = [
    { value: 'menos-450', label: 'Menos de $450' },
    { value: '450-800', label: '$450 - $800' },
    { value: '800-1200', label: '$800 - $1,200' },
    { value: '1200-2000', label: '$1,200 - $2,000' },
    { value: '2000-3000', label: '$2,000 - $3,000' },
    { value: 'mas-3000', label: 'Más de $3,000' },
    { value: 'prefiero-no-decir', label: 'Prefiero no decir' },
  ];
  
  const showEmploymentDetails = formData.estadoLaboral === 'empleado' || formData.estadoLaboral === 'independiente';
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Estado Laboral</h1>
          <p className="text-muted-foreground">Actualiza tu situación laboral actual</p>
        </div>
        
        <div className="max-w-2xl">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Estado laboral */}
              <div>
                <label className="label-field mb-3">¿Cuál es tu situación laboral actual?</label>
                <div className="grid grid-cols-2 gap-3">
                  {estadosLaborales.map(estado => (
                    <label
                      key={estado.value}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, estadoLaboral: estado.value }));
                      }}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.estadoLaboral === estado.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="estadoLaboral"
                        value={estado.value}
                        checked={formData.estadoLaboral === estado.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.estadoLaboral === estado.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <estado.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{estado.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Detalles de empleo */}
              {showEmploymentDetails && (
                <>
                  <div>
                    <label htmlFor="empresa" className="label-field">
                      {formData.estadoLaboral === 'independiente' ? 'Nombre de tu negocio/empresa' : 'Empresa donde trabajas'}
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cargo" className="label-field">
                      {formData.estadoLaboral === 'independiente' ? 'Tu rol/especialidad' : 'Cargo que desempeñas'}
                    </label>
                    <input
                      type="text"
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ej: Desarrollador, Analista, Gerente..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="salarioRango" className="label-field">
                      Rango salarial mensual (USD)
                    </label>
                    <select
                      id="salarioRango"
                      name="salarioRango"
                      value={formData.salarioRango}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Seleccionar</option>
                      {rangosalario.map(rango => (
                        <option key={rango.value} value={rango.value}>{rango.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={loading || !formData.estadoLaboral}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar Estado Laboral
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
          
          {/* Tips */}
          <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">¿Por qué es importante?</h4>
            <p className="text-sm text-muted-foreground">
              Mantener tu estado laboral actualizado nos ayuda a entender mejor la inserción 
              laboral de nuestros egresados y a mejorar los programas académicos. Tu información 
              es confidencial y solo se utiliza con fines estadísticos.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EgresadoEstadoLaboral;
