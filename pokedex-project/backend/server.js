const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Helper to read DB
const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// ==========================================
// POKEDEX EXPRESS.JS ASSIGNMENT (24 TASKS)
// Complete the tasks below to make the React app work!
// ==========================================

// Task 2: CORS Middleware
// TODO: Use the `cors` package so the React app (port 5173) can communicate with this API.


// Task 3: JSON Parser Middleware
// TODO: Add Express middleware to parse incoming JSON bodies (`express.json()`).


// Task 5: Static Files
// TODO: Serve the `images` folder as static files at the `/images` route.


// Task 4: Health Route
// TODO: Create a `GET /api/health` route that returns `{ status: 'ok' }`.


// ----------------------------------------------------
// IMPORTANT: Specific routes must go ABOVE dynamic routes (like `/:id`)
// ----------------------------------------------------

// Task 17: Get Total Count
// TODO: Create a `GET /api/pokemon/count` route.
// It should return the total number of pokemon: `{ total: X }`.


// Task 8: Search Pokemon
// TODO: Create a `GET /api/pokemon/search` route. 
// It should read the `q` query parameter (`req.query.q`) and filter the pokemon array by name.


// Task 9: Filter by Type
// TODO: Create a `GET /api/pokemon/type/:type` route.
// It should filter the pokemon array where the type matches `req.params.type`.


// Task 24: Get by Level
// TODO: Create a `GET /api/pokemon/level/:level` route.
// It should filter the pokemon array where the level matches `req.params.level`.


// ----------------------------------------------------
// GENERAL ROUTES
// ----------------------------------------------------

// Task 6, 10, 18, 19, 20: Get All, Sorting, and Pagination
app.get('/api/pokemon', (req, res) => {
  const db = readDB();
  let results = db.pokemon;
  
  // Task 18 & 19: Sorting
  // TODO: If `req.query.sort === 'name'`, sort results alphabetically.
  // TODO: If `req.query.sort === 'level'`, sort results by level (highest first).

  // Task 10 & 20: Pagination
  // TODO: If `req.query.skip` exists, skip that many items in the array.
  // TODO: If `req.query.limit` exists, only return that many items.
  
  res.json(results);
});


// Task 7: Get by ID
// TODO: Create a `GET /api/pokemon/:id` route.
// Find the pokemon with the matching ID and return it. If not found, return a 404 status.


// Task 11 & 12: Create New & Validation
// TODO: Create a `POST /api/pokemon` route to add a new pokemon.
// Task 12: If `req.body.name` is missing, return a 400 status with an error message.
// Remember to push the new pokemon to the array and call `writeDB(db)`.


// Task 13: Update All (PUT)
// TODO: Create a `PUT /api/pokemon/:id` route.
// Task 23: Validation - If name is empty or level < 0, return 400 Bad Request.
// Find the pokemon by ID, completely update its properties with `req.body`, save to DB.


// Task 21: Partial Update Level (PATCH)
// TODO: Create a `PATCH /api/pokemon/:id/level` route.
// Update ONLY the level of the specific pokemon based on `req.body.level`.
// Task 23: Validation - Return 400 if level is negative.


// Task 22: Partial Update Name (PATCH)
// TODO: Create a `PATCH /api/pokemon/:id/name` route.
// Update ONLY the name of the specific pokemon based on `req.body.name`.
// Task 23: Validation - Return 400 if name is empty.


// Task 14: Delete
// TODO: Create a `DELETE /api/pokemon/:id` route.
// Remove the specific pokemon from the array, save to DB, and return a success message.


// ----------------------------------------------------
// ERROR HANDLING (Must be at the bottom, before listen)
// ----------------------------------------------------

// Task 16: Global Error Route (For Testing)
app.get('/api/error', (req, res, next) => {
  next(new Error('This is a simulated server crash!'));
});

// Task 15: 404 Handler
// TODO: Add a catch-all middleware function `app.use((req, res) => ...)` 
// that returns a 404 status and a "Route not found" error.


// Task 16: Global Error Handler
// TODO: Add an error handling middleware `app.use((err, req, res, next) => ...)`
// that catches errors (like the one from `/api/error`) and returns a 500 status with the error message in JSON.


// Task 1: Server Boot
// TODO: Tell the `app` to listen on the `PORT` defined at the top of the file.
