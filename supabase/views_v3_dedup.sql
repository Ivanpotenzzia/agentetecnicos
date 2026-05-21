-- ============================================================
-- Vistas v3 — Deduplicación automática por teléfono
--
-- CAMBIO vs v2: añade un CTE `calls_latest` que selecciona solo la
-- última llamada por teléfono usando DISTINCT ON. Todas las métricas
-- se cuentan sobre ese resultado deduplicado.
--
-- MOTIVACIÓN: con el sistema de reintentos activo, cada reintento
-- crea una nueva fila en `calls` (porque cada llamada de Retell
-- tiene un retell_call_id único). Sin dedup, el dashboard mostraría
-- "Total contactos" inflado y porcentajes incorrectos.
--
-- Con DISTINCT ON, el histórico se preserva en la tabla `calls` pero
-- el dashboard siempre muestra "1 fila por persona" con su estado
-- más reciente, sin importar cuántos reintentos haya habido.
--
-- EJECUTAR en Supabase Studio → SQL Editor. Es seguro re-ejecutar.
-- ============================================================

DROP VIEW IF EXISTS v_metrics_global;
DROP VIEW IF EXISTS v_metrics_by_province;

-- ============================================================
-- v_metrics_global
-- ============================================================
CREATE VIEW v_metrics_global AS
WITH calls_latest AS (
  -- 1 fila por teléfono: la más reciente
  SELECT DISTINCT ON (telefono) *
  FROM calls
  WHERE telefono IS NOT NULL AND telefono != ''
  ORDER BY telefono, fecha_llamada DESC NULLS LAST, hora_llamada DESC NULLS LAST
)
SELECT
  COUNT(*)::int                                                                       AS total_llamadas,
  COUNT(*) FILTER (WHERE status = 'Conectada')::int                                   AS conectadas,
  COUNT(*) FILTER (WHERE status = 'No conectada')::int                                AS no_conectadas,
  COUNT(*) FILTER (WHERE status = 'En proceso')::int                                  AS en_proceso,
  0::int                                                                              AS pendientes,
  COUNT(*) FILTER (WHERE resultado = 'Interesado')::int                               AS interesados,
  COUNT(*) FILTER (WHERE resultado = 'No interesado')::int                            AS no_interesados,
  COUNT(*) FILTER (WHERE resultado = 'No autónomo')::int                              AS no_autonomo,
  COUNT(*) FILTER (WHERE resultado = 'Llamar más tarde')::int                         AS llamar_mas_tarde,
  COUNT(*) FILTER (WHERE resultado = 'Sin clasificar')::int                           AS sin_clasificar,
  COUNT(*) FILTER (WHERE resultado = 'No contesta')::int                              AS no_contesta,
  COUNT(*) FILTER (WHERE resultado = 'Ocupado')::int                                  AS ocupado,
  COUNT(*) FILTER (WHERE resultado = 'Buzón de voz')::int                             AS buzon_voz,
  COUNT(*) FILTER (WHERE resultado = 'Número erróneo')::int                           AS numero_erroneo,
  COUNT(*) FILTER (WHERE resultado = 'Rechazo proveedor')::int                        AS rechazo_proveedor,
  COUNT(*) FILTER (WHERE resultado = 'Error técnico')::int                            AS error_tecnico,
  CASE
    WHEN COUNT(*) FILTER (WHERE status = 'Conectada') > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE resultado = 'Interesado') / COUNT(*) FILTER (WHERE status = 'Conectada'), 1)
    ELSE NULL
  END                                                                                  AS tasa_interes_pct,
  CASE
    WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Conectada') / COUNT(*), 1)
    ELSE NULL
  END                                                                                  AS tasa_conexion_pct,
  ROUND(AVG(duracion_seg) FILTER (WHERE duracion_seg > 0))::int                       AS duracion_media_seg
FROM calls_latest;

-- ============================================================
-- v_metrics_by_province
-- ============================================================
CREATE VIEW v_metrics_by_province AS
WITH calls_latest AS (
  SELECT DISTINCT ON (telefono) *
  FROM calls
  WHERE telefono IS NOT NULL AND telefono != ''
  ORDER BY telefono, fecha_llamada DESC NULLS LAST, hora_llamada DESC NULLS LAST
)
SELECT
  provincia,
  COUNT(*)::int                                                                       AS total_llamadas,
  COUNT(*) FILTER (WHERE status = 'Conectada')::int                                   AS conectadas,
  COUNT(*) FILTER (WHERE status = 'No conectada')::int                                AS no_conectadas,
  COUNT(*) FILTER (WHERE resultado = 'Interesado')::int                               AS interesados,
  COUNT(*) FILTER (WHERE resultado = 'No interesado')::int                            AS no_interesados,
  COUNT(*) FILTER (WHERE resultado = 'No autónomo')::int                              AS no_autonomo,
  COUNT(*) FILTER (WHERE resultado = 'Llamar más tarde')::int                         AS llamar_mas_tarde,
  COUNT(*) FILTER (WHERE resultado = 'Sin clasificar')::int                           AS sin_clasificar,
  COUNT(*) FILTER (WHERE resultado = 'No contesta')::int                              AS no_contesta,
  COUNT(*) FILTER (WHERE resultado = 'Ocupado')::int                                  AS ocupado,
  COUNT(*) FILTER (WHERE resultado = 'Buzón de voz')::int                             AS buzon_voz,
  COUNT(*) FILTER (WHERE resultado = 'Número erróneo')::int                           AS numero_erroneo,
  COUNT(*) FILTER (WHERE resultado = 'Rechazo proveedor')::int                        AS rechazo_proveedor,
  COUNT(*) FILTER (WHERE resultado = 'Error técnico')::int                            AS error_tecnico,
  CASE
    WHEN COUNT(*) FILTER (WHERE status = 'Conectada') > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE resultado = 'Interesado') / COUNT(*) FILTER (WHERE status = 'Conectada'), 1)
    ELSE NULL
  END                                                                                  AS tasa_interes_pct,
  CASE
    WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Conectada') / COUNT(*), 1)
    ELSE NULL
  END                                                                                  AS tasa_conexion_pct,
  ROUND(AVG(duracion_seg) FILTER (WHERE duracion_seg > 0))::int                       AS duracion_media_seg
FROM calls_latest
GROUP BY provincia
ORDER BY total_llamadas DESC;
