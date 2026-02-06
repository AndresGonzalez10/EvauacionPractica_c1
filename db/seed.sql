-- 1. Estudiantes
INSERT INTO students (nombre, email, program, enrollment_year) VALUES
('Andres Eduardo', 'andres.edu@gmail.com', 'Ingeniería de Software', 2024),
('Gabriel Macias', 'gabriel.macias@gmail.com', 'Ciencia de Datos', 2024),
('Erick Ruiz', 'erick.ruiz@gmail.com', 'Ciberseguridad', 2023),
('Braulio Diaz', 'braulio.diaz@gmail.com', 'Ingeniería de Software', 2023),
('Nestor Gomez', 'nestor.gomez@gmail.com', 'Ciberseguridad', 2024);

-- 2. Profesores 
INSERT INTO teachers (nombre, email) VALUES
('Omar Gomez', 'omar@poli.edu'),
('Israel Diaz', 'israel@poli.edu'),
('Arturo Ruiz', 'arturo@poli.edu'),
('Marco Cordero', 'marco@poli.edu');

-- 3. Cursos
INSERT INTO courses (code, nombre, credits) VALUES
('MATH01', 'Calculo', 3),
('BDA001', 'Bases de Datos Avanzadas', 6),
('PROG01', 'Programacion', 5);

-- 4. Grupos 
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2024-Q1'),
(2, 2, '2024-Q1'), 
(3, 1, '2024-Q1'),
(2, 3, '2024-Q2'); 

-- 5. Inscripciones 
INSERT INTO enrollments (student_id, group_id, enrollment_at) VALUES
(1, 1, '2024-01-15'),
(1, 2, '2024-01-15'), 
(2, 1, '2024-01-16'), 
(3, 3, '2024-01-10'),
(4, 3, '2024-01-10'),
(5, 2, '2024-01-10'); 

-- 6. Calificaciones 
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
(1, 8.5, 9.0, 9.2),
(2, 7.0, 8.5, 8.0),
(3, 9.5, 9.8, 9.7),
(4, 5.0, 6.0, 5.5), 
(5, 8.0, 8.5, 8.2),
(6, 6.0, 6.5, 6.2); 

-- 7. Asistencias 
INSERT INTO attendance (enrollment_id, date, present) VALUES
(1, '2024-02-01', TRUE),
(1, '2024-02-02', TRUE),
(2, '2024-02-01', FALSE),
(3, '2024-02-01', TRUE),
(4, '2024-02-01', FALSE),
(5, '2024-02-01', TRUE),
(6, '2024-02-01', FALSE);