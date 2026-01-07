const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Universidad Laica Eloy Alfaro de Manabí
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sistema de Seguimiento a Egresados
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="https://www.uleam.edu.ec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              ULEAM
            </a>
            <span>|</span>
            <span>Manta, Ecuador</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
