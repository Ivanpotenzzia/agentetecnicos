import { useState } from 'react'
import { useCalls } from '../hooks/useCalls'
import FilterBar from '../components/FilterBar'
import ResultsBadge from '../components/ResultsBadge'
import type { Filters } from '../types'

const EMPTY_FILTERS: Filters = {
  provincia: '',
  resultado: '',
  dateFrom:  '',
  dateTo:    '',
  search:    '',
}

function fmtDuration(sec: number | null) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export default function Llamadas() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [page, setPage]       = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)

  const { calls, total, loading, pageSize } = useCalls(filters, page)

  const totalPages = Math.ceil(total / pageSize)

  function handleFilterChange(partial: Partial<Filters>) {
    setFilters(prev => ({ ...prev, ...partial }))
    setPage(0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Llamadas</h2>
        <span className="text-sm text-gray-500">{total.toLocaleString('es-ES')} registros</span>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setFilters(EMPTY_FILTERS); setPage(0) }}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Cargando...</div>
      ) : calls.length === 0 ? (
        <div className="text-center text-gray-400 py-16 bg-white rounded-xl border border-gray-200">
          No hay llamadas que coincidan con los filtros.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Nombre/Empresa','Provincia','Teléfono','Fecha','Hora','Resultado','Duración','Callback'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calls.map(call => (
                  <>
                    <tr
                      key={call.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpanded(expanded === call.id ? null : call.id)}
                    >
                      <td className="px-4 py-2.5 font-medium max-w-[180px] truncate">
                        {call.nombre_empresa || '—'}
                      </td>
                      <td className="px-4 py-2.5">{call.provincia}</td>
                      <td className="px-4 py-2.5 text-gray-500">{call.telefono || '—'}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{call.fecha_llamada || '—'}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">{call.hora_llamada?.slice(0,5) || '—'}</td>
                      <td className="px-4 py-2.5">
                        <ResultsBadge resultado={call.resultado} />
                      </td>
                      <td className="px-4 py-2.5">{fmtDuration(call.duracion_seg)}</td>
                      <td className="px-4 py-2.5 text-blue-600">{call.numero_callback || '—'}</td>
                    </tr>
                    {expanded === call.id && call.resumen_llamada && (
                      <tr key={`${call.id}-detail`} className="bg-blue-50">
                        <td colSpan={8} className="px-6 py-3 text-gray-700 text-xs">
                          <span className="font-semibold text-gray-500 uppercase tracking-wide text-xs">Resumen: </span>
                          {call.resumen_llamada}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>Página {page + 1} de {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
