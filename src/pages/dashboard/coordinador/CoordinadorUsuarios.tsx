import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { getSession, getUsers, User } from '@/lib/storage';
import { Search, Filter, Briefcase, Building2, DollarSign, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/Modal';

const CoordinadorUsuarios = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLaboral, setFilterLaboral] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate('/login'); return; }
    setUsers(getUsers().filter(u => u.rol === 'egresado'));
  }, [navigate]);

  const session = getSession();
  if (!session) return null;

  const filtered = users.filter(u => 
    (filterStatus === 'all' || u.status === filterStatus) &&
    (filterLaboral === 'all' || u.estadoLaboral === filterLaboral) &&
    (u.nombres.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getEstadoLaboralLabel = (estado?: string) => {
    switch (estado) {
      case 'empleado': return 'Empleado';
      case 'desempleado': return 'Desempleado';
      case 'independiente': return 'Independiente';
      case 'estudiando': return 'Estudiando';
      default: return 'Sin especificar';
    }
  };

  const getEstadoLaboralBadge = (estado?: string) => {
    switch (estado) {
      case 'empleado': return 'badge-success';
      case 'desempleado': return 'badge-danger';
      case 'independiente': return 'badge-info';
      case 'estudiando': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const getSalarioRangoLabel = (rango?: string) => {
    switch (rango) {
      case 'menos-450': return 'Menos de $450';
      case '450-800': return '$450 - $800';
      case '800-1200': return '$800 - $1,200';
      case '1200-2000': return '$1,200 - $2,000';
      case '2000-3000': return '$2,000 - $3,000';
      case 'mas-3000': return 'Más de $3,000';
      case 'prefiero-no-decir': return 'Prefiere no decir';
      default: return '-';
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">Lista de egresados registrados</p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="input-field pl-10" 
              placeholder="Buscar por nombre o email..." 
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            className="input-field w-40"
          >
            <option value="all">Todos los estados</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
            <option value="rejected">Rechazados</option>
          </select>

          <select 
            value={filterLaboral} 
            onChange={e => setFilterLaboral(e.target.value)} 
            className="input-field w-48"
          >
            <option value="all">Estado laboral</option>
            <option value="empleado">Empleado</option>
            <option value="desempleado">Desempleado</option>
            <option value="independiente">Independiente</option>
            <option value="estudiando">Estudiando</option>
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
                <th>Estado Laboral</th>
                <th>Empresa</th>
                <th>Acciones</th>
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
                  <td>
                    <span className={`badge ${getEstadoLaboralBadge(u.estadoLaboral)}`}>
                      {getEstadoLaboralLabel(u.estadoLaboral)}
                    </span>
                  </td>
                  <td>{u.empresa || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(u)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de detalles */}
        {selectedUser && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Detalles del Egresado">
            <div className="space-y-4">
              {/* Información personal */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Información Personal</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium text-foreground">{selectedUser.nombres} {selectedUser.apellidos}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cédula:</span>
                    <p className="font-medium text-foreground">{selectedUser.cedula}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium text-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium text-foreground">{selectedUser.telefono}</p>
                  </div>
                </div>
              </div>

              {/* Información académica */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Información Académica</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Carrera:</span>
                    <p className="font-medium text-foreground">{selectedUser.carrera || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Facultad:</span>
                    <p className="font-medium text-foreground">{selectedUser.facultad || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Año de Graduación:</span>
                    <p className="font-medium text-foreground">{selectedUser.anioGraduacion || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Título:</span>
                    <p className="font-medium text-foreground">{selectedUser.tituloObtenido || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Información laboral */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Información Laboral
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Estado Laboral:</span>
                    <p className="font-medium text-foreground mt-1">
                      <span className={`badge ${getEstadoLaboralBadge(selectedUser.estadoLaboral)}`}>
                        {getEstadoLaboralLabel(selectedUser.estadoLaboral)}
                      </span>
                    </p>
                  </div>
                  
                  {(selectedUser.estadoLaboral === 'empleado' || selectedUser.estadoLaboral === 'independiente') && (
                    <>
                      <div>
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Empresa:
                        </span>
                        <p className="font-medium text-foreground">{selectedUser.empresa || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cargo:</span>
                        <p className="font-medium text-foreground">{selectedUser.cargo || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Rango Salarial:
                        </span>
                        <p className="font-medium text-foreground">{getSalarioRangoLabel(selectedUser.salarioRango)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Enlaces */}
              {(selectedUser.linkedin || selectedUser.portfolio) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Enlaces</h3>
                  <div className="space-y-2 text-sm">
                    {selectedUser.linkedin && (
                      <div>
                        <span className="text-muted-foreground">LinkedIn:</span>
                        <a 
                          href={selectedUser.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline block"
                        >
                          {selectedUser.linkedin}
                        </a>
                      </div>
                    )}
                    {selectedUser.portfolio && (
                      <div>
                        <span className="text-muted-foreground">Portfolio:</span>
                        <a 
                          href={selectedUser.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline block"
                        >
                          {selectedUser.portfolio}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default CoordinadorUsuarios;