import type { Filters } from '../types'
import { TODOS_RESULTADOS } from '../types'

// Provincias actualmente activas en producción.
// Si se añaden más en n8n (workflow alimentador), añadirlas aquí también.
const PROVINCES = ['CORDOBA', 'GIRONA', 'GRANADA', 'MALAGA', 'SEVILLA', 'VALENCIA']

interface FilterBarProps {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  onReset: () => void
}

export default function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
      {/* Búsqueda */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Buscar</label>
        <input
          type="text"
          placeholder="Nombre o teléfono..."
          value={filters.search}
          onChange={e => onChange({ search: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Provincia */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Provincia</label>
        <select
          value={filters.provincia}
          onChange={e => onChange({ provincia: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Todas</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Resultado */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Resultado</label>
        <select
          value={filters.resultado}
          onChange={e => onChange({ resultado: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Todos</option>
          {TODOS_RESULTADOS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Fecha desde */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Desde</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => onChange({ dateFrom: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Hasta</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => onChange({ dateTo: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Limpiar
      </button>
    </div>
  )
}
