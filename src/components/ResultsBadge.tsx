import type { Resultado } from '../types'

const styles: Record<string, string> = {
  // Conectada - negocio
  'Interesado':         'bg-green-100 text-green-800',
  'No interesado':      'bg-red-100 text-red-800',
  'No autónomo':        'bg-pink-100 text-pink-800',
  'Llamar más tarde':   'bg-yellow-100 text-yellow-800',
  'Sin clasificar':     'bg-blue-100 text-blue-800',
  // No conectada - técnico
  'No contesta':        'bg-gray-100 text-gray-700',
  'Ocupado':            'bg-amber-100 text-amber-800',
  'Buzón de voz':       'bg-indigo-100 text-indigo-800',
  'Número erróneo':     'bg-orange-100 text-orange-800',
  'Rechazo proveedor':  'bg-purple-100 text-purple-800',
  'Error técnico':      'bg-slate-200 text-slate-800',
}

export default function ResultsBadge({ resultado }: { resultado: Resultado | null }) {
  if (!resultado) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[resultado] || 'bg-gray-100 text-gray-700'}`}>
      {resultado}
    </span>
  )
}
