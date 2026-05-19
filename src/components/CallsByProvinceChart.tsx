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
    'No contesta':       d.no_contesta,
    'N. erróneo':        d.numero_erroneo,
    'Rec. proveedor':    d.rechazo_proveedor,
    'Llamar más tarde':  d.llamar_mas_tarde,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Llamadas por provincia y resultado</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Interesado"        stackId="a" fill="#22c55e" />
          <Bar dataKey="No interesado"     stackId="a" fill="#ef4444" />
          <Bar dataKey="No contesta"       stackId="a" fill="#9ca3af" />
          <Bar dataKey="N. erróneo"        stackId="a" fill="#f97316" />
          <Bar dataKey="Rec. proveedor"    stackId="a" fill="#a855f7" />
          <Bar dataKey="Llamar más tarde"  stackId="a" fill="#eab308" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
