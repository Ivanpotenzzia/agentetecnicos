-- ============================================================
-- Vistas v2 para dashboard agentetecnicos
-- Taxonomía nueva (STATUS = Conectada|No conectada|En proceso,
-- RESULTADO = 11 valores unificados con el agente de Retell)
--
-- EJECUTAR en Supabase Studio → SQL Editor del proyecto Juanfran.
-- Es seguro re-ejecutarlas (DROP + CREATE).
--
-- NOTA: usamos DROP en lugar de CREATE OR REPLACE porque cambian los
-- tipos de columna (de bigint a int por el cast ::int) y PostgreSQL
-- no permite eso con REPLACE. DROP de una vista solo borra la query
-- guardada, no toca los datos de la tabla calls.
-- ============================================================

DROP VIEW IF EXISTS v_metrics_global;
DROP VIEW IF EXISTS v_metrics_by_province;

-- --- Métricas globales --------------------------------------
CREATE VIEW v_metrics_global AS
SELECT
  COUNT(*)::int                                                                       AS total_llamadas,

  -- STATUS (vocabulario nuevo)
  COUNT(*) FILTER (WHERE status = 'Conectada')::int                                   AS conectadas,
  COUNT(*) FILTER (WHERE status = 'No conectada')::int                                AS no_conectadas,
  COUNT(*) FILTER (WHERE status = 'En proceso')::int                                  AS en_proceso,
  -- mantenido por compatibilidad con frontend antiguo (siempre 0 con nueva taxonomía)
  0::int                                                                              AS pendientes,

  -- RESULTADO - lado de negocio (sobre conectadas)
  COUNT(*) FILTER (WHERE resultado = 'Interesado')::int                               AS interesados,
  COUNT(*) FILTER (WHERE resultado = 'No interesado')::int                            AS no_interesados,
  COUNT(*) FILTER (WHERE resultado = 'No autónomo')::int                              AS no_autonomo,
  COUNT(*) FILTER (WHERE resultado = 'Llamar más tarde')::int                         AS llamar_mas_tarde,
  COUNT(*) FILTER (WHERE resultado = 'Sin clasificar')::int                           AS sin_clasificar,

  -- RESULTADO - lado técnico (sobre no conectadas)
  COUNT(*) FILTER (WHERE resultado = 'No contesta')::int                              AS no_contesta,
  COUNT(*) FILTER (WHERE resultado = 'Ocupado')::int                                  AS ocupado,
  COUNT(*) FILTER (WHERE resultado = 'Buzón de voz')::int                             AS buzon_voz,
  COUNT(*) FILTER (WHERE resultado = 'Número erróneo')::int                           AS numero_erroneo,
  COUNT(*) FILTER (WHERE resultado = 'Rechazo proveedor')::int                        AS rechazo_proveedor,
  COUNT(*) FILTER (WHERE resultado = 'Error técnico')::int                            AS error_tecnico,

  -- Tasa real de interés: % de Interesados SOBRE LAS CONECTADAS (no sobre total)
  -- Esta es la métrica de efectividad real del agente.
  CASE
    WHEN COUNT(*) FILTER (WHERE status = 'Conectada') > 0
      THEN ROUND(
        100.0 * COUNT(*) FILTER (WHERE resultado = 'Interesado')
        / COUNT(*) FILTER (WHERE status = 'Conectada'),
        1
      )
    ELSE NULL
  END                                                                                  AS tasa_interes_pct,

  -- Tasa de conexión: % de Conectadas sobre el total (cuántas llegan a humano)
  CASE
    WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Conectada') / COUNT(*), 1)
    ELSE NULL
  END                                                                                  AS tasa_conexion_pct,

  -- Duración media de llamadas con duración > 0
  ROUND(AVG(duracion_seg) FILTER (WHERE duracion_seg > 0))::int                       AS duracion_media_seg
FROM calls;


-- --- Métricas por provincia ---------------------------------
CREATE VIEW v_metrics_by_province AS
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
      THEN ROUND(
        100.0 * COUNT(*) FILTER (WHERE resultado = 'Interesado')
        / COUNT(*) FILTER (WHERE status = 'Conectada'),
        1
      )
    ELSE NULL
  END                                                                                  AS tasa_interes_pct,

  CASE
    WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Conectada') / COUNT(*), 1)
    ELSE NULL
  END                                                                                  AS tasa_conexion_pct,

  ROUND(AVG(duracion_seg) FILTER (WHERE duracion_seg > 0))::int                       AS duracion_media_seg
FROM calls
GROUP BY provincia
ORDER BY total_llamadas DESC;
