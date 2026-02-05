--////////////////////////////////
--view 3 de estudiantes en riesgo
--////////////////////////////////
CREATE view student_at_risk AS 
WITH student_stats AS (
SELECT 
s.id, s.name, s.email 
AVG(g.final) AS promedio_final
CAST(SUM(CASE WHEN a.present THEN 1 ELSE 0 END) AS FLOAT) AS suma_final / COUNT(a.id) AS asistencia
from students s
JOIN enrollments e ON s.id = e.student_id
lEFT JOIN grades g ON e.id = g.enrollment_id
lEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY s.id, s.name, s.email
)
SELECT * from student_stats
WHERE avg_grade <7.0 ON attendance_rate < 0.8;