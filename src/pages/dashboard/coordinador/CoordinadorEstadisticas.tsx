import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, getSurveys, getResponses, getCapacitaciones } from '@/lib/storage';
import { exportToCSV, exportToJSON, exportToXML, prepareUsersForExport } from '@/lib/export';
import { BarChart3, Download, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoordinadorEstadisticas = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (!session) navigate('/login');
  }, [navigate]);
  
  const session = getSession();
  if (!session) return null;

  const users = getUsers();
  const egresados = users.filter(u => u.rol === 'egresado' && u.status === 'approved');
  const responses = getResponses();

  const estadosLaborales = { empleado: 0, desempleado: 0, independiente: 0, estudiando: 0, sinInfo: 0 };
  egresados.forEach(e => { 
    if (e.estadoLaboral) estadosLaborales[e.estadoLaboral]++; 
    else estadosLaborales.sinInfo++; 
  });

  const exportUsers = (format: 'csv' | 'json' | 'xml') => {
    const data = prepareUsersForExport(egresados);
    if (format === 'csv') exportToCSV(data, 'egresados');
    else if (format === 'json') exportToJSON(data, 'egresados');
    else exportToXML(data, 'egresados', 'egresados');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Estadísticas</h1>
          <p className="text-muted-foreground">Análisis de datos del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Estado Laboral de Egresados">
            <div className="space-y-3">
              {Object.entries({ Empleado: estadosLaborales.empleado, Desempleado: estadosLaborales.desempleado, Independiente: estadosLaborales.independiente, Estudiando: estadosLaborales.estudiando, 'Sin información': estadosLaborales.sinInfo }).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-foreground">{k}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${egresados.length ? (v / egresados.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8">{v}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Resumen General">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{egresados.length}</p>
                <p className="text-sm text-muted-foreground">Egresados</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{responses.length}</p>
                <p className="text-sm text-muted-foreground">Respuestas</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{getSurveys().length}</p>
                <p className="text-sm text-muted-foreground">Encuestas</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{getCapacitaciones().length}</p>
                <p className="text-sm text-muted-foreground">Capacitaciones</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Exportar Datos" actions={
          <div className="flex gap-2">
            <button onClick={() => exportUsers('csv')} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" />CSV</button>
            <button onClick={() => exportUsers('json')} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" />JSON</button>
            <button onClick={() => exportUsers('xml')} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" />XML</button>
          </div>
        }>
          <p className="text-muted-foreground">Descarga los datos de egresados en el formato que prefieras.</p>
        </Card>
      </main>
    </div>
  );
};

export default CoordinadorEstadisticas;
