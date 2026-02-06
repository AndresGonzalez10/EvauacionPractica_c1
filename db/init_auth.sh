#!/bin/bash
set -e

# Script dinámico: usa las variables del .env para configurar usuarios
# Así cumples el requisito de "No hardcodear"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    
    -- 1. Crear usuario Admin (ang)
    CREATE USER ang WITH PASSWORD '$DB_USER_PASSWORD';
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ang;

    -- 2. Crear usuario App (seguro)
    DROP ROLE IF EXISTS app;
    CREATE ROLE app WITH LOGIN PASSWORD '$DB_APP_PASSWORD';

    -- 3. Asignar permisos básicos
    GRANT CONNECT ON DATABASE academy_db TO app;
    GRANT USAGE ON SCHEMA public TO app;
    
    -- 4. Seguridad: Revocar acceso a tablas por defecto
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app;
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app;

    -- 5. Dar permisos SOLO a las vistas (Requisito examen)
    GRANT SELECT ON vw_course_performance TO app;
    GRANT SELECT ON vw_teacher_load TO app;
    GRANT SELECT ON vw_students_at_risk TO app;
    GRANT SELECT ON vw_attendance_by_group TO app;
    GRANT SELECT ON vw_rank_students TO app;

EOSQL