import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { MetricsGlobal } from '../types'

const COLORS: Record<string, string> = {
  // Conectada
  'Interesado':         '#22c55e',
  'No interesado':      '#ef4444',
  'No autónomo':        '#ec4899',
  'Llamar más tarde':   '#eab308',
  'Sin clasificar':     '#3b82f6',
  // No conectada
  'No contesta':        '#9ca3af',
  'Ocupado':            '#f59e0b',
  'Buzón de voz':       '#6366f1',
  'Número erróneo':     '#f97316',
  'Rechazo proveedor':  '#a855f7',
  'Error técnico':      '#475569',
}

interface Props {
  data: MetricsGlobal
}

export default function ResultsPieChart({ data }: Props) {
  const entries = [
    { name: 'Interesado',         value: data.interesados },
    { name: 'No interesado',      value: data.no_interesados },
    { name: 'No autónomo',        value: data.no_autonomo },
    { name: 'Llamar más tarde',   value: data.llamar_mas_tarde },
    { name: 'Sin clasificar',     value: data.sin_clasificar },
    { name: 'No contesta',        value: data.no_contesta },
    { name: 'Ocupado',            value: data.ocupado },
    { name: 'Buzón de voz',       value: data.buzon_voz },
    { name: 'Número erróneo',     value: data.numero_erroneo },
    { name: 'Rechazo proveedor',  value: data.rechazo_proveedor },
    { name: 'Error técnico',      value: data.error_tecnico },
  ].filter(e => e.value > 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribución de resultados</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={entries}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {entries.map(e => (
              <Cell key={e.name} fill={COLORS[e.name] || '#6b7280'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
