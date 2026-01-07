import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { 
  getSession, 
  getSurveys, 
  getResponsesByUser, 
  addResponse,
  generateId,
  Survey,
  SurveyResponse
} from '@/lib/storage';
import { ClipboardList, CheckCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EgresadoEncuestas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [myResponses, setMyResponses] = useState<SurveyResponse[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    setSurveys(getSurveys().filter(s => s.activa));
    setMyResponses(getResponsesByUser(session.userId));
  }, [navigate]);
  
  const session = getSession();
  if (!session) return null;
  
  const isCompleted = (surveyId: string) => {
    return myResponses.some(r => r.surveyId === surveyId);
  };
  
  const openSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setAnswers({});
  };
  
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleMultipleChoice = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter(o => o !== option) };
      }
    });
  };
  
  const handleSubmit = () => {
    if (!selectedSurvey) return;
    
    // Validar respuestas requeridas
    const unanswered = selectedSurvey.preguntas
      .filter(p => p.requerida)
      .filter(p => {
        const answer = answers[p.id];
        if (Array.isArray(answer)) return answer.length === 0;
        return !answer || answer.trim() === '';
      });
    
    if (unanswered.length > 0) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor responde todas las preguntas obligatorias',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response: SurveyResponse = {
        id: generateId(),
        surveyId: selectedSurvey.id,
        userId: session.userId,
        respuestas: Object.entries(answers).map(([questionId, valor]) => ({
          questionId,
          valor: valor as string | string[],
        })),
        fechaRespuesta: new Date().toISOString(),
      };
      
      addResponse(response);
      setMyResponses([...myResponses, response]);
      setSelectedSurvey(null);
      
      toast({
        title: 'Encuesta enviada',
        description: 'Gracias por completar la encuesta',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la encuesta',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const pendingSurveys = surveys.filter(s => !isCompleted(s.id));
  const completedSurveys = surveys.filter(s => isCompleted(s.id));
  
  return (
    <div className="dashboard-layout">
      <Sidebar session={session} />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Encuestas</h1>
          <p className="text-muted-foreground">Completa las encuestas disponibles</p>
        </div>
        
        {/* Pendientes */}
        <div className="mb-8">
          <h2 className="section-title flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-warning" />
            Encuestas Pendientes ({pendingSurveys.length})
          </h2>
          
          {pendingSurveys.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-center py-8">
                No tienes encuestas pendientes
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingSurveys.map(survey => (
                <Card key={survey.id}>
                  <h3 className="font-semibold text-foreground mb-2">{survey.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {survey.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {survey.preguntas.length} preguntas
                    </span>
                    <button
                      onClick={() => openSurvey(survey)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Responder
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Completadas */}
        <div>
          <h2 className="section-title flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Encuestas Completadas ({completedSurveys.length})
          </h2>
          
          {completedSurveys.length === 0 ? (
            <Card>
              <p className="text-muted-foreground text-center py-8">
                Aún no has completado ninguna encuesta
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedSurveys.map(survey => {
                const response = myResponses.find(r => r.surveyId === survey.id);
                return (
                  <Card key={survey.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{survey.titulo}</h3>
                        <p className="text-xs text-muted-foreground">
                          Respondida el {response && new Date(response.fechaRespuesta).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="badge badge-success">Completada</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Modal para responder encuesta */}
        <Modal
          isOpen={!!selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          title={selectedSurvey?.titulo || ''}
          size="lg"
        >
          {selectedSurvey && (
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedSurvey.descripcion}</p>
              
              {selectedSurvey.preguntas.map((pregunta, index) => (
                <div key={pregunta.id} className="border-t border-border pt-4">
                  <label className="block font-medium text-foreground mb-2">
                    {index + 1}. {pregunta.texto}
                    {pregunta.requerida && <span className="text-destructive ml-1">*</span>}
                  </label>
                  
                  {pregunta.tipo === 'texto' && (
                    <textarea
                      value={(answers[pregunta.id] as string) || ''}
                      onChange={e => handleAnswerChange(pregunta.id, e.target.value)}
                      className="input-field min-h-[80px]"
                      placeholder="Escribe tu respuesta..."
                    />
                  )}
                  
                  {pregunta.tipo === 'opcion' && pregunta.opciones && (
                    <div className="space-y-2">
                      {pregunta.opciones.map(opcion => (
                        <label key={opcion} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={pregunta.id}
                            value={opcion}
                            checked={answers[pregunta.id] === opcion}
                            onChange={e => handleAnswerChange(pregunta.id, e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-foreground">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {pregunta.tipo === 'multiple' && pregunta.opciones && (
                    <div className="space-y-2">
                      {pregunta.opciones.map(opcion => (
                        <label key={opcion} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(answers[pregunta.id] as string[] || []).includes(opcion)}
                            onChange={e => handleMultipleChoice(pregunta.id, opcion, e.target.checked)}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="text-foreground">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {pregunta.tipo === 'escala' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleAnswerChange(pregunta.id, String(num))}
                          className={`w-10 h-10 rounded-lg border transition-colors ${
                            answers[pregunta.id] === String(num)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card border-border hover:border-primary/50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Respuestas
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default EgresadoEncuestas;
