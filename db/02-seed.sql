-- 1. Estudiantes
INSERT INTO students (nombre, email, program, enrollment_year) VALUES
('Andres Eduardo', 'andres.edu@gmail.com', 'Ingeniería de Software', 2024),
('Gabriel Macias', 'gabriel.macias@gmail.com', 'Ciencia de Datos', 2024),
('Erick Ruiz', 'erick.ruiz@gmail.com', 'Ciberseguridad', 2023),
('Braulio Diaz', 'braulio.diaz@gmail.com', 'Ingeniería de Software', 2023),
('Nestor Gomez', 'nestor.gomez@gmail.com', 'Ciberseguridad', 2024),
('Esmeralda Mendez', 'esme.mendez@gmail.com', 'Ingeniería de Software', 2023), 
('Erick Gonzalez', 'erick.gonz@gmail.com', 'Ciencia de Datos', 2024),          
('Raul Martines', 'raul.martines@gmail.com', 'Ciberseguridad', 2024),         
('Edwar Gonzalez', 'edwar.g@gmail.com', 'Ingeniería de Software', 2024),      
('Sofia Ramirez', 'sofia.rami@gmail.com', 'Ciencia de Datos', 2023),
('Diego Fernandez', 'diego.fer@gmail.com', 'Ingeniería de Software', 2024),
('Valentina Lopez', 'vale.lopez@gmail.com', 'Ciberseguridad', 2024),
('Luis Hernandez', 'luis.hdz@gmail.com', 'Ingeniería de Software', 2023),
('Ximena Torres', 'ximena.torres@gmail.com', 'Ciencia de Datos', 2024),
('Mateo Flores', 'mateo.flores@gmail.com', 'Ingeniería de Software', 2024),
('Camila Castillo', 'camila.cast@gmail.com', 'Ciberseguridad', 2023);

-- 2. Profesores 
INSERT INTO teachers (nombre, email) VALUES
('Omar Gomez', 'omar@poli.edu'),      
('Israel Diaz', 'israel@poli.edu'),   
('Arturo Ruiz', 'arturo@poli.edu'),  
('Marco Cordero', 'marco@poli.edu'),  
('Elena Vargas', 'elena@poli.edu');    

-- 3. Cursos
INSERT INTO courses (code, nombre, credits) VALUES
('MATH01', 'Calculo Diferencial', 5),      
('BDA001', 'Bases de Datos Avanzadas', 6), 
('PROG01', 'Programación Orientada a Objetos', 5), 
('NET001', 'Redes de Computadoras', 4),    
('REQ001', 'Ingeniería de Requisitos', 4); 

-- 4. Grupos 
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2024-Q1'), 
(2, 2, '2024-Q1'), 
(3, 1, '2024-Q1'), 
(2, 3, '2024-Q2'), 
(4, 4, '2024-Q1'), 
(5, 5, '2024-Q1'), 
(1, 1, '2024-Q2'); 

-- 5. Inscripciones 
INSERT INTO enrollments (student_id, group_id, enrollment_at) VALUES
(1, 1, '2024-01-15'), (1, 2, '2024-01-15'), 
(2, 1, '2024-01-16'), (3, 3, '2024-01-10'),
(4, 3, '2024-01-10'), (5, 2, '2024-01-10'),
(6, 1, '2024-01-10'), (6, 6, '2024-01-10'), 
(7, 5, '2024-01-12'),                        
(8, 1, '2024-01-12'),                        
(9, 1, '2024-01-13'), (9, 3, '2024-01-13'), 
(10, 2, '2024-01-14'),                       
(11, 4, '2024-01-15'),                       
(12, 1, '2024-01-15'),                       
(13, 5, '2024-01-16'),                       
(14, 6, '2024-01-16'),                       
(15, 3, '2024-01-17'),                       
(16, 2, '2024-01-17');

-- 6. Calificaciones 
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
(1, 8.5, 9.0, 9.2), 
(2, 7.0, 8.5, 8.0), 
(3, 9.5, 9.8, 9.7), 
(4, 5.0, 6.0, 5.5), 
(5, 8.0, 8.5, 8.2),
(6, 6.0, 6.5, 6.2), 
(7, 10.0, 10.0, 10.0), 
(8, 9.5, 9.5, 9.5),    
(9, 8.0, 8.0, 8.0),    
(10, 9.0, 8.5, 8.8),   
(11, 4.0, 3.5, 3.8),   
(12, 5.5, 6.0, 5.8),   
(13, 7.5, 7.5, 7.5),   
(14, 8.0, 8.0, 8.0),   
(15, 2.0, 3.0, 2.5),   
(16, 9.0, 9.0, 9.0),   
(17, 8.5, 8.5, 8.5),   
(18, 6.0, 6.0, 6.0),   
(19, 7.0, 7.5, 7.3);   

-- 7. Asistencias 
INSERT INTO attendance (enrollment_id, date, present) VALUES
(1, '2024-02-01', TRUE), (1, '2024-02-02', TRUE),
(2, '2024-02-01', FALSE),
(3, '2024-02-01', TRUE),
(4, '2024-02-01', FALSE), 
(5, '2024-02-01', TRUE),
(6, '2024-02-01', FALSE),
(10, '2024-02-01', FALSE),
(10, '2024-02-03', FALSE),
(10, '2024-02-05', FALSE),
(10, '2024-02-07', TRUE), 
(7, '2024-02-01', TRUE),
(7, '2024-02-03', TRUE),
(7, '2024-02-05', TRUE),
(11, '2024-02-01', FALSE),
(11, '2024-02-03', TRUE);