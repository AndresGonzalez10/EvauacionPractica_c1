
CREATE INDEX idx_students_search ON students(nombre, email);

CREATE INDEX idx_groups_term ON groups(term);

CREATE INDEX idx_students_program ON students(program);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);

CREATE INDEX idx_enrollments_group_id ON enrollments(group_id);

CREATE INDEX idx_grades_enrollment_id ON grades(enrollment_id);