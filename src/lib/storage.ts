// Claves de localStorage
const STORAGE_KEYS = {
  USERS: 'sg_users',
  SURVEYS: 'sg_surveys',
  RESPONSES: 'sg_responses',
  CAPACITACIONES: 'sg_capacitaciones',
  SESSION: 'sg_session',
};

// Tipos
export interface User {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  rol: 'egresado' | 'coordinador';
  status: 'pending' | 'approved' | 'rejected';
  fechaRegistro: string;
  // Campos adicionales egresado
  carrera?: string;
  facultad?: string;
  anioGraduacion?: string;
  tituloObtenido?: string;
  linkedin?: string;
  portfolio?: string;
  estadoLaboral?: 'empleado' | 'desempleado' | 'independiente' | 'estudiando';
  empresa?: string;
  cargo?: string;
  salarioRango?: string;
}

export interface Survey {
  id: string;
  titulo: string;
  descripcion: string;
  preguntas: SurveyQuestion[];
  fechaCreacion: string;
  activa: boolean;
}

export interface SurveyQuestion {
  id: string;
  texto: string;
  tipo: 'texto' | 'opcion' | 'multiple' | 'escala';
  opciones?: string[];
  requerida: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  respuestas: { questionId: string; valor: string | string[] }[];
  fechaRespuesta: string;
}

export interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad: 'presencial' | 'virtual' | 'hibrida';
  instructor: string;
  cupos: number;
  inscritos: string[];
  activa: boolean;
}

export interface Session {
  userId: string;
  email: string;
  rol: 'egresado' | 'coordinador';
  nombres: string;
  apellidos: string;
}

// Funciones de localStorage
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const setUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getUserByCedula = (cedula: string): User | undefined => {
  return getUsers().find(u => u.cedula === cedula);
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

export const updateUser = (id: string, updates: Partial<User>): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    setUsers(users);
  }
};

export const deleteUser = (id: string): void => {
  const users = getUsers().filter(u => u.id !== id);
  setUsers(users);
};

// Encuestas
export const getSurveys = (): Survey[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
  return data ? JSON.parse(data) : [];
};

export const setSurveys = (surveys: Survey[]): void => {
  localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
};

export const addSurvey = (survey: Survey): void => {
  const surveys = getSurveys();
  surveys.push(survey);
  setSurveys(surveys);
};

export const updateSurvey = (id: string, updates: Partial<Survey>): void => {
  const surveys = getSurveys();
  const index = surveys.findIndex(s => s.id === id);
  if (index !== -1) {
    surveys[index] = { ...surveys[index], ...updates };
    setSurveys(surveys);
  }
};

export const deleteSurvey = (id: string): void => {
  const surveys = getSurveys().filter(s => s.id !== id);
  setSurveys(surveys);
};

// Respuestas
export const getResponses = (): SurveyResponse[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
  return data ? JSON.parse(data) : [];
};

export const setResponses = (responses: SurveyResponse[]): void => {
  localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
};

export const addResponse = (response: SurveyResponse): void => {
  const responses = getResponses();
  responses.push(response);
  setResponses(responses);
};

export const getResponsesBySurvey = (surveyId: string): SurveyResponse[] => {
  return getResponses().filter(r => r.surveyId === surveyId);
};

export const getResponsesByUser = (userId: string): SurveyResponse[] => {
  return getResponses().filter(r => r.userId === userId);
};

// Capacitaciones
export const getCapacitaciones = (): Capacitacion[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CAPACITACIONES);
  return data ? JSON.parse(data) : [];
};

export const setCapacitaciones = (capacitaciones: Capacitacion[]): void => {
  localStorage.setItem(STORAGE_KEYS.CAPACITACIONES, JSON.stringify(capacitaciones));
};

export const addCapacitacion = (capacitacion: Capacitacion): void => {
  const capacitaciones = getCapacitaciones();
  capacitaciones.push(capacitacion);
  setCapacitaciones(capacitaciones);
};

export const updateCapacitacion = (id: string, updates: Partial<Capacitacion>): void => {
  const capacitaciones = getCapacitaciones();
  const index = capacitaciones.findIndex(c => c.id === id);
  if (index !== -1) {
    capacitaciones[index] = { ...capacitaciones[index], ...updates };
    setCapacitaciones(capacitaciones);
  }
};

export const deleteCapacitacion = (id: string): void => {
  const capacitaciones = getCapacitaciones().filter(c => c.id !== id);
  setCapacitaciones(capacitaciones);
};

export const inscribirCapacitacion = (capacitacionId: string, userId: string): boolean => {
  const capacitaciones = getCapacitaciones();
  const index = capacitaciones.findIndex(c => c.id === capacitacionId);
  if (index !== -1) {
    const cap = capacitaciones[index];
    if (cap.inscritos.length < cap.cupos && !cap.inscritos.includes(userId)) {
      cap.inscritos.push(userId);
      setCapacitaciones(capacitaciones);
      return true;
    }
  }
  return false;
};

// Sesión
export const getSession = (): Session | null => {
  const data = sessionStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
};

export const setSession = (session: Session): void => {
  sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Inicializar datos de prueba si no existen
export const initializeData = (): void => {
  const users = getUsers();
  
  // Crear coordinador por defecto si no existe
  if (!getUserByEmail('admin@gmail.com')) {
    const defaultCoordinator: User = {
      id: 'coord-001',
      cedula: '1234567890',
      nombres: 'Administrador',
      apellidos: 'Sistema',
      email: 'admin@gmail.com',
      password: 'Admin123!',
      telefono: '0991234567',
      fechaNacimiento: '1980-01-01',
      genero: 'masculino',
      direccion: 'ULEAM Campus',
      ciudad: 'Manta',
      provincia: 'Manabí',
      rol: 'coordinador',
      status: 'approved',
      fechaRegistro: new Date().toISOString(),
    };
    addUser(defaultCoordinator);
  }

  // Crear egresado de ejemplo si no existe
  if (!getUserByEmail('egresado.demo@gmail.com')) {
    const defaultEgresado: User = {
      id: 'egresado-001',
      cedula: '0987654321',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'egresado.demo@gmail.com',
      password: 'Egresado123!',
      telefono: '0987654321',
      fechaNacimiento: '1995-05-15',
      genero: 'masculino',
      direccion: 'Av. Principal 123',
      ciudad: 'Manta',
      provincia: 'Manabí',
      rol: 'egresado',
      status: 'approved',
      fechaRegistro: new Date().toISOString(),
      carrera: 'Ingeniería en Sistemas',
      facultad: 'Facultad de Ciencias Informáticas',
      anioGraduacion: '2020',
      tituloObtenido: 'Ingeniero en Sistemas',
      estadoLaboral: 'empleado',
      empresa: 'Tech Solutions',
      cargo: 'Desarrollador Full Stack',
      salarioRango: '1000-2000',
    };
    addUser(defaultEgresado);
  }
};

// Generar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
