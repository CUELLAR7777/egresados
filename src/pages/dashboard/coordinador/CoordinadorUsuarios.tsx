import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, User } from '@/lib/storage';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoordinadorUsuarios = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate('/login'); return; }
    setUsers(getUsers().filter(u => u.rol === 'egresado'));
  }, [navigate]);

  const session = getSession();
  if (!session) return null;

  const filtered = users.filter(u => 
    (filterStatus === 'all' || u.status === filterStatus) &&
    (u.nombres.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">Lista de egresados registrados</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Buscar..." />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-40">
            <option value="all">Todos</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Carrera</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td className="font-medium">{u.nombres} {u.apellidos}</td>
                  <td>{u.email}</td>
                  <td>{u.carrera || '-'}</td>
                  <td>
                    <span className={`badge ${u.status === 'approved' ? 'badge-success' : u.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {u.status === 'approved' ? 'Aprobado' : u.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CoordinadorUsuarios;
