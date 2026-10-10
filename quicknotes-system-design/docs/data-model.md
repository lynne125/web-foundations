# QuickNotes Data Model

## Overview

QuickNotes stores users, notes, tags and the relationship between notes and tags.

The design uses a relational SQL database because the data has clear relationships and requires referential integrity.

---

# Entity: users

| Column | Type | Constraints |
|----------|----------|----------|
| id | BIGINT | Primary Key |
| email | VARCHAR(255) | Unique, Not Null |
| password_hash | VARCHAR(255) | Not Null |
| created_at | TIMESTAMP | Not Null |

Primary Key:
- id

---

# Entity: notes

| Column | Type | Constraints |
|----------|----------|----------|
| id | BIGINT | Primary Key |
| user_id | BIGINT | Foreign Key |
| title | VARCHAR(100) | Not Null |
| body | TEXT | Nullable |
| created_at | TIMESTAMP | Not Null |
| updated_at | TIMESTAMP | Not Null |

Primary Key:
- id

Foreign Key:
- user_id → users(id)

---

# Entity: tags

| Column | Type | Constraints |
|----------|----------|----------|
| id | BIGINT | Primary Key |
| name | VARCHAR(50) | Unique, Not Null |

Primary Key:
- id

---

# Entity: note_tags

| Column | Type | Constraints |
|----------|----------|----------|
| note_id | BIGINT | Foreign Key |
| tag_id | BIGINT | Foreign Key |

Composite Primary Key:
- (note_id, tag_id)

Foreign Keys:
- note_id → notes(id)
- tag_id → tags(id)

---

# Relationships

## One-to-Many

A single user can own many notes.

```text
users
  |
  | 1
  |
  |------<
           notes
           many
```

Example:

- User 1 owns Note 1
- User 1 owns Note 2
- User 1 owns Note 3

---

## Many-to-Many

A note can have many tags.

A tag can belong to many notes.

```text
notes
   \
    \
     >--- note_tags ---<
    /
   /
tags
```

Example:

| Note | Tag |
|--------|--------|
| Shopping List | Personal |
| Shopping List | Groceries |
| Project Tasks | Work |

The junction table `note_tags` stores these relationships.

---

# CREATE TABLE Statements

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

```sql
CREATE TABLE notes (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

```sql
CREATE TABLE tags (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
```

```sql
CREATE TABLE note_tags (
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

---

# Example SQL Queries

## 1. Get all notes for a specific user

```sql
SELECT id, title, body
FROM notes
WHERE user_id = 1;
```

---

## 2. Create a new note

```sql
INSERT INTO notes (
    user_id,
    title,
    body,
    created_at,
    updated_at
)
VALUES (
    1,
    'Shopping List',
    'Milk, Bread, Eggs',
    NOW(),
    NOW()
);
```

---

## 3. Get notes and their tags (JOIN Example)

```sql
SELECT
    n.id,
    n.title,
    t.name AS tag_name
FROM notes n
JOIN note_tags nt
    ON n.id = nt.note_id
JOIN tags t
    ON nt.tag_id = t.id;
```

---

## 4. Count notes per user

```sql
SELECT
    user_id,
    COUNT(*) AS total_notes
FROM notes
GROUP BY user_id;
```

---

# Indexes

## Index on notes.user_id

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

Reason:

Most requests retrieve notes belonging to a particular user. This index speeds up user note lookups.

---

## Index on note_tags.tag_id

```sql
CREATE INDEX idx_note_tags_tag_id
ON note_tags(tag_id);
```

Reason:

Allows faster searches when filtering notes by tag.

---

# SQL vs NoSQL Decision

QuickNotes uses a SQL database because the application contains structured relationships between users, notes and tags. SQL databases enforce foreign key constraints, support JOIN operations efficiently and provide ACID transactions for reliable data consistency.

A NoSQL database could scale horizontally more easily, but it would make relationship management more complex and could lead to duplicated data. Since QuickNotes relies heavily on relationships and consistency, a relational SQL database is the better choice.