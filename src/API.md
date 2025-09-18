Books API Documentation
Base URL

http://localhost:3000/api



Endpoints
1. Get All Books

GET /books

Query Parameters
sort = title | author | year
order = asc | desc (default: asc)
page = page number (default: 1)
limit = items per page (default: 10)

{
  "page": 1,
  "limit": 10,
  "total": 3,
  "data": [
    {
      "id": 1,
      "title": "White Boy Rick: My Time As an Undercover Teenage Drug Informant for the FBI",
      "author": "Richard Wershe Jr. & Scott Burnstein",
      "year": 2018,
      "genre": "Non-fiction / True Crime"
    },
    {
      "id": 2,
      "title": "Blacklist",
      "author": "Sara Paretsky",
      "year": 2003,
      "genre": "Crime / Mystery"
    }
  ]
}


2. Get Book Count
GET /books/count
Response Example:
{
  "count": 3
}


3. Search Books
GET /books/search?title=keyword&author=keyword
Response Example
[
  {
    "id": 1,
    "title": "White Boy Rick: My Time As an Undercover Teenage Drug Informant for the FBI",
    "author": "Richard Wershe Jr. & Scott Burnstein",
    "year": 2018,
    "genre": "Non-fiction / True Crime"
  }
]

4. Get Book by ID
GET /books/:id
Response Example
{
  "id": 2,
  "title": "Blacklist",
  "author": "Sara Paretsky",
  "year": 2003,
  "genre": "Crime / Mystery"
}

Error Example:
{
  "error": "Book not found"
}


5. Add New Book
POST /books
Request Example
{
  "title": "New Book",
  "author": "Author Name",
  "year": 2024,
  "genre": "Fiction"
}

Response Example
{
  "id": 4,
  "title": "New Book",
  "author": "Author Name",
  "year": 2024,
  "genre": "Fiction"
}

Errors:
400 Bad Request → invalid data or duplicate title


6. Update Book
PUT /books/:id
Request Example
{
  "title": "Updated Book",
  "author": "Updated Author",
  "year": 2020,
  "genre": "Thriller"
}

Response Example
{
  "id": 2,
  "title": "Updated Book",
  "author": "Updated Author",
  "year": 2020,
  "genre": "Thriller"
}

Errors:

400 Bad Request → invalid data
404 Not Found → book does not exist


7. Delete Book
DELETE /books/:id
Response Example
{
  "message": "Book deleted",
  "book": {
    "id": 3,
    "title": "The Girl with the Dragon Tattoo",
    "author": "Stieg Larsson",
    "year": 2005,
    "genre": "Crime / Mystery / Thriller"
  }
}

Error Example
{
  "error": "Book not found"
}

8. Server Status
GET /status
Response Example
{
  "status": "OK",
  "uptime": 123.45,
  "timestamp": "2025-09-15T14:30:00.000Z"
}


9. Server Time
GET /time
Response Example
{
  "currentTime": "2025-09-15T14:30:00.000Z"
}

How to Run
npm install
npm run dev

Postman Testing
Test all CRUD operations
Test error scenarios: invalid data, wrong ID
Test search and sorting (?title=, ?author=, ?sort=, ?order=, ?page=, ?limit=)

Code Quality
JSDoc comments added in functions
Centralized error handling
Removed console.log statements

Scripts in package.json:

 "test": "echo \"Error: no test specified\" && exit 1",
 "dev": "nodemon src/express-server.js"
  