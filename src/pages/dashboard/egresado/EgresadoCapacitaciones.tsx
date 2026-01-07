import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { 
  getSession, 
  getCapacitaciones, 
  inscribirCapacitacion,
  Capacitacion 
} from '@/lib/storage';
import { BookOpen, Calendar, Users, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EgresadoCapacitaciones = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    setCapacitaciones(getCapacitaciones().filter(c => c.activa));
  }, [navigate]);
  
  const session = getSession();
  if (!session) return null;
  
  const handleInscribir = (capacitacionId: string) => {
    const success = inscribirCapacitacion(capacitacionId, session.userId);
    
    if (success) {
      setCapacitaciones(getCapacitaciones().filter(c => c.activa));
      toast({
        title: 'Inscripción exitosa',
        description: 'Te has inscrito a la capacitación',
      });
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo completar la inscripción. Puede que ya estés inscrito o no haya cupos.',
        variant: 'destructive',
      });
    }
  };
  
  const isInscrito = (cap: Capacitacion) => cap.inscritos.includes(session.userId);
  const cuposDisponibles = (cap: Capacitacion) => cap.cupos - cap.inscritos.length;
  
  const misCapacitaciones = capacitaciones.filter(c => isInscrito(c));
  const disponibles = capacitaciones.filter(c => !isInscrito(c));
  
  const modalidadIcon = {
    presencial: MapPin,
    virtual: BookOpen,
    hibrida: Users,
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Capacitaciones</h1>
          <p className="text-muted-foreground">Inscríbete a programas de formación continua</p>
        </div>
        
        {/* Mis inscripciones */}
        {misCapacitaciones.length > 0 && (
          <div className="mb-8">
            <h2 className="section-title flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Mis Inscripciones ({misCapacitaciones.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {misCapacitaciones.map(cap => {
                const Icon = modalidadIcon[cap.modalidad];
                return (
                  <Card key={cap.id}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{cap.titulo}</h3>
                      <span className="badge badge-success">Inscrito</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {cap.descripcion}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(cap.fechaInicio).toLocaleDateString()} - {new Date(cap.fechaFin).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{cap.modalidad}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Instructor: {cap.instructor}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Disponibles */}
        <div>
          <h2 className="section-title flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Capacitaciones Disponibles ({disponibles.length})
          </h2>
          
          {disponibles.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-center py-8">
                No hay capacitaciones disponibles en este momento
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disponibles.map(cap => {
                const Icon = modalidadIcon[cap.modalidad];
                const cupos = cuposDisponibles(cap);
                const sinCupos = cupos <= 0;
                
                return (
                  <Card key={cap.id}>
                    <h3 className="font-semibold text-foreground mb-2">{cap.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {cap.descripcion}
                    </p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(cap.fechaInicio).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{cap.modalidad}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className={sinCupos ? 'text-destructive' : ''}>
                          {cupos} cupos disponibles
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleInscribir(cap.id)}
                      disabled={sinCupos}
                      className={`w-full ${sinCupos ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {sinCupos ? 'Sin cupos' : 'Inscribirme'}
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EgresadoCapacitaciones;
