-----
-- anomalias_pre_porcentaje
-----

CREATE OR REPLACE FUNCTION create_indexes_anomalias_pre_porcentaje() RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	_sql = '
		CREATE INDEX idx_anomalias_pre_porcentaje_agno
		  ON anomalias_pre_porcentaje
		  USING btree
		  (agno);

		CREATE INDEX idx_anomalias_pre_porcentaje_id_punto
		  ON anomalias_pre_porcentaje
		  USING btree
		  (id_punto);

		CREATE INDEX idx_anomalias_pre_porcentaje_mes
		  ON anomalias_pre_porcentaje
		  USING btree
		  (mes);

		CREATE UNIQUE INDEX idx_anomalias_pre_porcentaje
  			ON anomalias_pre_porcentaje (id_punto, agno, mes);';
	EXECUTE _sql;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_pre_porcentaje() RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	_sql = '
		DROP INDEX IF EXISTS idx_anomalias_pre_porcentaje_agno;
		DROP INDEX IF EXISTS idx_anomalias_pre_porcentaje_id_punto;
		DROP INDEX IF EXISTS idx_anomalias_pre_porcentaje_mes;
		DROP INDEX IF EXISTS idx_anomalias_pre_porcentaje;';
	EXECUTE _sql;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_pre_porcentaje(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_pre_porcentaje';
	IF _drop_index THEN
		-- DROP index before refresh
	--	RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_pre_porcentaje();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_pre_porcentaje;

	IF _drop_index THEN
		-- Restore the index back
		--RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_pre_porcentaje();
	END IF;

END
$$ LANGUAGE plpgsql;

-----
-- anomalias_etp_porcentaje
-----
CREATE OR REPLACE FUNCTION create_indexes_anomalias_etp_porcentaje() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_etp_porcentaje_agno
	  ON anomalias_etp_porcentaje
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_etp_porcentaje_id_punto
	  ON anomalias_etp_porcentaje
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_etp_porcentaje_mes
	  ON anomalias_etp_porcentaje
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_etp_porcentaje
		ON anomalias_etp_porcentaje (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_etp_porcentaje() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_etp_porcentaje_agno;
	DROP INDEX IF EXISTS idx_anomalias_etp_porcentaje_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_etp_porcentaje_mes;
	DROP INDEX IF EXISTS idx_anomalias_etp_porcentaje;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_etp_porcentaje(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_etp_porcentaje';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_etp_porcentaje();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_etp_porcentaje;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_etp_porcentaje();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- anomalias pre
----
CREATE OR REPLACE FUNCTION create_indexes_anomalias_pre() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_pre_agno
	  ON anomalias_pre
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_pre_id_punto
	  ON anomalias_pre
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_pre_mes
	  ON anomalias_pre
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_pre
		ON anomalias_pre (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_pre() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_pre_agno;
	DROP INDEX IF EXISTS idx_anomalias_pre_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_pre_mes;
	DROP INDEX IF EXISTS idx_anomalias_pre;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_pre(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_pre';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_pre();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_pre;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_pre();
	END IF;

END
$$ LANGUAGE plpgsql;

---
-- anomalias_temp_min
---

CREATE OR REPLACE FUNCTION create_indexes_anomalias_temp_min() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_temp_min_agno
	  ON anomalias_temp_min
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_temp_min_id_punto
	  ON anomalias_temp_min
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_temp_min_mes
	  ON anomalias_temp_min
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_temp_min
		ON anomalias_temp_min (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_temp_min() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_temp_min_agno;
	DROP INDEX IF EXISTS idx_anomalias_temp_min_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_temp_min_mes;
	DROP INDEX IF EXISTS idx_anomalias_temp_min;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_temp_min(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_temp_min';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_temp_min();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_temp_min;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_temp_min();
	END IF;

END
$$ LANGUAGE plpgsql;

---
-- annomalias_temp
---
CREATE OR REPLACE FUNCTION create_indexes_anomalias_temp() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_temp_agno
	  ON anomalias_temp
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_temp_id_punto
	  ON anomalias_temp
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_temp_mes
	  ON anomalias_temp
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_temp
		ON anomalias_temp (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_temp() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_temp_agno;
	DROP INDEX IF EXISTS idx_anomalias_temp_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_temp_mes;
	DROP INDEX IF EXISTS idx_anomalias_temp;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_temp(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_temp';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_temp();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_temp;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_temp();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- anomalies_temp_max
----
CREATE OR REPLACE FUNCTION create_indexes_anomalias_temp_max() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_temp_max_agno
	  ON anomalias_temp_max
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_temp_max_id_punto
	  ON anomalias_temp_max
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_temp_max_mes
	  ON anomalias_temp_max
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_temp_max
		ON anomalias_temp_max (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_temp_max() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_temp_max_agno;
	DROP INDEX IF EXISTS idx_anomalias_temp_max_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_temp_max_mes;
	DROP INDEX IF EXISTS idx_anomalias_temp_max;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_temp_max(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_temp_max';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_temp_max();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_temp_max;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_temp_max();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- anomalies_etp
----
CREATE OR REPLACE FUNCTION create_indexes_anomalias_etp() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_anomalias_etp_agno
	  ON anomalias_etp
	  USING btree
	  (agno);

	CREATE INDEX idx_anomalias_etp_id_punto
	  ON anomalias_etp
	  USING btree
	  (id_punto);

	CREATE INDEX idx_anomalias_etp_mes
	  ON anomalias_etp
	  USING btree
	  (mes);

	CREATE UNIQUE INDEX idx_anomalias_etp
		ON anomalias_etp (id_punto, agno, mes);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_anomalias_etp() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_anomalias_etp_agno;
	DROP INDEX IF EXISTS idx_anomalias_etp_id_punto;
	DROP INDEX IF EXISTS idx_anomalias_etp_mes;
	DROP INDEX IF EXISTS idx_anomalias_etp;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_anomalias_etp(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	--RAISE NOTICE 'Refresh anomalias_etp';
	IF _drop_index THEN
		-- DROP index before refresh
		-- RAISE NOTICE 'Dropping indexes';
		PERFORM drop_indexes_anomalias_etp();
	END IF;

	REFRESH MATERIALIZED VIEW anomalias_etp;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_anomalias_etp();
	END IF;

END
$$ LANGUAGE plpgsql;


----
-- pre_anual_espacial
----
CREATE OR REPLACE FUNCTION create_indexes_pre_anual() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_pre_anual_agno
	  ON pre_anual
	  USING btree
	  (agno);

	CREATE INDEX idx_pre_anual_id_punto
	  ON pre_anual
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_pre_anual
		ON pre_anual (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_pre_anual() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_pre_anual_agno;
	DROP INDEX IF EXISTS idx_pre_anual_id_punto;
	DROP INDEX IF EXISTS idx_pre_anual;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_pre_anual(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_pre_anual();
	END IF;

	REFRESH MATERIALIZED VIEW pre_anual;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_pre_anual();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- temp_anual
----
CREATE OR REPLACE FUNCTION create_indexes_temp_anual() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_temp_anual_agno
	  ON temp_anual
	  USING btree
	  (agno);

	CREATE INDEX idx_temp_anual_id_punto
	  ON temp_anual
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_temp_anual
		ON temp_anual (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_temp_anual() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_temp_anual_agno;
	DROP INDEX IF EXISTS idx_temp_anual_id_punto;
	DROP INDEX IF EXISTS idx_temp_anual;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_temp_anual(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_temp_anual();
	END IF;

	REFRESH MATERIALIZED VIEW temp_anual;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_temp_anual();
	END IF;

END
$$ LANGUAGE plpgsql;


----
-- seasonality_index
----
CREATE OR REPLACE FUNCTION create_indexes_seasonality_index() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_seasonality_index_agno
	  ON seasonality_index
	  USING btree
	  (agno);

	CREATE INDEX idx_seasonality_index_id_punto
	  ON seasonality_index
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_seasonality_index
		ON seasonality_index (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_seasonality_index() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_seasonality_index_agno;
	DROP INDEX IF EXISTS idx_seasonality_index_id_punto;
	DROP INDEX IF EXISTS idx_seasonality_index;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_seasonality_index(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_seasonality_index();
	END IF;

	REFRESH MATERIALIZED VIEW seasonality_index;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_seasonality_index();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- temp_min_anual
----
CREATE OR REPLACE FUNCTION create_indexes_temp_min_anual() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_temp_min_anual_agno
	  ON temp_min_anual
	  USING btree
	  (agno);

	CREATE INDEX idx_temp_min_anual_id_punto
	  ON temp_min_anual
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_temp_min_anual
		ON temp_min_anual (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_temp_min_anual() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_temp_min_anual_agno;
	DROP INDEX IF EXISTS idx_temp_min_anual_id_punto;
	DROP INDEX IF EXISTS idx_temp_min_anual;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_temp_min_anual(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_temp_min_anual();
	END IF;

	REFRESH MATERIALIZED VIEW temp_min_anual;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_temp_min_anual();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- temp_max_anual
----
CREATE OR REPLACE FUNCTION create_indexes_temp_max_anual() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_temp_max_anual_agno
	  ON temp_max_anual
	  USING btree
	  (agno);

	CREATE INDEX idx_temp_max_anual_id_punto
	  ON temp_max_anual
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_temp_max_anual
		ON temp_max_anual (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_temp_max_anual() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_temp_max_anual_agno;
	DROP INDEX IF EXISTS idx_temp_max_anual_id_punto;
	DROP INDEX IF EXISTS idx_temp_max_anual;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_temp_max_anual(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_temp_max_anual();
	END IF;

	REFRESH MATERIALIZED VIEW temp_max_anual;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_temp_max_anual();
	END IF;

END
$$ LANGUAGE plpgsql;

----
-- etp_anual
----
CREATE OR REPLACE FUNCTION create_indexes_etp_anual() RETURNS void AS $$
	
BEGIN

	CREATE INDEX idx_etp_anual_agno
	  ON etp_anual
	  USING btree
	  (agno);

	CREATE INDEX idx_etp_anual_id_punto
	  ON etp_anual
	  USING btree
	  (id_punto);

	CREATE UNIQUE INDEX idx_etp_anual
		ON etp_anual (id_punto, agno);
	
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION drop_indexes_etp_anual() RETURNS void AS $$
BEGIN
	DROP INDEX IF EXISTS idx_etp_anual_agno;
	DROP INDEX IF EXISTS idx_etp_anual_id_punto;
	DROP INDEX IF EXISTS idx_etp_anual;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_etp_anual(_drop_index boolean) RETURNS void AS $$
DECLARE
	_sql text;
BEGIN
	IF _drop_index THEN
		-- DROP index before refresh
		PERFORM drop_indexes_etp_anual();
	END IF;

	REFRESH MATERIALIZED VIEW etp_anual;

	IF _drop_index THEN
		-- Restore the index back
		-- RAISE NOTICE 'Creating indexes';
		PERFORM create_indexes_etp_anual();
	END IF;

END
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION refresh_views(_drop_index boolean) RETURNS void AS $$
BEGIN
	PERFORM refresh_anomalias_pre_porcentaje(_drop_index);
	PERFORM refresh_anomalias_etp_porcentaje(_drop_index);
	PERFORM refresh_anomalias_pre(_drop_index);
	PERFORM refresh_anomalias_temp_min(_drop_index);
	PERFORM refresh_anomalias_temp(_drop_index);
	PERFORM refresh_anomalias_temp_max(_drop_index);
	PERFORM refresh_anomalias_etp(_drop_index);
	PERFORM refresh_pre_anual(_drop_index);
	PERFORM refresh_temp_anual(_drop_index);
	PERFORM refresh_seasonality_index(_drop_index);
	PERFORM refresh_temp_min_anual(_drop_index);
	PERFORM refresh_temp_max_anual(_drop_index);
	PERFORM refresh_etp_anual(_drop_index);

END
$$ LANGUAGE plpgsql;




