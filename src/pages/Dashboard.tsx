import { useMetricsGlobal, useMetricsByProvince } from '../hooks/useCalls'
import KPICard from '../components/KPICard'
import CallsByProvinceChart from '../components/CallsByProvinceChart'
import ResultsPieChart from '../components/ResultsPieChart'

function fmt(n: number | null | undefined, suffix = '') {
  if (n == null) return '—'
  return n.toLocaleString('es-ES') + suffix
}

function fmtDuration(sec: number | null) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export default function Dashboard() {
  const { data: global, loading: loadingG }   = useMetricsGlobal()
  const { data: byProv, loading: loadingP }   = useMetricsByProvince()

  if (loadingG || loadingP) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Cargando métricas...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Resumen global</h2>

      {/* KPIs globales */}
      {global && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard
            label="Total llamadas"
            value={fmt(global.total_llamadas)}
            color="blue"
          />
          <KPICard
            label="Interesados"
            value={fmt(global.interesados)}
            sub={`${fmt(global.tasa_interes_pct)}% de tasa`}
            color="green"
          />
          <KPICard
            label="No interesados"
            value={fmt(global.no_interesados)}
            color="red"
          />
          <KPICard
            label="No contesta"
            value={fmt(global.no_contesta)}
            color="gray"
          />
          <KPICard
            label="Dur. media"
            value={fmtDuration(global.duracion_media_seg)}
            sub="por llamada"
            color="yellow"
          />
        </div>
      )}

      {/* Estado de la campaña */}
      {global && (
        <div className="grid grid-cols-3 gap-4">
          <KPICard label="Pendientes" value={fmt(global.pendientes)} color="gray" />
          <KPICard label="En proceso" value={fmt(global.en_proceso)} color="yellow" />
          <KPICard
            label="Completadas"
            value={fmt(
              global.total_llamadas - (global.pendientes || 0) - (global.en_proceso || 0)
            )}
            color="blue"
          />
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {byProv.length > 0 && <CallsByProvinceChart data={byProv} />}
        {global && global.total_llamadas > 0 && <ResultsPieChart data={global} />}
      </div>

      {/* Tabla por provincia */}
      {byProv.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Detalle por provincia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Provincia','Total','Interesados','No interes.','No contesta','N. erróneo','Rec. prov.','Más tarde','Tasa %','Dur. media'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byProv.map(row => (
                  <tr key={row.provincia} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{row.provincia}</td>
                    <td className="px-4 py-2.5">{row.total_llamadas}</td>
                    <td className="px-4 py-2.5 text-green-700 font-medium">{row.interesados}</td>
                    <td className="px-4 py-2.5 text-red-600">{row.no_interesados}</td>
                    <td className="px-4 py-2.5 text-gray-500">{row.no_contesta}</td>
                    <td className="px-4 py-2.5 text-orange-600">{row.numero_erroneo}</td>
                    <td className="px-4 py-2.5 text-purple-600">{row.rechazo_proveedor}</td>
                    <td className="px-4 py-2.5 text-yellow-600">{row.llamar_mas_tarde}</td>
                    <td className="px-4 py-2.5 font-semibold">
                      {row.tasa_interes_pct != null ? `${row.tasa_interes_pct}%` : '—'}
                    </td>
                    <td className="px-4 py-2.5">{fmtDuration(row.duracion_media_seg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {byProv.length === 0 && !loadingP && (
        <div className="text-center text-gray-400 py-16 bg-white rounded-xl border border-gray-200">
          Aún no hay llamadas registradas. Las métricas aparecerán aquí cuando empiecen las campañas.
        </div>
      )}
    </div>
  )
}
