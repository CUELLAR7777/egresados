import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
// Egresado
import EgresadoDashboard from "./pages/dashboard/egresado/EgresadoDashboard";
import EgresadoPerfil from "./pages/dashboard/egresado/EgresadoPerfil";
import EgresadoEncuestas from "./pages/dashboard/egresado/EgresadoEncuestas";
import EgresadoEstadoLaboral from "./pages/dashboard/egresado/EgresadoEstadoLaboral";
import EgresadoCapacitaciones from "./pages/dashboard/egresado/EgresadoCapacitaciones";
// Coordinador
import CoordinadorDashboard from "./pages/dashboard/coordinador/CoordinadorDashboard";
import CoordinadorAprobar from "./pages/dashboard/coordinador/CoordinadorAprobar";
import CoordinadorUsuarios from "./pages/dashboard/coordinador/CoordinadorUsuarios";
import CoordinadorEncuestas from "./pages/dashboard/coordinador/CoordinadorEncuestas";
import CoordinadorCapacitaciones from "./pages/dashboard/coordinador/CoordinadorCapacitaciones";
import CoordinadorEstadisticas from "./pages/dashboard/coordinador/CoordinadorEstadisticas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas Egresado */}
          <Route path="/dashboard/egresado" element={
            <ProtectedRoute allowedRoles={['egresado']}><EgresadoDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/egresado/perfil" element={
            <ProtectedRoute allowedRoles={['egresado']}><EgresadoPerfil /></ProtectedRoute>
          } />
          <Route path="/dashboard/egresado/encuestas" element={
            <ProtectedRoute allowedRoles={['egresado']}><EgresadoEncuestas /></ProtectedRoute>
          } />
          <Route path="/dashboard/egresado/estado-laboral" element={
            <ProtectedRoute allowedRoles={['egresado']}><EgresadoEstadoLaboral /></ProtectedRoute>
          } />
          <Route path="/dashboard/egresado/capacitaciones" element={
            <ProtectedRoute allowedRoles={['egresado']}><EgresadoCapacitaciones /></ProtectedRoute>
          } />
          
          {/* Rutas Coordinador */}
          <Route path="/dashboard/coordinador" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/coordinador/aprobar" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorAprobar /></ProtectedRoute>
          } />
          <Route path="/dashboard/coordinador/usuarios" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorUsuarios /></ProtectedRoute>
          } />
          <Route path="/dashboard/coordinador/encuestas" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorEncuestas /></ProtectedRoute>
          } />
          <Route path="/dashboard/coordinador/capacitaciones" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorCapacitaciones /></ProtectedRoute>
          } />
          <Route path="/dashboard/coordinador/estadisticas" element={
            <ProtectedRoute allowedRoles={['coordinador']}><CoordinadorEstadisticas /></ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
