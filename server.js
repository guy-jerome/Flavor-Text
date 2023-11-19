const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { pipeline } = require('stream');
const dotenv = require('dotenv');
const { pool, dataBaseQuery} = require('./db.js');
const chatgtp = require('./chatgtp.js')

// Load environment variables
dotenv.config();

// Express setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.static("public"));
app.use(express.static('node_modules'));
app.use(express.json());

// Socket.IO setup
setupSocketIO();

// Routes

// World
app.post('/world-stream', worldStreamHandler);
app.post('/world-save', worldSaveHandler);
app.get('/worlds', getAllWorldsHandler);
app.get('/worlds/:id', getWorldByIdHandler);
// Area
app.post('/area-stream', areaStreamHandler);
app.post('/area-save', areaSaveHandler);
app.get('/areas', getAllAreasHandler);
app.get('/areas/:id', getAreaByIdHandler);
// Location
app.post('/location-stream', locationStreamHandler);
app.post('/location-save', locationSaveHandler);
app.get('/locations', getAllLocationsHandler);
app.get('/locations/:id', getLocationByIdHandler);


// Route Handlers

// World
async function worldStreamHandler(req, res) {
  const { name, simpledes } = req.body;
  const userMessage = `Create the description of a fantasy world with the name of ${name} using the basic description of ${simpledes}`;
  const fullDescription = await chatgtp(req, userMessage,systemContent)
  res.status(200).json({ message: "stream complete" });
}

async function worldSaveHandler(req, res) {
  const { name, simpledes, fulldes } = req.body;
  const data = await dataBaseQuery('INSERT INTO worlds (name, simpledes, fulldes) VALUES ($1,$2,$3) RETURNING *;', [name, simpledes, fulldes])
  res.status(200).json({ message: "world saved" });
}

async function getAllWorldsHandler(req, res) {
  const data = await dataBaseQuery('SELECT name, id FROM worlds;');
  res.status(200).json(data);
}

async function getWorldByIdHandler(req, res) {
  const data = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1', [req.params.id]);
  res.status(200).json(data);
}
// Area
async function areaStreamHandler(req, res) {
  const { name, simpledes, world } = req.body;
  const currentWorld = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1',[world])
  const userMessage = `Create the description of a fantasy area within ${currentWorld[0].name || "fantasy world"} with this description: ${currentWorld[0].fulldes || "no description"} with the name of ${name} using the basic description of ${simpledes}`;
  const fullDescription = await chatgtp(req, userMessage, systemContent);
  res.status(200).json({ message: "stream complete" });
}

async function areaSaveHandler(req, res) {
  const { name, simpledes, fulldes, world } = req.body;
  const data = await dataBaseQuery('INSERT INTO areas (name, simpledes, fulldes, world_id) VALUES ($1,$2,$3,$4) RETURNING *;', [name, simpledes, fulldes, world]);
  res.status(200).json({ message: "area saved" });
}

async function getAllAreasHandler(req, res) {
  const data = await dataBaseQuery('SELECT name, id FROM areas;');
  res.status(200).json(data);
}

async function getAreaByIdHandler(req, res) {
  const data = await dataBaseQuery('SELECT * FROM areas WHERE id = $1', [req.params.id]);
  res.status(200).json(data);
}
// Location
async function locationStreamHandler(req, res) {
  const { name, simpledes, area, monsters } = req.body;
  
  const currentArea = await dataBaseQuery('SELECT * FROM areas WHERE id = $1',[area])
  const currentWorld = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1',[currentArea[0].world_id])
  const userMessage = `Create the description of a fantasy location within ${currentArea[0].name || "fantasy world"}
  with this description: ${currentArea[0].fulldes || "no description"} within ${currentWorld[0].name || "fantasy world"}
  with this description: ${currentWorld[0].fulldes || "no description"} with the name of ${name} 
  using the basic description of ${simpledes}
  populated with ${monsters.join() || "No monsters" }`;
  const fullDescription = await chatgtp(req, userMessage, systemContent);
  res.status(200).json({ message: "stream complete" });
}

async function locationSaveHandler(req, res) {
  const { name, simpledes, fulldes, area, monsters } = req.body;
  const data = await dataBaseQuery('INSERT INTO locations (name, simpledes, fulldes, area_id, monsters) VALUES ($1,$2,$3,$4,$5) RETURNING *;', [name, simpledes, fulldes, area, monsters]);
  res.status(200).json({ message: "location saved" });
}

async function getAllLocationsHandler(req, res) {
  const data = await dataBaseQuery('SELECT name, id FROM locations;');
  res.status(200).json(data);
}

async function getLocationByIdHandler(req, res) {
  const data = await dataBaseQuery('SELECT * FROM locations WHERE id = $1', [req.params.id]);
  res.status(200).json(data);
}


// Socket.IO Setup function
function setupSocketIO() {
  io.on('connection', (socket) => {
    console.log('A user connected');
    app.set('socket', socket);
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// TEMPLATES
const systemContent =
  "You are a professional dungeon master and creative writer with over 50 years of experience. \
  You specialize in writing the flavor text for TTRPGS. Your work is extremely creative and artistic. \
  You are helping write out the flavor text for a new ttrpg module. Given the basic dungeon, city, or town layout, \
  you are able to create a cohesive description of each room, building, and landmark. \
  You are precise and unique.";
