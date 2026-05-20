// Vocabulario unificado con el agente de Retell y los workflows de n8n.
// IMPORTANTE: cualquier cambio aquí debe alinearse con:
//   - El prompt post-call analysis del agente Retell
//   - El Code node "Extraer y normalizar datos" del workflow "Post call"
//   - El Code node "Clasificar" del workflow "Reclasificación retroactiva"
//   - Las vistas SQL v_metrics_global / v_metrics_by_province

// Resultados de NEGOCIO (hubo conversación con humano)
export type ResultadoConectada =
  | 'Interesado'
  | 'No interesado'
  | 'No autónomo'
  | 'Llamar más tarde'
  | 'Sin clasificar'

// Resultados TÉCNICOS (no se conectó con humano)
export type ResultadoNoConectada =
  | 'No contesta'
  | 'Ocupado'
  | 'Buzón de voz'
  | 'Número erróneo'
  | 'Rechazo proveedor'
  | 'Error técnico'

export type Resultado = ResultadoConectada | ResultadoNoConectada

export type Status = 'Conectada' | 'No conectada' | 'En proceso'

export const RESULTADOS_CONECTADA: ResultadoConectada[] = [
  'Interesado',
  'No interesado',
  'No autónomo',
  'Llamar más tarde',
  'Sin clasificar',
]

export const RESULTADOS_NO_CONECTADA: ResultadoNoConectada[] = [
  'No contesta',
  'Ocupado',
  'Buzón de voz',
  'Número erróneo',
  'Rechazo proveedor',
  'Error técnico',
]

export const TODOS_RESULTADOS: Resultado[] = [
  ...RESULTADOS_CONECTADA,
  ...RESULTADOS_NO_CONECTADA,
]

export interface Call {
  id: string
  retell_call_id: string | null
  provincia: string
  nombre_empresa: string | null
  telefono: string | null
  numero_origen: string | null
  fecha_llamada: string | null   // ISO date string
  hora_llamada: string | null
  duracion_seg: number | null
  status: Status
  resultado: Resultado | null
  resumen_llamada: string | null
  numero_callback: string | null
  created_at: string
}

export interface MetricsByProvince {
  provincia: string
  total_llamadas: number
  // STATUS
  conectadas: number
  no_conectadas: number
  // RESULTADO - negocio
  interesados: number
  no_interesados: number
  no_autonomo: number
  llamar_mas_tarde: number
  sin_clasificar: number
  // RESULTADO - técnico
  no_contesta: number
  ocupado: number
  buzon_voz: number
  numero_erroneo: number
  rechazo_proveedor: number
  error_tecnico: number
  // Tasas
  tasa_interes_pct: number | null    // % Interesados sobre Conectadas (no sobre total)
  tasa_conexion_pct: number | null   // % Conectadas sobre Total
  duracion_media_seg: number | null
}

export interface MetricsGlobal {
  total_llamadas: number
  // STATUS
  conectadas: number
  no_conectadas: number
  en_proceso: number
  pendientes: number   // compat: siempre 0 con nueva taxonomía
  // RESULTADO - negocio
  interesados: number
  no_interesados: number
  no_autonomo: number
  llamar_mas_tarde: number
  sin_clasificar: number
  // RESULTADO - técnico
  no_contesta: number
  ocupado: number
  buzon_voz: number
  numero_erroneo: number
  rechazo_proveedor: number
  error_tecnico: number
  // Tasas
  tasa_interes_pct: number | null
  tasa_conexion_pct: number | null
  duracion_media_seg: number | null
}

export interface Filters {
  provincia: string
  resultado: string
  dateFrom: string
  dateTo: string
  search: string
}
