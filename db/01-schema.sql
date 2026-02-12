CREATE table students (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    enrollment_year INT NOT NULL
);

CREATE table teachers (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE table courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    nombre VARCHAR (100) NOT NULL,
    credits INT NOT NULL
);

CREATE table groups (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id),
    teacher_id INT NOT NULL REFERENCES teachers(id),
    term VARCHAR(20) NOT NULL
);

CREATE table enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id),
    group_id INT NOT NULL REFERENCES groups(id),
    enrollment_at DATE DEFAULT CURRENT_DATE
);

CREATE table grades (
    id SERIAL PRIMARY KEY, 
    enrollment_id INT REFERENCES enrollments(id),
    partial1 DECIMAL(4,2) CHECK (partial1 >= 0 AND partial1 <= 10),
    partial2 DECIMAL(4,2) CHECK (partial2 >= 0  AND partial2 <= 10),
    final DECIMAL(4,2) CHECK (final >= 0 AND final <= 10)
);

CREATE table attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULl REFERENCES enrollments(id),
    date DATE NOT NULL,
    present BOOLEAN NOT NULL
);