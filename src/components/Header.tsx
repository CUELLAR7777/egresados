import { Link, useLocation } from 'react-router-dom';
import logoUleam from '@/assets/logo-uleam.png';

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUleam} alt="ULEAM Logo" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary">Sistema de Seguimiento</h1>
              <p className="text-xs text-muted-foreground">Egresados ULEAM</p>
            </div>
          </Link>
          
          {showNav && (
            <nav className="flex items-center gap-2">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/login')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/register')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Registrarse
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
