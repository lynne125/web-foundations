-- Create Students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Create Courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

-- Create Enrollments table
CREATE TABLE enrollments (
    enrollment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade INTEGER,

    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),

    UNIQUE(student_id, course_id)
);

-- Students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Alice', 'alice@example.com'),
(2, 'Bob', 'bob@example.com'),
(3, 'Charlie', 'charlie@example.com');

-- Courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Mathematics'),
(2, 'Science'),
(3, 'History');

-- Enrollments
INSERT INTO enrollments (enrollment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 85),
(2, 1, 2, 90),
(3, 2, 1, 78),
(4, 2, 3, 88),
(5, 3, 2, 92);

-- Query 1:
-- All courses for one student (Alice)

SELECT s.name,
       c.course_name,
       e.grade
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.name = 'Alice';

-- Query 2:
-- All students on one course

SELECT c.course_name,
       s.name
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.course_name = 'Mathematics';

-- Query 3:
-- Number of students per course

SELECT c.course_name,
       COUNT(e.student_id) AS total_students
FROM courses c
LEFT JOIN enrollments e
ON c.course_id = e.course_id
GROUP BY c.course_name;

-- Query 4:
-- Students with no enrollments

SELECT s.name
FROM students s
LEFT JOIN enrollments e
ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- Query 5:
-- Update one enrollment grade

UPDATE enrollments
SET grade = 95
WHERE enrollment_id = 1;

-- Index

CREATE INDEX idx_student_name
ON students(name);