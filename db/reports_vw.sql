--////////////////////////////////
--view 3 de estudiantes en riesgo
--////////////////////////////////
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