import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { getSession, getUsers, getSurveys, setSurveys, getResponses, generateId, Survey, SurveyQuestion } from '@/lib/storage';
import { Plus, Trash2, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, exportToJSON, prepareResponsesForExport } from '@/lib/export';

const CoordinadorEncuestas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [surveys, setSurveysState] = useState<Survey[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showResponses, setShowResponses] = useState<string | null>(null);
  const [newSurvey, setNewSurvey] = useState({ titulo: '', descripcion: '', preguntas: [] as SurveyQuestion[] });
  const [newQuestion, setNewQuestion] = useState({ texto: '', tipo: 'texto' as 'texto' | 'opcion' | 'multiple' | 'escala', opciones: '', requerida: true });

  useEffect(() => {
    const session = getSession();
    if (!session) { 
      navigate('/login'); 
      return; 
    }
    setSurveysState(getSurveys());
  }, [navigate]);

  const session = getSession();
  if (!session) return null;

  const addQuestion = () => {
    if (!newQuestion.texto) return;
    const q: SurveyQuestion = {
      id: generateId(),
      texto: newQuestion.texto,
      tipo: newQuestion.tipo,
      opciones: newQuestion.tipo !== 'texto' && newQuestion.tipo !== 'escala' ? newQuestion.opciones.split(',').map(o => o.trim()) : undefined,
      requerida: newQuestion.requerida
    };
    setNewSurvey(prev => ({ ...prev, preguntas: [...prev.preguntas, q] }));
    setNewQuestion({ texto: '', tipo: 'texto', opciones: '', requerida: true });
  };

  const createSurvey = () => {
    if (!newSurvey.titulo || newSurvey.preguntas.length === 0) {
      toast({ title: 'Error', description: 'Agrega título y al menos una pregunta', variant: 'destructive' });
      return;
    }
    const survey: Survey = { id: generateId(), ...newSurvey, fechaCreacion: new Date().toISOString(), activa: true };
    const all = [...getSurveys(), survey];
    setSurveys(all);
    setSurveysState(all);
    setShowCreate(false);
    setNewSurvey({ titulo: '', descripcion: '', preguntas: [] });
    toast({ title: 'Encuesta creada' });
  };

  const deleteSurvey = (id: string) => {
    const all = getSurveys().filter(s => s.id !== id);
    setSurveys(all);
    setSurveysState(all);
    toast({ title: 'Encuesta eliminada' });
  };

  const responses = getResponses();
  const users = getUsers();

  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      <main className="dashboard-content">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Encuestas</h1>
            <p className="text-muted-foreground">Gestiona las encuestas del sistema</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Encuesta
          </button>
        </div>

        <div className="grid gap-4">
          {surveys.map(s => (
            <Card key={s.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{s.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{s.preguntas.length} preguntas • {responses.filter(r => r.surveyId === s.id).length} respuestas</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowResponses(s.id)} className="btn-secondary text-sm"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => exportToCSV(prepareResponsesForExport(responses.filter(r => r.surveyId === s.id), [s], users), `encuesta-${s.id}`)} className="btn-secondary text-sm"><Download className="w-4 h-4" /></button>
                  <button onClick={() => deleteSurvey(s.id)} className="btn-danger text-sm"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nueva Encuesta" size="lg">
          <div className="space-y-4">
            <input type="text" placeholder="Título" value={newSurvey.titulo} onChange={e => setNewSurvey(p => ({ ...p, titulo: e.target.value }))} className="input-field" />
            <textarea placeholder="Descripción" value={newSurvey.descripcion} onChange={e => setNewSurvey(p => ({ ...p, descripcion: e.target.value }))} className="input-field" />
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Agregar Pregunta</h4>
              <input type="text" placeholder="Texto de la pregunta" value={newQuestion.texto} onChange={e => setNewQuestion(p => ({ ...p, texto: e.target.value }))} className="input-field mb-2" />
              <select value={newQuestion.tipo} onChange={e => setNewQuestion(p => ({ ...p, tipo: e.target.value as any }))} className="input-field mb-2">
                <option value="texto">Texto libre</option>
                <option value="opcion">Opción única</option>
                <option value="multiple">Opción múltiple</option>
                <option value="escala">Escala 1-5</option>
              </select>
              {(newQuestion.tipo === 'opcion' || newQuestion.tipo === 'multiple') && (
                <input type="text" placeholder="Opciones separadas por coma" value={newQuestion.opciones} onChange={e => setNewQuestion(p => ({ ...p, opciones: e.target.value }))} className="input-field mb-2" />
              )}
              <button onClick={addQuestion} className="btn-secondary">Agregar Pregunta</button>
            </div>
            {newSurvey.preguntas.length > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Preguntas ({newSurvey.preguntas.length}):</p>
                {newSurvey.preguntas.map((q, i) => <p key={q.id} className="text-sm">{i + 1}. {q.texto}</p>)}
              </div>
            )}
            <button onClick={createSurvey} className="btn-primary w-full">Crear Encuesta</button>
          </div>
        </Modal>

        <Modal 
          isOpen={!!showResponses} 
          onClose={() => setShowResponses(null)} 
          title={`Respuestas - ${surveys.find(s => s.id === showResponses)?.titulo || 'Encuesta'}`} 
          size="lg"
        >
          <div className="space-y-4 max-h-[70vh] overflow-auto">
            {(() => {
              const surveyResponses = responses.filter(r => r.surveyId === showResponses);
              const currentSurvey = surveys.find(s => s.id === showResponses);
              
              if (surveyResponses.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay respuestas para esta encuesta aún.</p>
                  </div>
                );
              }

              return surveyResponses.map(r => {
                const u = users.find(x => x.id === r.userId);
                return (
                  <div key={r.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b">
                      <div>
                        <p className="font-semibold text-foreground">{u?.nombres} {u?.apellidos}</p>
                        <p className="text-sm text-muted-foreground">{u?.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(r.fechaRespuesta).toLocaleString('es-ES')}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {currentSurvey?.preguntas.map((pregunta, index) => {
                        const respuesta = r.respuestas.find(resp => resp.questionId === pregunta.id);
                        const valor = respuesta?.valor || 'Sin respuesta';
                        
                        return (
                          <div key={pregunta.id} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-sm text-foreground min-w-[24px]">{index + 1}.</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-foreground">{pregunta.texto}</p>
                                {pregunta.requerida && (
                                  <span className="text-xs text-red-500 ml-2">(Requerida)</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="ml-7">
                              {Array.isArray(valor) ? (
                                <div className="space-y-1">
                                  {valor.length > 0 ? (
                                    valor.map((v, idx) => (
                                      <div key={idx} className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded border">
                                        • {v}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">Sin respuesta</p>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded border">
                                  {typeof valor === 'string' && valor.trim() !== '' ? valor : 'Sin respuesta'}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CoordinadorEncuestas;
