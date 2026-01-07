import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import logoUleam from '@/assets/logo-uleam.png';
import { GraduationCap, Users, BarChart3, ClipboardList, ArrowRight } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Seguimiento de Egresados',
      description: 'Mantén conexión con la universidad y accede a oportunidades exclusivas.',
    },
    {
      icon: ClipboardList,
      title: 'Encuestas de Empleabilidad',
      description: 'Participa en encuestas que ayudan a mejorar la calidad educativa.',
    },
    {
      icon: Users,
      title: 'Red de Profesionales',
      description: 'Conecta con otros egresados y amplía tu red profesional.',
    },
    {
      icon: BarChart3,
      title: 'Capacitaciones',
      description: 'Accede a programas de formación continua y actualización.',
    },
  ];

  return (
    <div className="page-container flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Sistema de Seguimiento a Egresados
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl">
                Plataforma oficial de la Universidad Laica Eloy Alfaro de Manabí 
                para el seguimiento y vinculación con nuestros egresados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-card text-primary px-6 py-3 rounded-lg font-semibold hover:bg-card/90 transition-colors"
                >
                  Registrarse como Egresado
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-card rounded-2xl p-6 shadow-xl">
                <img 
                  src={logoUleam} 
                  alt="Universidad Laica Eloy Alfaro de Manabí" 
                  className="w-48 md:w-64 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              ¿Por qué registrarte?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Forma parte de nuestra comunidad de egresados y accede a beneficios exclusivos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-lg p-6 card-shadow border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Eres egresado de ULEAM?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Regístrate ahora y mantén actualizados tus datos para recibir información 
            sobre oportunidades laborales y capacitaciones.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 btn-primary text-lg px-8 py-3"
          >
            Comenzar Registro
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
