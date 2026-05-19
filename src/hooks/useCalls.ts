import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Call, Filters, MetricsByProvince, MetricsGlobal } from '../types'

const PAGE_SIZE = 50

export function useCalls(filters: Filters, page: number) {
  const [calls, setCalls]   = useState<Call[]>([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('calls')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (filters.provincia)  query = query.eq('provincia', filters.provincia)
      if (filters.resultado)  query = query.eq('resultado', filters.resultado)
      if (filters.dateFrom)   query = query.gte('fecha_llamada', filters.dateFrom)
      if (filters.dateTo)     query = query.lte('fecha_llamada', filters.dateTo)
      if (filters.search) {
        query = query.or(
          `nombre_empresa.ilike.%${filters.search}%,telefono.ilike.%${filters.search}%`
        )
      }

      const { data, count, error: err } = await query
      if (err) throw err
      setCalls((data as Call[]) || [])
      setTotal(count || 0)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetch() }, [fetch])

  return { calls, total, loading, error, refetch: fetch, pageSize: PAGE_SIZE }
}

export function useMetricsByProvince() {
  const [data, setData]     = useState<MetricsByProvince[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('v_metrics_by_province')
      .select('*')
      .order('total_llamadas', { ascending: false })
      .then(({ data: rows }) => {
        setData((rows as MetricsByProvince[]) || [])
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

export function useMetricsGlobal() {
  const [data, setData]     = useState<MetricsGlobal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('v_metrics_global')
      .select('*')
      .single()
      .then(({ data: row }) => {
        setData((row as MetricsGlobal) || null)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
