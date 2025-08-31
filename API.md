# Books API Documentation

This API manages a collection of books with full CRUD operations, search, sorting, pagination, and validation.

---

## Base URL

http://localhost:3000/api/v1


---

## Endpoints

### 1. Get All Books

**URL:** `/books`  
**Method:** `GET`  
**Query Parameters (optional):**

| Parameter | Description |
|-----------|-------------|
| `sort`    | `title`, `author`, `year` |
| `order`   | `asc` or `desc` (default: `asc`) |
| `page`    | Page number (default: 1) |
| `limit`   | Items per page (default: 10) |

**Example:**



GET /books?sort=year&order=desc&page=1&limit=2


**Response:**

```json
{
  "total": 2,
  "page": 1,
  "limit": 2,
  "books": [
    {
      "id": 1,
      "title": "Lake of the Ozarks",
      "author": "Bill Geist",
      "year": 2019,
      "genre": "Memoir"
    },
    {
      "id": 2,
      "title": "The Blacklist",
      "author": "Steven Piziks",
      "year": 2017,
      "genre": "Thriller/Crime"
    }
  ]
}


## 2. Get Single Book

URL: /books/:id
Method: GET

Example:

GET /books/1


Response:

{
  "id": 1,
  "title": "Lake of the Ozarks",
  "author": "Bill Geist",
  "year": 2019,
  "genre": "Memoir"
}


Error Response (book not found):

{
  "error": "Book not found"
}


3. Add New Book

URL: /books
Method: POST
Headers:

Content-Type: application/json


Body Example:

{
  "title": "The Great Train Robbery",
  "author": "Michael Crichton",
  "year": 1975,
  "genre": "Historical Fiction"
}


Success Response:

{
  "id": 3,
  "title": "The Great Train Robbery",
  "author": "Michael Crichton",
  "year": 1975,
  "genre": "Historical Fiction"
}


Error Response (validation or duplicate title):

{
  "errors": [
    "Title is required and must be string",
    "Year must be a number between 1000 and 2025"
  ]
}

4. Update Book

URL: /books/:id
Method: PUT
Headers:

Content-Type: application/json


Body Example:

{
  "title": "Updated Title",
  "author": "Updated Author",
  "year": 2019,
  "genre": "Fiction"
}


Success Response:

{
  "id": 1,
  "title": "Updated Title",
  "author": "Updated Author",
  "year": 2019,
  "genre": "Fiction"
}


Error Response:

{
  "error": "Book not found"
}

5. Delete Book

URL: /books/:id
Method: DELETE

Success Response:

{
  "message": "Book deleted",
  "book": {
    "id": 1,
    "title": "Lake of the Ozarks",
    "author": "Bill Geist",
    "year": 2019,
    "genre": "Memoir"
  }
}


Error Response:

{
  "error": "Book not found"
}

6. Search Books

URL: /books/search
Method: GET
Query Parameters (optional):

Parameter	Description
title	Search by title keyword
author	Search by author keyword

Example:

GET /books/search?title=lake&author=geist


Response:

[
  {
    "id": 1,
    "title": "Lake of the Ozarks",
    "author": "Bill Geist",
    "year": 2019,
    "genre": "Memoir"
  }
]

7. Book Count

URL: /books/count
Method: GET

Response:

{
  "total": 2
}

How to Run the API

Install dependencies:

npm install


Start the server:

node src/express-server.js
# or for dev with auto reload
npm run dev


Test endpoints using Postman or browser.


