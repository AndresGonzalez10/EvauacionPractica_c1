-- 1. vw_course_performance
CREATE VIEW vw_course_performance AS
SELECT 
    c.nombre AS curso,
    g.term AS periodo,
    AVG(gr.final) AS promedio_general,
    SUM(CASE WHEN gr.final < 6.0 THEN 1 ELSE 0 END) AS total_reprobados
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN enrollments e ON g.id = e.group_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.id, c.nombre, g.term;

-- 2. vw_teacher_load
CREATE VIEW vw_teacher_load AS
SELECT 
    t.nombre AS docente,
    g.term AS periodo,
    COUNT(DISTINCT g.id) AS total_grupos,
    COUNT(e.id) AS total_alumnos,
    AVG(gr.final) AS promedio_docente
FROM teachers t
JOIN groups g ON t.id = g.teacher_id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY t.id, t.nombre, g.term
HAVING COUNT(DISTINCT g.id) > 0;

--view 3 de estudiantes en riesgo
CREATE VIEW vw_students_at_risk AS 
WITH student_stats AS (
    SELECT 
        s.id, 
        s.nombre, 
        s.email,
        AVG(g.final) AS avg_grade, 
        CAST(SUM(CASE WHEN a.present THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(a.id), 0) AS attendance_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades g ON e.id = g.enrollment_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id, s.nombre, s.email
)
SELECT * FROM student_stats
WHERE avg_grade < 7.0 OR attendance_rate < 0.8;

-- 4. vw_attendance_by_group
CREATE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS grupo_id,
    c.nombre AS curso,
    g.term AS periodo,
    COALESCE(AVG(CASE WHEN a.present THEN 100.0 ELSE 0.0 END), 0) AS asistencia_promedio
FROM groups g
JOIN courses c ON g.course_id = c.id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY g.id, c.nombre, g.term;

-- 5. vw_rank_student
CREATE VIEW vw_rank_students AS
SELECT 
    s.nombre,
    s.program,
    g.term AS periodo,
    AVG(gr.final) AS promedio,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG(gr.final) DESC) AS ranking_posicion
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.id, s.nombre, s.program, g.term;