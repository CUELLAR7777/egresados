import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, Session } from '@/lib/storage';
import logoUleam from '@/assets/logo-uleam.png';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Users,
  BarChart3,
  LogOut,
  Home,
  ClipboardList,
  BookOpen,
  Settings,
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  session: Session;
}

const Sidebar = ({ session }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };
  
  const egresadoLinks = [
    { path: '/dashboard/egresado', icon: Home, label: 'Inicio' },
    { path: '/dashboard/egresado/perfil', icon: User, label: 'Mi Perfil' },
    { path: '/dashboard/egresado/encuestas', icon: ClipboardList, label: 'Encuestas' },
    { path: '/dashboard/egresado/estado-laboral', icon: Briefcase, label: 'Estado Laboral' },
    { path: '/dashboard/egresado/capacitaciones', icon: BookOpen, label: 'Capacitaciones' },
  ];
  
  const coordinadorLinks = [
    { path: '/dashboard/coordinador', icon: Home, label: 'Inicio' },
    { path: '/dashboard/coordinador/usuarios', icon: Users, label: 'Usuarios' },
    { path: '/dashboard/coordinador/aprobar', icon: CheckCircle, label: 'Aprobar Usuarios' },
    { path: '/dashboard/coordinador/encuestas', icon: ClipboardList, label: 'Encuestas' },
    { path: '/dashboard/coordinador/capacitaciones', icon: GraduationCap, label: 'Capacitaciones' },
    { path: '/dashboard/coordinador/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  ];
  
  const links = session.rol === 'coordinador' ? coordinadorLinks : egresadoLinks;
  
  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-foreground rounded-lg p-1">
            <img src={logoUleam} alt="ULEAM" className="h-10 w-auto" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground">ULEAM</h2>
            <p className="text-xs text-sidebar-foreground/70">Seguimiento Egresados</p>
          </div>
        </div>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {session.nombres} {session.apellidos}
            </p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {session.rol}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full hover:bg-sidebar-accent/80"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
