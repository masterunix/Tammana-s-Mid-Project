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
// POKEDEX EXPRESS.JS ASSIGNMENT
// Complete the 15 tasks below to make the React app work!
// ==========================================

// Task 2: CORS Middleware
// TODO: Use the `cors` package so the React app (port 5173) can communicate with this API.


// Task 3: JSON Parser Middleware
// TODO: Add Express middleware to parse incoming JSON bodies (`express.json()`).


// Task 5: Static Files
// TODO: Serve the `images` folder as static files at the `/images` route.


// Task 4: Health Route
// TODO: Create a `GET /api/health` route that returns `{ status: 'ok' }`.


// Task 8: Search Pokemon
// TODO: Create a `GET /api/pokemon/search` route. 
// It should read the `q` query parameter (`req.query.q`) and filter the pokemon array by name.


// Task 9: Filter by Type
// TODO: Create a `GET /api/pokemon/type/:type` route.
// It should filter the pokemon array where the type matches `req.params.type`.


// Task 6 & 10: Get All & Pagination
app.get('/api/pokemon', (req, res) => {
  const db = readDB();
  let results = db.pokemon;
  
  // Task 10: Pagination
  // TODO: If `req.query.limit` exists, only return that many pokemon (use `.slice()`).
  
  
  res.json(results); // Task 6 is partially done for you here!
});


// Task 7: Get by ID
// TODO: Create a `GET /api/pokemon/:id` route.
// Find the pokemon with the matching ID and return it. If not found, return a 404 status.


// Task 11 & 12: Create New & Validation
// TODO: Create a `POST /api/pokemon` route to add a new pokemon.
// Task 12: If `req.body.name` is missing, return a 400 status with an error message.
// Remember to push the new pokemon to the array and call `writeDB(db)`.


// Task 13: Update
// TODO: Create a `PUT /api/pokemon/:id` route.
// Find the pokemon by ID, update its properties with `req.body`, save to DB, and return the updated pokemon.


// Task 14: Delete
// TODO: Create a `DELETE /api/pokemon/:id` route.
// Remove the pokemon from the array, save to DB, and return a success message.


// Task 15: 404 Handler
// TODO: Add a catch-all middleware function here that returns a 404 status and a "Route not found" error.


// Task 1: Server Boot
// TODO: Tell the `app` to listen on the `PORT` defined at the top of the file.
