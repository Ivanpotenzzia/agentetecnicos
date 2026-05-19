import type { Resultado } from '../types'

const styles: Record<string, string> = {
  'Interesado':        'bg-green-100 text-green-800',
  'No interesado':     'bg-red-100 text-red-800',
  'No contesta':       'bg-gray-100 text-gray-700',
  'Número erróneo':    'bg-orange-100 text-orange-800',
  'Rechazo proveedor': 'bg-purple-100 text-purple-800',
  'Llamar más tarde':  'bg-yellow-100 text-yellow-800',
}

export default function ResultsBadge({ resultado }: { resultado: Resultado | null }) {
  if (!resultado) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[resultado] || 'bg-gray-100 text-gray-700'}`}>
      {resultado}
    </span>
  )
}
