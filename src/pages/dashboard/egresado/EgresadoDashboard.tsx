import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import { getSession, getUsers, getSurveys, getCapacitaciones, getResponsesByUser, User } from '@/lib/storage';
import { ClipboardList, BookOpen, Briefcase, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EgresadoDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    const users = getUsers();
    const currentUser = users.find(u => u.id === session.userId);
    setUser(currentUser || null);
  }, [navigate]);
  
  const session = getSession();
  if (!session || !user) return null;
  
  const surveys = getSurveys().filter(s => s.activa);
  const myResponses = getResponsesByUser(session.userId);
  const capacitaciones = getCapacitaciones().filter(c => c.activa);
  const misCapacitaciones = capacitaciones.filter(c => c.inscritos.includes(session.userId));
  
  const pendingSurveys = surveys.filter(s => !myResponses.some(r => r.surveyId === s.id));
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {session.nombres}
          </h1>
          <p className="text-muted-foreground">
            Panel de control del egresado
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Encuestas Pendientes"
            value={pendingSurveys.length}
            icon={ClipboardList}
            color="warning"
          />
          <StatCard
            title="Encuestas Respondidas"
            value={myResponses.length}
            icon={CheckCircle}
            color="success"
          />
          <StatCard
            title="Mis Capacitaciones"
            value={misCapacitaciones.length}
            icon={BookOpen}
            color="info"
          />
          <StatCard
            title="Estado Laboral"
            value={user.estadoLaboral ? 'Actualizado' : 'Sin actualizar'}
            icon={Briefcase}
            color={user.estadoLaboral ? 'success' : 'warning'}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Encuestas Pendientes */}
          <Card title="Encuestas Pendientes" subtitle="Completa tus encuestas">
            {pendingSurveys.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No tienes encuestas pendientes
              </p>
            ) : (
              <div className="space-y-3">
                {pendingSurveys.slice(0, 3).map(survey => (
                  <div 
                    key={survey.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{survey.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {survey.preguntas.length} preguntas
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/egresado/encuestas')}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Responder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Próximas Capacitaciones */}
          <Card title="Capacitaciones Disponibles" subtitle="Inscríbete ahora">
            {capacitaciones.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay capacitaciones disponibles
              </p>
            ) : (
              <div className="space-y-3">
                {capacitaciones.slice(0, 3).map(cap => (
                  <div 
                    key={cap.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{cap.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {cap.modalidad} • {cap.inscritos.length}/{cap.cupos} inscritos
                      </p>
                    </div>
                    {cap.inscritos.includes(session.userId) ? (
                      <span className="badge badge-success">Inscrito</span>
                    ) : (
                      <button
                        onClick={() => navigate('/dashboard/egresado/capacitaciones')}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        {/* Perfil incompleto alert */}
        {!user.estadoLaboral && (
          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>¡Actualiza tu estado laboral!</strong> Es importante mantener 
              tu información actualizada para recibir oportunidades relevantes.
            </p>
            <button
              onClick={() => navigate('/dashboard/egresado/estado-laboral')}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              Actualizar ahora →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EgresadoDashboard;
