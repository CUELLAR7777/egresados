import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import { getSession, getUsers, getSurveys, getCapacitaciones, getResponses } from '@/lib/storage';
import { Users, ClipboardList, BookOpen, UserCheck, UserX, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoordinadorDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const session = getSession();
    if (!session) navigate('/login');
  }, [navigate]);
  
  const session = getSession();
  if (!session) return null;
  
  const users = getUsers();
  const egresados = users.filter(u => u.rol === 'egresado');
  const pendientes = egresados.filter(u => u.status === 'pending');
  const aprobados = egresados.filter(u => u.status === 'approved');
  const surveys = getSurveys();
  const capacitaciones = getCapacitaciones();
  const responses = getResponses();
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Panel de Coordinador</h1>
          <p className="text-muted-foreground">Gestión del sistema de seguimiento a egresados</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Egresados" value={egresados.length} icon={Users} color="primary" />
          <StatCard title="Pendientes" value={pendientes.length} icon={Clock} color="warning" />
          <StatCard title="Encuestas" value={surveys.length} icon={ClipboardList} color="info" />
          <StatCard title="Capacitaciones" value={capacitaciones.length} icon={BookOpen} color="success" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Usuarios Pendientes" actions={
            <button onClick={() => navigate('/dashboard/coordinador/aprobar')} className="text-sm text-primary hover:underline">
              Ver todos
            </button>
          }>
            {pendientes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay usuarios pendientes</p>
            ) : (
              <div className="space-y-2">
                {pendientes.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{u.nombres} {u.apellidos}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span className="badge badge-warning">Pendiente</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          <Card title="Resumen de Encuestas">
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">Total de respuestas</span>
                <span className="font-bold text-foreground">{responses.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">Encuestas activas</span>
                <span className="font-bold text-foreground">{surveys.filter(s => s.activa).length}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">Tasa de respuesta</span>
                <span className="font-bold text-foreground">
                  {aprobados.length > 0 ? Math.round((responses.length / (aprobados.length * surveys.length || 1)) * 100) : 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CoordinadorDashboard;
