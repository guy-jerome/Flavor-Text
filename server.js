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
app.use(express.json());

// Socket.IO setup
setupSocketIO();

// Routes
app.post('/stream', streamHandler);
app.post('/streamsave', streamSaveHandler);
app.get('/worlds', getAllWorldsHandler);
app.get('/worlds/:id', getWorldByIdHandler);


const systemContent =
  "You are a professional dungeon master and creative writer with over 50 years of experience. \
  You specialize in writing the flavor text for TTRPGS. Your work is extremely creative and artistic. \
  You are helping write out the flavor text for a new ttrpg module. Given the basic dungeon, city, or town layout, \
  you are able to create a cohesive description of each room, building, and landmark. \
  You are precise and unique.";

// Route Handlers
async function streamHandler(req, res) {
  const { name, simpledes } = req.body;
  const userMessage = `Create the description of a fantasy world with the name of ${name} using the basic description of ${simpledes}`;
  const fullDescription = await chatgtp(req, userMessage,systemContent)
  //const fullDescription = await generateText(req, res, name, simpledes);
  res.status(200).json({ message: "stream complete" });
}

async function streamSaveHandler(req, res) {
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
