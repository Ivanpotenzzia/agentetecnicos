import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { MetricsByProvince } from '../types'

interface Props {
  data: MetricsByProvince[]
}

export default function CallsByProvinceChart({ data }: Props) {
  const chartData = data.map(d => ({
    name: d.provincia.charAt(0) + d.provincia.slice(1).toLowerCase(),
    Interesado:          d.interesados,
    'No interesado':     d.no_interesados,
    'No autónomo':       d.no_autonomo,
    'Llamar más tarde':  d.llamar_mas_tarde,
    'Sin clasificar':    d.sin_clasificar,
    'No contesta':       d.no_contesta,
    Ocupado:             d.ocupado,
    'Buzón':             d.buzon_voz,
    'N. erróneo':        d.numero_erroneo,
    'Rec. proveedor':    d.rechazo_proveedor,
    'Error técnico':     d.error_tecnico,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Llamadas por provincia y resultado</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {/* Conectada (verdes/cálidos) */}
          <Bar dataKey="Interesado"        stackId="a" fill="#22c55e" />
          <Bar dataKey="No interesado"     stackId="a" fill="#ef4444" />
          <Bar dataKey="No autónomo"       stackId="a" fill="#ec4899" />
          <Bar dataKey="Llamar más tarde"  stackId="a" fill="#eab308" />
          <Bar dataKey="Sin clasificar"    stackId="a" fill="#3b82f6" />
          {/* No conectada (grises/morados) */}
          <Bar dataKey="No contesta"       stackId="a" fill="#9ca3af" />
          <Bar dataKey="Ocupado"           stackId="a" fill="#f59e0b" />
          <Bar dataKey="Buzón"             stackId="a" fill="#6366f1" />
          <Bar dataKey="N. erróneo"        stackId="a" fill="#f97316" />
          <Bar dataKey="Rec. proveedor"    stackId="a" fill="#a855f7" />
          <Bar dataKey="Error técnico"     stackId="a" fill="#475569" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
