# Library Books API Design

## Base URL

/api/books

---

## 1. List Books

### Endpoint

GET /api/books

### Description

Returns all books in the library.

### Success Response

Status: 200 OK

```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert Martin",
    "year": 2008
  }
]