# School Database Design

## Tables

### Students

Stores information about students.

Fields:

- student_id (Primary Key)
- name
- email

The email field is unique so that two students cannot have the same email address.

---

### Courses

Stores information about courses.

Fields:

- course_id (Primary Key)
- course_name

---

### Enrollments

Stores information about which students are enrolled in which courses.

Fields:

- enrollment_id (Primary Key)
- student_id (Foreign Key)
- course_id (Foreign Key)
- grade

A UNIQUE constraint on (student_id, course_id) prevents a student from enrolling in the same course twice.

---

## Relationships

### Student to Enrollment

One-to-Many

One student can have many enrollment records.

---

### Course to Enrollment

One-to-Many

One course can have many enrollment records.

---

### Student to Course

Many-to-Many

A student can take many courses, and a course can contain many students.

Because of this many-to-many relationship, the enrollments table is required as a join table.

---

## Index

Index:

```sql
CREATE INDEX idx_student_name
ON students(name);
```

Reason:

This index speeds up searches for students by name.

---

## SQL vs NoSQL

For this system I would choose SQL.

A school database contains structured data with clear relationships between students, courses and enrollments. SQL databases support primary keys, foreign keys and joins, making them ideal for enforcing data integrity and handling relationships. Since school records must remain accurate and consistent, a relational SQL database is a better choice than NoSQL.