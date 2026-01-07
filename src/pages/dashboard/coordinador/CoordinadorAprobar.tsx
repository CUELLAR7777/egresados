import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, updateUser, User } from '@/lib/storage';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CoordinadorAprobar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const session = getSession();
    if (!session) { navigate('/login'); return; }
    setUsers(getUsers().filter(u => u.rol === 'egresado'));
  }, [navigate]);
  
  const session = getSession();
  if (!session) return null;
  
  const handleStatus = (userId: string, status: 'approved' | 'rejected') => {
    updateUser(userId, { status });
    setUsers(getUsers().filter(u => u.rol === 'egresado'));
    toast({ title: status === 'approved' ? 'Usuario aprobado' : 'Usuario rechazado' });
  };
  
  const pendientes = users.filter(u => u.status === 'pending' && 
    (u.nombres.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())));
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Aprobar Usuarios</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de registro pendientes</p>
        </div>
        
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} 
            className="input-field pl-10" placeholder="Buscar por nombre o email..." />
        </div>
        
        {pendientes.length === 0 ? (
          <Card><p className="text-muted-foreground text-center py-8">No hay usuarios pendientes</p></Card>
        ) : (
          <div className="space-y-4">
            {pendientes.map(u => (
              <Card key={u.id}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{u.nombres} {u.apellidos}</p>
                    <p className="text-sm text-muted-foreground">{u.email} • {u.cedula}</p>
                    <p className="text-xs text-muted-foreground">{u.carrera} - {u.facultad}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(u.id, 'approved')} className="btn-success flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Aprobar
                    </button>
                    <button onClick={() => handleStatus(u.id, 'rejected')} className="btn-danger flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Rechazar
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CoordinadorAprobar;
