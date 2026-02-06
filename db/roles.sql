CREATE USER ang WITH PASSWORD 'doki123';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ang;

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'app') THEN
      CREATE ROLE app WITH LOGIN PASSWORD 'app_password';
   END IF;
END
$do$;

GRANT CONNECT ON DATABASE academy_db TO app;

GRANT USAGE ON SCHEMA public TO app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app;

GRANT SELECT ON vw_course_performance TO app;
GRANT SELECT ON vw_teacher_load TO app;
GRANT SELECT ON vw_students_at_risk TO app;
GRANT SELECT ON vw_attendance_by_group TO app;
GRANT SELECT ON vw_rank_students TO app;