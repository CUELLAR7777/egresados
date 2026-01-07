import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { getSession, getCapacitaciones, setCapacitaciones, generateId, Capacitacion } from '@/lib/storage';
import { Plus, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CoordinadorCapacitaciones = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caps, setCaps] = useState<Capacitacion[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', modalidad: 'virtual' as const, instructor: '', cupos: 30 });

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate('/login'); return; }
    setCaps(getCapacitaciones());
  }, [navigate]);

  const session = getSession();
  if (!session) return null;

  const create = () => {
    if (!form.titulo || !form.fechaInicio) { toast({ title: 'Completa los campos', variant: 'destructive' }); return; }
    const cap: Capacitacion = { id: generateId(), ...form, inscritos: [], activa: true };
    const all = [...getCapacitaciones(), cap];
    setCapacitaciones(all);
    setCaps(all);
    setShowCreate(false);
    setForm({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', modalidad: 'virtual', instructor: '', cupos: 30 });
    toast({ title: 'Capacitación creada' });
  };

  const del = (id: string) => {
    const all = getCapacitaciones().filter(c => c.id !== id);
    setCapacitaciones(all);
    setCaps(all);
    toast({ title: 'Capacitación eliminada' });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Capacitaciones</h1>
            <p className="text-muted-foreground">Gestiona los programas de formación</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Capacitación
          </button>
        </div>

        <div className="grid gap-4">
          {caps.map(c => (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{c.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{c.modalidad} • {c.inscritos.length}/{c.cupos} inscritos</p>
                </div>
                <button onClick={() => del(c.id)} className="btn-danger text-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nueva Capacitación">
          <div className="space-y-4">
            <input type="text" placeholder="Título" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} className="input-field" />
            <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} className="input-field" />
            <input type="text" placeholder="Instructor" value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} className="input-field" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={form.fechaInicio} onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))} className="input-field" />
              <input type="date" value={form.fechaFin} onChange={e => setForm(p => ({ ...p, fechaFin: e.target.value }))} className="input-field" />
            </div>
            <select value={form.modalidad} onChange={e => setForm(p => ({ ...p, modalidad: e.target.value as any }))} className="input-field">
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
              <option value="hibrida">Híbrida</option>
            </select>
            <input type="number" placeholder="Cupos" value={form.cupos} onChange={e => setForm(p => ({ ...p, cupos: +e.target.value }))} className="input-field" />
            <button onClick={create} className="btn-primary w-full">Crear Capacitación</button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CoordinadorCapacitaciones;
