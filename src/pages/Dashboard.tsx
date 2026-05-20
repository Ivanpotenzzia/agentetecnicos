import { useMetricsGlobal, useMetricsByProvince } from '../hooks/useCalls'
import KPICard from '../components/KPICard'
import CallsByProvinceChart from '../components/CallsByProvinceChart'
import ResultsPieChart from '../components/ResultsPieChart'

function fmt(n: number | null | undefined, suffix = '') {
  if (n == null) return '—'
  return n.toLocaleString('es-ES') + suffix
}

function fmtPct(n: number | null | undefined) {
  if (n == null) return '—'
  return `${n}%`
}

function fmtDuration(sec: number | null) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

function pctOf(part: number, total: number): string {
  if (!total || total === 0) return '—'
  return `${((part / total) * 100).toFixed(1)}%`
}

export default function Dashboard() {
  const { data: global, loading: loadingG } = useMetricsGlobal()
  const { data: byProv, loading: loadingP } = useMetricsByProvince()

  if (loadingG || loadingP) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Cargando métricas...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ============================================================
          BLOQUE 1 — VOLUMEN Y EMBUDO DE CONEXIÓN
          ============================================================ */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Volumen y conexión</h2>
          <span className="text-xs text-gray-400">Qué llega a hablar con alguien</span>
        </div>
        {global && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard
              label="Total contactos"
              value={fmt(global.total_llamadas)}
              sub="únicos en la base"
              color="blue"
            />
            <KPICard
              label="Conectadas"
              value={fmt(global.conectadas)}
              sub={`${fmtPct(global.tasa_conexion_pct)} del total`}
              color="green"
            />
            <KPICard
              label="No conectadas"
              value={fmt(global.no_conectadas)}
              sub={pctOf(global.no_conectadas, global.total_llamadas) + ' del total'}
              color="gray"
            />
            <KPICard
              label="Duración media"
              value={fmtDuration(global.duracion_media_seg)}
              sub="por llamada"
              color="yellow"
            />
          </div>
        )}
      </section>

      {/* ============================================================
          BLOQUE 2 — RESULTADO DE NEGOCIO (sobre Conectadas)
          ============================================================ */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Resultado de las conversaciones</h2>
          <span className="text-xs text-gray-400">
            Solo de las {global ? fmt(global.conectadas) : '—'} conectadas
          </span>
        </div>
        {global && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard
              label="Interesados"
              value={fmt(global.interesados)}
              sub={`${fmtPct(global.tasa_interes_pct)} tasa real`}
              color="green"
            />
            <KPICard
              label="No interesados"
              value={fmt(global.no_interesados)}
              sub={pctOf(global.no_interesados, global.conectadas)}
              color="red"
            />
            <KPICard
              label="Llamar más tarde"
              value={fmt(global.llamar_mas_tarde)}
              sub={pctOf(global.llamar_mas_tarde, global.conectadas)}
              color="yellow"
            />
            <KPICard
              label="No autónomo"
              value={fmt(global.no_autonomo)}
              sub={pctOf(global.no_autonomo, global.conectadas)}
              color="gray"
            />
            <KPICard
              label="Sin clasificar"
              value={fmt(global.sin_clasificar)}
              sub={pctOf(global.sin_clasificar, global.conectadas)}
              color="blue"
            />
          </div>
        )}
      </section>

      {/* ============================================================
          BLOQUE 3 — MOTIVO TÉCNICO (sobre No conectadas)
          ============================================================ */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Motivo de no conexión</h2>
          <span className="text-xs text-gray-400">
            Solo de las {global ? fmt(global.no_conectadas) : '—'} no conectadas
          </span>
        </div>
        {global && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard
              label="No contesta"
              value={fmt(global.no_contesta)}
              sub={pctOf(global.no_contesta, global.no_conectadas)}
              color="gray"
            />
            <KPICard
              label="Ocupado"
              value={fmt(global.ocupado)}
              sub={pctOf(global.ocupado, global.no_conectadas)}
              color="yellow"
            />
            <KPICard
              label="Rechazo proveedor"
              value={fmt(global.rechazo_proveedor)}
              sub={pctOf(global.rechazo_proveedor, global.no_conectadas)}
              color="gray"
            />
            <KPICard
              label="Número erróneo"
              value={fmt(global.numero_erroneo)}
              sub={pctOf(global.numero_erroneo, global.no_conectadas)}
              color="gray"
            />
            <KPICard
              label="Buzón de voz"
              value={fmt(global.buzon_voz)}
              sub={pctOf(global.buzon_voz, global.no_conectadas)}
              color="gray"
            />
            <KPICard
              label="Error técnico"
              value={fmt(global.error_tecnico)}
              sub={pctOf(global.error_tecnico, global.no_conectadas)}
              color="gray"
            />
          </div>
        )}
      </section>

      {/* ============================================================
          GRÁFICOS
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {byProv.length > 0 && <CallsByProvinceChart data={byProv} />}
        {global && global.total_llamadas > 0 && <ResultsPieChart data={global} />}
      </div>

      {/* ============================================================
          TABLA POR PROVINCIA (todas las categorías)
          ============================================================ */}
      {byProv.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Detalle por provincia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Provincia</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                  <th className="px-3 py-2 text-right font-medium" title="Conectadas">Conect.</th>
                  <th className="px-3 py-2 text-right font-medium text-green-700">Interes.</th>
                  <th className="px-3 py-2 text-right font-medium text-red-600">No int.</th>
                  <th className="px-3 py-2 text-right font-medium text-yellow-600">Más tarde</th>
                  <th className="px-3 py-2 text-right font-medium text-pink-600">No autón.</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">No cont.</th>
                  <th className="px-3 py-2 text-right font-medium text-amber-600">Ocup.</th>
                  <th className="px-3 py-2 text-right font-medium text-purple-600">Rec. prov.</th>
                  <th className="px-3 py-2 text-right font-medium text-orange-600">N. erróneo</th>
                  <th className="px-3 py-2 text-right font-medium" title="% Conectadas / Total">Conex %</th>
                  <th className="px-3 py-2 text-right font-medium" title="% Interesados / Conectadas">Int. real %</th>
                  <th className="px-3 py-2 text-right font-medium">Dur. media</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byProv.map(row => (
                  <tr key={row.provincia} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{row.provincia}</td>
                    <td className="px-3 py-2 text-right">{row.total_llamadas}</td>
                    <td className="px-3 py-2 text-right">{row.conectadas}</td>
                    <td className="px-3 py-2 text-right text-green-700 font-medium">{row.interesados}</td>
                    <td className="px-3 py-2 text-right text-red-600">{row.no_interesados}</td>
                    <td className="px-3 py-2 text-right text-yellow-600">{row.llamar_mas_tarde}</td>
                    <td className="px-3 py-2 text-right text-pink-600">{row.no_autonomo}</td>
                    <td className="px-3 py-2 text-right text-gray-500">{row.no_contesta}</td>
                    <td className="px-3 py-2 text-right text-amber-600">{row.ocupado}</td>
                    <td className="px-3 py-2 text-right text-purple-600">{row.rechazo_proveedor}</td>
                    <td className="px-3 py-2 text-right text-orange-600">{row.numero_erroneo}</td>
                    <td className="px-3 py-2 text-right">{fmtPct(row.tasa_conexion_pct)}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmtPct(row.tasa_interes_pct)}</td>
                    <td className="px-3 py-2 text-right">{fmtDuration(row.duracion_media_seg)}</td>
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
