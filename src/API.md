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
  

  Task 11 Oward : 

API Documentation
Base URL:

http://localhost:3000/api/v1



Models:

User Schema:

Field	Type	Required	Description
_id	ObjectId	Yes	Unique identifier
username	String	Yes	Unique username
email	String	Yes	Unique email address
password	String	Yes	Hashed password
firstName	String	Yes	User’s first name
lastName	String	Yes	User’s last name
createdAt	Date	Auto	Timestamp when user created
updatedAt	Date	Auto	Timestamp when user updated




Book Schema:

Field	Type	Required	Description
_id	ObjectId	Yes	Unique identifier
title	String	Yes	Title of the book
author	String	Yes	Author name
year	Number	No	Year of publication
genre	String	No	Genre of the book
userId	ObjectId	Yes	Reference to User (User._id)
createdAt	Date	Auto	Timestamp when book was created
updatedAt	Date	Auto	Timestamp when book was last modified



Relationship:
One-to-Many:
A User can have many Books.
Relation: Book.userId → User._id



Book API Endpoints
Get All Books

GET /books
Query Parameters:

sort = title | author | year
order = asc | desc (default: asc)
page = page number (default: 1)
limit = items per page (default: 10)

Response:

{
  "page": 1,
  "limit": 10,
  "total": 2,
  "data": [
    {
      "id": 1,
      "title": "White Boy Rick",
      "author": "Richard Wershe Jr.",
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




Get Book Count

GET /books/count
{ "count": 3 }


Search Books

GET /books/search?title=keyword&author=keyword

[
  {
    "id": 1,
    "title": "White Boy Rick",
    "author": "Richard Wershe Jr.",
    "year": 2018,
    "genre": "Non-fiction / True Crime"
  }
]

Get Book by ID

GET /books/:id

{
  "id": 2,
  "title": "Blacklist",
  "author": "Sara Paretsky",
  "year": 2003,
  "genre": "Crime / Mystery"
}


Error:

{ "error": "Book not found" }

Add New Book

POST /books
Request:

{
  "title": "New Book",
  "author": "Author Name",
  "year": 2024,
  "genre": "Fiction"
}


Response:

{
  "id": 4,
  "title": "New Book",
  "author": "Author Name",
  "year": 2024,
  "genre": "Fiction"
}


Errors:
400 Bad Request → invalid data or duplicate title

Update Book

PUT /books/:id

{
  "title": "Updated Book",
  "author": "Updated Author",
  "year": 2020,
  "genre": "Thriller"
}


Response:

{
  "id": 2,
  "title": "Updated Book",
  "author": "Updated Author",
  "year": 2020,
  "genre": "Thriller"
}


Errors:

400 Bad Request → invalid data
404 Not Found → book not found

Delete Book

DELETE /books/:id
Response:

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


Error:

{ "error": "Book not found" }

User API Endpoints
Create User

POST /users
Request:

{
  "username": "asad123",
  "email": "asad@example.com",
  "password": "hashedpass",
  "firstName": "Asad",
  "lastName": "Nouman"
}


Response:

{
  "id": "652ac8...",
  "username": "asad123",
  "email": "asad@example.com",
  "firstName": "Asad",
  "lastName": "Nouman"
}

Get All Users
GET /users

Get User by ID
GET /users/:id

Update User
PUT /users/:id

Delete User
DELETE /users/:id


Utility Endpoints:

GET /status → server health info
GET /time → current server time


Database Scripts:

npm run db:migrate → create collections
npm run db:seed → insert sample data
npm run db:drop → drop collections
npm run db:reset → drop + migrate + seed


Error Handling:

500 → Database/server errors
503 → DB unavailable
409 → Duplicate key (E11000)
400 → Validation errors
404 → Resource not found


Logging:

Every request logged → method, path, status, response time
Errors logged with stack trace in dev
Only safe messages logged in production