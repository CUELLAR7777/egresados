// Validador de cédula ecuatoriana
export const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (!/^\d{10}$/.test(cedula)) return false;
  
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return false;
  
  const tercerDigito = parseInt(cedula[2]);
  if (tercerDigito > 5) return false;
  
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i]) * coeficientes[i];
    if (valor > 9) valor -= 9;
    suma += valor;
  }
  
  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[9]);
};

// Validar email (solo @gmail.com)
export const validarEmailGmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  return regex.test(email);
};

// Validar contraseña segura
export const validarPassword = (password: string): { valid: boolean; mensaje: string } => {
  if (password.length < 8) {
    return { valid: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, mensaje: 'La contraseña debe tener al menos una mayúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, mensaje: 'La contraseña debe tener al menos una minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, mensaje: 'La contraseña debe tener al menos un número' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, mensaje: 'La contraseña debe tener al menos un caracter especial' };
  }
  return { valid: true, mensaje: '' };
};

// Validar teléfono ecuatoriano
export const validarTelefonoEcuatoriano = (telefono: string): boolean => {
  // Acepta formatos: 09XXXXXXXX o +593XXXXXXXXX
  const regex = /^(09\d{8}|\+593\d{9})$/;
  return regex.test(telefono);
};

// Validar edad mínima (15 años)
export const validarEdadMinima = (fechaNacimiento: string, edadMinima: number = 15): boolean => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad >= edadMinima;
};

// Validar URL
export const validarURL = (url: string): boolean => {
  if (!url) return true; // URLs son opcionales
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar formulario de registro completo
export interface RegistroData {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  rol: string;
  carrera?: string;
  facultad?: string;
  anioGraduacion?: string;
  tituloObtenido?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const validarRegistro = (data: RegistroData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Cédula
  if (!data.cedula) {
    errors.cedula = 'La cédula es requerida';
  } else if (!validarCedulaEcuatoriana(data.cedula)) {
    errors.cedula = 'Cédula ecuatoriana inválida';
  }
  
  // Nombres y apellidos
  if (!data.nombres || data.nombres.trim().length < 2) {
    errors.nombres = 'Los nombres son requeridos (mínimo 2 caracteres)';
  }
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.apellidos = 'Los apellidos son requeridos (mínimo 2 caracteres)';
  }
  
  // Email
  if (!data.email) {
    errors.email = 'El email es requerido';
  } else if (!validarEmailGmail(data.email)) {
    errors.email = 'Solo se aceptan correos @gmail.com';
  }
  
  // Password
  if (!data.password) {
    errors.password = 'La contraseña es requerida';
  } else {
    const passResult = validarPassword(data.password);
    if (!passResult.valid) {
      errors.password = passResult.mensaje;
    }
  }
  
  // Confirmar password
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  // Teléfono
  if (!data.telefono) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!validarTelefonoEcuatoriano(data.telefono)) {
    errors.telefono = 'Formato de teléfono ecuatoriano inválido (09XXXXXXXX)';
  }
  
  // Fecha de nacimiento
  if (!data.fechaNacimiento) {
    errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
  } else if (!validarEdadMinima(data.fechaNacimiento)) {
    errors.fechaNacimiento = 'Debe tener al menos 15 años';
  }
  
  // Género
  if (!data.genero) {
    errors.genero = 'El género es requerido';
  }
  
  // Dirección
  if (!data.direccion || data.direccion.trim().length < 5) {
    errors.direccion = 'La dirección es requerida (mínimo 5 caracteres)';
  }
  
  // Ciudad y provincia
  if (!data.ciudad) {
    errors.ciudad = 'La ciudad es requerida';
  }
  if (!data.provincia) {
    errors.provincia = 'La provincia es requerida';
  }
  
  // Campos de egresado
  if (data.rol === 'egresado') {
    if (!data.carrera) {
      errors.carrera = 'La carrera es requerida';
    }
    if (!data.facultad) {
      errors.facultad = 'La facultad es requerida';
    }
    if (!data.anioGraduacion) {
      errors.anioGraduacion = 'El año de graduación es requerido';
    }
    if (!data.tituloObtenido) {
      errors.tituloObtenido = 'El título obtenido es requerido';
    }
    
    // URLs opcionales pero deben ser válidas
    if (data.linkedin && !validarURL(data.linkedin)) {
      errors.linkedin = 'URL de LinkedIn inválida';
    }
    if (data.portfolio && !validarURL(data.portfolio)) {
      errors.portfolio = 'URL de portfolio inválida';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// Provincias de Ecuador
export const provinciasEcuador = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
  'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja',
  'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza',
  'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos',
  'Tungurahua', 'Zamora Chinchipe'
];

// Facultades ULEAM
export const facultadesULEAM = [
  'Facultad de Ciencias Administrativas',
  'Facultad de Ciencias de la Comunicación',
  'Facultad de Ciencias de la Educación',
  'Facultad de Ciencias Económicas',
  'Facultad de Ciencias Informáticas',
  'Facultad de Contabilidad y Auditoría',
  'Facultad de Derecho',
  'Facultad de Enfermería',
  'Facultad de Hotelería y Turismo',
  'Facultad de Ingeniería',
  'Facultad de Medicina',
  'Facultad de Odontología',
  'Facultad de Trabajo Social'
];
