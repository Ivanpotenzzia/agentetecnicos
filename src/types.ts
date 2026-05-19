export type Resultado =
  | 'Interesado'
  | 'No interesado'
  | 'No contesta'
  | 'Número erróneo'
  | 'Rechazo proveedor'
  | 'Llamar más tarde'

export type Status = 'Pendiente' | 'En proceso' | 'Completada' | 'Sin resultado'

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
  interesados: number
  no_interesados: number
  no_contesta: number
  numero_erroneo: number
  rechazo_proveedor: number
  llamar_mas_tarde: number
  tasa_interes_pct: number | null
  duracion_media_seg: number | null
}

export interface MetricsGlobal {
  total_llamadas: number
  interesados: number
  no_interesados: number
  no_contesta: number
  numero_erroneo: number
  rechazo_proveedor: number
  llamar_mas_tarde: number
  pendientes: number
  en_proceso: number
  tasa_interes_pct: number | null
  duracion_media_seg: number | null
}

export interface Filters {
  provincia: string
  resultado: string
  dateFrom: string
  dateTo: string
  search: string
}
