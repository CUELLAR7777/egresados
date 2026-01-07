import { User, Survey, SurveyResponse, Capacitacion } from './storage';

// Exportar a CSV
export const exportToCSV = (data: object[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = (row as Record<string, unknown>)[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Exportar a JSON
export const exportToJSON = (data: object[], filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

// Exportar a XML
export const exportToXML = (data: object[], filename: string, rootName: string = 'data'): void => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${rootName}>
${data.map(item => objectToXML(item, 'item')).join('\n')}
</${rootName}>`;
  
  downloadFile(xmlContent, `${filename}.xml`, 'application/xml');
};

const objectToXML = (obj: object, tagName: string): string => {
  const entries = Object.entries(obj);
  const content = entries.map(([key, value]) => {
    if (Array.isArray(value)) {
      return `<${key}>${value.map(v => 
        typeof v === 'object' ? objectToXML(v, 'item') : `<item>${escapeXML(String(v))}</item>`
      ).join('')}</${key}>`;
    }
    if (typeof value === 'object' && value !== null) {
      return objectToXML(value, key);
    }
    return `<${key}>${escapeXML(String(value))}</${key}>`;
  }).join('\n    ');
  
  return `  <${tagName}>
    ${content}
  </${tagName}>`;
};

const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Preparar datos de usuarios para exportación
export const prepareUsersForExport = (users: User[]): object[] => {
  return users.map(({ password, ...user }) => user);
};

// Preparar datos de encuestas para exportación
export const prepareSurveysForExport = (surveys: Survey[]): object[] => {
  return surveys;
};

// Preparar respuestas para exportación
export const prepareResponsesForExport = (
  responses: SurveyResponse[], 
  surveys: Survey[], 
  users: User[]
): object[] => {
  return responses.map(response => {
    const survey = surveys.find(s => s.id === response.surveyId);
    const user = users.find(u => u.id === response.userId);
    return {
      ...response,
      encuestaTitulo: survey?.titulo || 'N/A',
      usuarioNombre: user ? `${user.nombres} ${user.apellidos}` : 'N/A',
      usuarioEmail: user?.email || 'N/A',
    };
  });
};

// Preparar capacitaciones para exportación
export const prepareCapacitacionesForExport = (capacitaciones: Capacitacion[]): object[] => {
  return capacitaciones.map(cap => ({
    ...cap,
    numInscritos: cap.inscritos.length,
  }));
};
