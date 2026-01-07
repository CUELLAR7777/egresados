import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, updateUser, User } from '@/lib/storage';
import { provinciasEcuador, facultadesULEAM } from '@/lib/validators';
import { Save, User as UserIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EgresadoPerfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    carrera: '',
    facultad: '',
    tituloObtenido: '',
    linkedin: '',
    portfolio: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    const users = getUsers();
    const currentUser = users.find(u => u.id === session.userId);
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombres: currentUser.nombres,
        apellidos: currentUser.apellidos,
        telefono: currentUser.telefono,
        direccion: currentUser.direccion,
        ciudad: currentUser.ciudad,
        provincia: currentUser.provincia,
        carrera: currentUser.carrera || '',
        facultad: currentUser.facultad || '',
        tituloObtenido: currentUser.tituloObtenido || '',
        linkedin: currentUser.linkedin || '',
        portfolio: currentUser.portfolio || '',
      });
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
      updateUser(session.userId, formData);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos han sido guardados correctamente',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Actualiza tu información personal</p>
        </div>
        
        <div className="max-w-4xl">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info no editable */}
              <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {user.nombres} {user.apellidos}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Cédula: {user.cedula}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registrado el {new Date(user.fechaRegistro).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Datos personales */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Datos Personales</h3>
                <div className="form-grid">
                  <div>
                    <label className="label-field">Nombres</label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Provincia</label>
                    <select
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Seleccionar</option>
                      {provinciasEcuador.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              {/* Datos académicos */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Datos Académicos</h3>
                <div className="form-grid">
                  <div>
                    <label className="label-field">Facultad</label>
                    <select
                      name="facultad"
                      value={formData.facultad}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Seleccionar</option>
                      {facultadesULEAM.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Carrera</label>
                    <input
                      type="text"
                      name="carrera"
                      value={formData.carrera}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Título Obtenido</label>
                    <input
                      type="text"
                      name="tituloObtenido"
                      value={formData.tituloObtenido}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              {/* Redes */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Redes y Portfolio</h3>
                <div className="form-grid">
                  <div>
                    <label className="label-field">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="label-field">Portfolio</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EgresadoPerfil;
