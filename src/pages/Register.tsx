import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  addUser, 
  getUserByEmail, 
  getUserByCedula, 
  generateId,
  getSession
} from '@/lib/storage';
import { 
  validarRegistro, 
  provinciasEcuador, 
  facultadesULEAM,
  RegistroData 
} from '@/lib/validators';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<RegistroData>({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    rol: 'egresado',
    carrera: '',
    facultad: '',
    anioGraduacion: '',
    tituloObtenido: '',
    linkedin: '',
    portfolio: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const session = getSession();
    if (session) {
      const redirectPath = session.rol === 'coordinador' 
        ? '/dashboard/coordinador' 
        : '/dashboard/egresado';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Validar formulario
      const validation = validarRegistro(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }
      
      // Verificar duplicados
      if (getUserByEmail(formData.email)) {
        setErrors({ email: 'Ya existe una cuenta con este correo electrónico' });
        setLoading(false);
        return;
      }
      
      if (getUserByCedula(formData.cedula)) {
        setErrors({ cedula: 'Ya existe una cuenta con esta cédula' });
        setLoading(false);
        return;
      }
      
      // Crear usuario
      const newUser = {
        id: generateId(),
        cedula: formData.cedula,
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        direccion: formData.direccion.trim(),
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        rol: formData.rol as 'egresado' | 'coordinador',
        status: formData.rol === 'coordinador' ? 'approved' : 'pending' as 'pending' | 'approved',
        fechaRegistro: new Date().toISOString(),
        // Campos de egresado
        carrera: formData.carrera,
        facultad: formData.facultad,
        anioGraduacion: formData.anioGraduacion,
        tituloObtenido: formData.tituloObtenido,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
        estadoLaboral: undefined,
        empresa: undefined,
        cargo: undefined,
        salarioRango: undefined,
      };
      
      addUser(newUser);
      
      setSuccess(true);
      toast({
        title: 'Registro exitoso',
        description: formData.rol === 'egresado' 
          ? 'Tu cuenta está pendiente de aprobación' 
          : 'Ya puedes iniciar sesión',
      });
      
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al registrar. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="page-container flex flex-col min-h-screen">
        <Header showNav={false} />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg card-shadow border border-border p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                ¡Registro Exitoso!
              </h1>
              {formData.rol === 'egresado' ? (
                <p className="text-muted-foreground mb-6">
                  Tu cuenta ha sido creada y está pendiente de aprobación. 
                  Recibirás acceso una vez que un coordinador apruebe tu solicitud.
                </p>
              ) : (
                <p className="text-muted-foreground mb-6">
                  Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.
                </p>
              )}
              <Link
                to="/login"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <div className="page-container flex flex-col min-h-screen">
      <Header showNav={false} />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-lg card-shadow border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Registro de Usuario</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Complete todos los campos requeridos
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tipo de Usuario */}
              <div className="bg-muted rounded-lg p-4">
                <label className="label-field mb-3">Tipo de Usuario</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rol"
                      value="egresado"
                      checked={formData.rol === 'egresado'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-foreground">Egresado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rol"
                      value="coordinador"
                      checked={formData.rol === 'coordinador'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-foreground">Coordinador</span>
                  </label>
                </div>
              </div>
              
              {/* Datos Personales */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Datos Personales
                </h2>
                <div className="form-grid">
                  <div>
                    <label htmlFor="cedula" className="label-field">Cédula *</label>
                    <input
                      type="text"
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      className={`input-field ${errors.cedula ? 'border-destructive' : ''}`}
                      placeholder="1234567890"
                      maxLength={10}
                    />
                    {errors.cedula && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.cedula}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="genero" className="label-field">Género *</label>
                    <select
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className={`input-field ${errors.genero ? 'border-destructive' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.genero && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.genero}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="nombres" className="label-field">Nombres *</label>
                    <input
                      type="text"
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      className={`input-field ${errors.nombres ? 'border-destructive' : ''}`}
                      placeholder="Juan Carlos"
                    />
                    {errors.nombres && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.nombres}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="apellidos" className="label-field">Apellidos *</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className={`input-field ${errors.apellidos ? 'border-destructive' : ''}`}
                      placeholder="Pérez García"
                    />
                    {errors.apellidos && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.apellidos}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="fechaNacimiento" className="label-field">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className={`input-field ${errors.fechaNacimiento ? 'border-destructive' : ''}`}
                    />
                    {errors.fechaNacimiento && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fechaNacimiento}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="telefono" className="label-field">Teléfono *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`input-field ${errors.telefono ? 'border-destructive' : ''}`}
                      placeholder="0991234567"
                    />
                    {errors.telefono && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Ubicación */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Ubicación
                </h2>
                <div className="form-grid">
                  <div className="md:col-span-2">
                    <label htmlFor="direccion" className="label-field">Dirección *</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className={`input-field ${errors.direccion ? 'border-destructive' : ''}`}
                      placeholder="Av. Principal y Calle Secundaria"
                    />
                    {errors.direccion && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.direccion}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="provincia" className="label-field">Provincia *</label>
                    <select
                      id="provincia"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      className={`input-field ${errors.provincia ? 'border-destructive' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      {provinciasEcuador.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                    {errors.provincia && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.provincia}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ciudad" className="label-field">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className={`input-field ${errors.ciudad ? 'border-destructive' : ''}`}
                      placeholder="Manta"
                    />
                    {errors.ciudad && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.ciudad}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Datos Académicos (solo egresados) */}
              {formData.rol === 'egresado' && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Datos Académicos
                  </h2>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="facultad" className="label-field">Facultad *</label>
                      <select
                        id="facultad"
                        name="facultad"
                        value={formData.facultad}
                        onChange={handleChange}
                        className={`input-field ${errors.facultad ? 'border-destructive' : ''}`}
                      >
                        <option value="">Seleccionar</option>
                        {facultadesULEAM.map(fac => (
                          <option key={fac} value={fac}>{fac}</option>
                        ))}
                      </select>
                      {errors.facultad && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.facultad}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="carrera" className="label-field">Carrera *</label>
                      <input
                        type="text"
                        id="carrera"
                        name="carrera"
                        value={formData.carrera}
                        onChange={handleChange}
                        className={`input-field ${errors.carrera ? 'border-destructive' : ''}`}
                        placeholder="Ingeniería en Sistemas"
                      />
                      {errors.carrera && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.carrera}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="tituloObtenido" className="label-field">Título Obtenido *</label>
                      <input
                        type="text"
                        id="tituloObtenido"
                        name="tituloObtenido"
                        value={formData.tituloObtenido}
                        onChange={handleChange}
                        className={`input-field ${errors.tituloObtenido ? 'border-destructive' : ''}`}
                        placeholder="Ingeniero en Sistemas Informáticos"
                      />
                      {errors.tituloObtenido && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.tituloObtenido}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="anioGraduacion" className="label-field">Año de Graduación *</label>
                      <select
                        id="anioGraduacion"
                        name="anioGraduacion"
                        value={formData.anioGraduacion}
                        onChange={handleChange}
                        className={`input-field ${errors.anioGraduacion ? 'border-destructive' : ''}`}
                      >
                        <option value="">Seleccionar</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.anioGraduacion && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.anioGraduacion}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="linkedin" className="label-field">LinkedIn (opcional)</label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className={`input-field ${errors.linkedin ? 'border-destructive' : ''}`}
                        placeholder="https://linkedin.com/in/usuario"
                      />
                      {errors.linkedin && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.linkedin}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="portfolio" className="label-field">Portfolio (opcional)</label>
                      <input
                        type="url"
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className={`input-field ${errors.portfolio ? 'border-destructive' : ''}`}
                        placeholder="https://miportfolio.com"
                      />
                      {errors.portfolio && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.portfolio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Credenciales */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  Credenciales de Acceso
                </h2>
                <div className="form-grid">
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="label-field">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-destructive' : ''}`}
                      placeholder="correo@gmail.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Solo se aceptan correos @gmail.com
                    </p>
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="label-field">Contraseña *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input-field pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 8 caracteres, mayúscula, minúscula, número y especial
                    </p>
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="label-field">Confirmar Contraseña *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`input-field pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Iniciar Sesión
                  </Link>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 px-8 flex items-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Registrarse
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
