# Sistema de Seguimiento a Egresados - ULEAM

Plataforma web desarrollada para la **Universidad Laica Eloy Alfaro de Manabí (ULEAM)** que permite el seguimiento, gestión y vinculación con los egresados de la institución.

## 📋 Descripción del Proyecto

Este sistema facilita la comunicación entre la universidad y sus egresados, permitiendo:

- **Para Egresados:**
  - Mantener actualizado su perfil profesional
  - Participar en encuestas de empleabilidad
  - Inscribirse en capacitaciones y programas de formación continua
  - Actualizar su estado laboral
  - Acceder a oportunidades exclusivas

- **Para Coordinadores:**
  - Aprobar/rechazar solicitudes de registro de egresados
  - Crear y gestionar encuestas
  - Visualizar respuestas de encuestas en detalle
  - Gestionar capacitaciones y programas de formación
  - Generar estadísticas y reportes exportables
  - Administrar usuarios del sistema

## 🚀 Tecnologías Utilizadas

### Frontend Core
- **React 18.3.1** - Biblioteca de JavaScript para construir interfaces de usuario
  - Uso: Componentes funcionales, hooks (`useState`, `useEffect`), gestión de estado
  - Ubicación: Toda la aplicación (`src/`)

- **TypeScript 5.8.3** - Superset tipado de JavaScript
  - Uso: Tipado estático, interfaces, type safety en todo el proyecto
  - Ubicación: Todos los archivos `.tsx` y `.ts`

- **Vite 5.4.19** - Herramienta de construcción y desarrollo
  - Uso: Bundler, servidor de desarrollo, build optimizado
  - Ubicación: Configuración en `vite.config.ts`, scripts en `package.json`

### Routing y Navegación
- **React Router DOM 6.30.1** - Enrutamiento del lado del cliente
  - Uso: Navegación entre páginas, rutas protegidas, parámetros de URL
  - Ubicación: 
    - Configuración de rutas: `src/App.tsx`
    - Rutas protegidas: `src/components/ProtectedRoute.tsx`
    - Navegación: Todos los componentes de páginas

### Estilos y UI
- **Tailwind CSS 3.4.17** - Framework de CSS utility-first
  - Uso: Estilos responsive, sistema de diseño, temas
  - Ubicación: Clases en todos los componentes, configuración en `tailwind.config.ts`

- **shadcn/ui** - Componentes de UI construidos sobre Radix UI
  - Uso: Componentes reutilizables (botones, modales, formularios, tablas, etc.)
  - Ubicación: `src/components/ui/`

- **Radix UI** - Biblioteca de componentes accesibles y sin estilos
  - Uso: Componentes base para dialogs, dropdowns, toasts, tooltips, etc.
  - Ubicación: Importado en componentes de `src/components/ui/`

- **Lucide React 0.462.0** - Biblioteca de iconos
  - Uso: Iconos SVG en toda la interfaz (botones, cards, navegación)
  - Ubicación: Importado en múltiples componentes

### Gestión de Estado y Datos
- **localStorage/sessionStorage** - Almacenamiento del lado del cliente
  - Uso: Persistencia de usuarios, encuestas, respuestas, capacitaciones y sesiones
  - Ubicación: `src/lib/storage.ts`

- **TanStack Query 5.83.0** - Biblioteca para gestión de estado del servidor
  - Uso: Caché, sincronización y actualización de datos
  - Ubicación: Configuración en `src/App.tsx`

### Formularios y Validación
- **React Hook Form 7.61.1** - Biblioteca para manejo de formularios
  - Uso: Gestión de formularios, validación, performance optimizado
  - Ubicación: Componentes de registro y perfiles

- **Zod 3.25.76** - Biblioteca de validación TypeScript-first
  - Uso: Validación de esquemas, tipos inferidos
  - Ubicación: `src/lib/validators.ts`

- **@hookform/resolvers 3.10.0** - Resolvers para React Hook Form
  - Uso: Integración de Zod con React Hook Form
  - Ubicación: Formularios con validación

### Utilidades y Otros
- **date-fns 3.6.0** - Biblioteca de utilidades para fechas
  - Uso: Formateo y manipulación de fechas
  - Ubicación: Componentes que manejan fechas

- **clsx & tailwind-merge** - Utilidades para manejo de clases CSS
  - Uso: Combinar clases de Tailwind dinámicamente
  - Ubicación: `src/lib/utils.ts`

- **Sonner 1.7.4** - Sistema de notificaciones toast
  - Uso: Notificaciones elegantes y accesibles
  - Ubicación: Configurado en `src/App.tsx`, usado con `useToast` hook

### Desarrollo
- **ESLint 9.32.0** - Linter para JavaScript/TypeScript
  - Uso: Detección de errores, mantenimiento de código consistente
  - Ubicación: Configuración en `eslint.config.js`

- **TypeScript ESLint** - Linter específico para TypeScript
  - Uso: Reglas específicas de TypeScript
  - Ubicación: Configuración en `eslint.config.js`

- **PostCSS & Autoprefixer** - Procesamiento de CSS
  - Uso: Transformación de CSS, compatibilidad con navegadores
  - Ubicación: `postcss.config.js`

## 📁 Estructura del Proyecto

```
legacy-reborn/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de shadcn/ui
│   │   ├── Card.tsx        # Componente de tarjeta
│   │   ├── Header.tsx      # Encabezado de la aplicación
│   │   ├── Footer.tsx      # Pie de página
│   │   ├── Sidebar.tsx     # Barra lateral de navegación
│   │   ├── Modal.tsx       # Componente modal
│   │   └── ProtectedRoute.tsx  # Ruta protegida por rol
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Index.tsx       # Página de inicio
│   │   ├── Login.tsx       # Página de inicio de sesión
│   │   ├── Register.tsx    # Página de registro
│   │   └── dashboard/
│   │       ├── egresado/   # Páginas para egresados
│   │       │   ├── EgresadoDashboard.tsx
│   │       │   ├── EgresadoPerfil.tsx
│   │       │   ├── EgresadoEncuestas.tsx
│   │       │   ├── EgresadoEstadoLaboral.tsx
│   │       │   └── EgresadoCapacitaciones.tsx
│   │       └── coordinador/  # Páginas para coordinadores
│   │           ├── CoordinadorDashboard.tsx
│   │           ├── CoordinadorAprobar.tsx
│   │           ├── CoordinadorUsuarios.tsx
│   │           ├── CoordinadorEncuestas.tsx
│   │           ├── CoordinadorCapacitaciones.tsx
│   │           └── CoordinadorEstadisticas.tsx
│   ├── lib/                # Utilidades y helpers
│   │   ├── storage.ts      # Gestión de localStorage/sessionStorage
│   │   ├── validators.ts   # Validaciones con Zod
│   │   ├── utils.ts        # Funciones utilitarias
│   │   └── export.ts       # Funciones de exportación (CSV, JSON, XML)
│   ├── hooks/              # Custom hooks
│   │   ├── use-toast.ts    # Hook para notificaciones
│   │   └── use-mobile.tsx  # Hook para detectar dispositivos móviles
│   ├── assets/             # Recursos estáticos
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos públicos
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración de TypeScript
├── vite.config.ts          # Configuración de Vite
├── tailwind.config.ts      # Configuración de Tailwind CSS
└── README.md               # Este archivo
```

## 🎯 Funcionalidades Principales

### Módulo de Egresados
- **Dashboard**: Vista general con estadísticas y resumen
- **Perfil**: Gestión y actualización de información personal y profesional
- **Encuestas**: Visualización y respuesta de encuestas activas
- **Estado Laboral**: Actualización de información laboral (empleo, empresa, cargo, salario)
- **Capacitaciones**: Visualización e inscripción en programas de formación

### Módulo de Coordinador
- **Dashboard**: Panel de control con métricas generales
- **Aprobar Usuarios**: Gestión de solicitudes de registro (aprobar/rechazar)
- **Usuarios**: Listado y búsqueda de egresados registrados
- **Encuestas**: Creación, gestión y visualización de respuestas detalladas
- **Capacitaciones**: Creación y administración de programas de capacitación
- **Estadísticas**: Reportes y exportación de datos (CSV, JSON, XML)

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js (versión 18 o superior)
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone <url-del-repositorio>
   cd legacy-reborn
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run build:dev` - Construye en modo desarrollo
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 🔐 Credenciales de Prueba

El sistema inicializa con usuarios de prueba por defecto:

**Coordinador:**
- Email: `admin@gmail.com`
- Contraseña: `Admin123!`

**Egresado:**
- Email: `egresado.demo@gmail.com`
- Contraseña: `Egresado123!`

## 💾 Almacenamiento de Datos

El sistema utiliza **localStorage** y **sessionStorage** del navegador para persistencia:

- **localStorage**: Usuarios, encuestas, respuestas, capacitaciones
- **sessionStorage**: Sesión de usuario activa

**Nota**: Los datos se almacenan localmente en el navegador. Para producción, se recomienda migrar a un backend con base de datos.

## 🌐 Navegación y Rutas

### Rutas Públicas
- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de egresados

### Rutas Protegidas - Egresado
- `/dashboard/egresado` - Dashboard principal
- `/dashboard/egresado/perfil` - Perfil del egresado
- `/dashboard/egresado/encuestas` - Encuestas disponibles
- `/dashboard/egresado/estado-laboral` - Estado laboral
- `/dashboard/egresado/capacitaciones` - Capacitaciones

### Rutas Protegidas - Coordinador
- `/dashboard/coordinador` - Dashboard principal
- `/dashboard/coordinador/aprobar` - Aprobar usuarios
- `/dashboard/coordinador/usuarios` - Gestión de usuarios
- `/dashboard/coordinador/encuestas` - Gestión de encuestas
- `/dashboard/coordinador/capacitaciones` - Gestión de capacitaciones
- `/dashboard/coordinador/estadisticas` - Estadísticas y reportes

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño consistente basado en:
- **Colores**: Paleta personalizada configurada en Tailwind
- **Tipografía**: Sistema de fuentes responsive
- **Componentes**: Biblioteca shadcn/ui para consistencia
- **Espaciado**: Sistema de espaciado de Tailwind
- **Breakpoints**: Diseño responsive (sm, md, lg, xl)

## 📝 Notas de Desarrollo

- El proyecto está completamente tipado con TypeScript
- Se utiliza React Hooks para gestión de estado local
- Las rutas están protegidas por rol mediante `ProtectedRoute`
- Los datos se validan usando Zod antes de guardar
- Se implementan hooks personalizados para reutilización de lógica
- El código sigue las mejores prácticas de React y TypeScript

## 🔄 Posibles Mejoras Futuras

- [ ] Migración a backend con base de datos (PostgreSQL, MongoDB, etc.)
- [ ] Autenticación con JWT
- [ ] Notificaciones por email
- [ ] Sistema de búsqueda avanzada
- [ ] Dashboard con gráficos interactivos
- [ ] Integración con APIs externas (LinkedIn, etc.)
- [ ] Modo oscuro/claro
- [ ] Aplicación móvil (React Native)
- [ ] Internacionalización (i18n)

## 📄 Licencia

Este proyecto es propiedad de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

## 👥 Desarrollo

Sistema desarrollado para la gestión y seguimiento de egresados de la ULEAM.

---

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**  
Sistema de Seguimiento a Egresados

