# QuickNotes API Design

## Endpoints

| Method | Path | Description | Success |
|----------|----------|----------|----------|
| GET | /api/notes | List notes | 200 |
| GET | /api/notes/{id} | Get note | 200 |
| POST | /api/notes | Create note | 201 |
| PUT | /api/notes/{id} | Update note | 200 |
| DELETE | /api/notes/{id} | Delete note | 204 |
| GET | /api/tags | List tags | 200 |
| POST | /api/tags | Create tag | 201 |

## Create Note Request

```json
{
  "title": "Shopping List",
  "body": "Buy milk",
  "userId": 1
}
```