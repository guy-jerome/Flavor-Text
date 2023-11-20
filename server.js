const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const { pool, dataBaseQuery} = require('./db.js');
const chatgtp = require('./chatgtp.js')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const cookieParser = require("cookie-parser")
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
app.use(cookieParser())
// Socket.IO setup
setupSocketIO();


//Authorization 
const authorization = (req, res, next) =>{
  const token = req.cookies.jwtToken;
  if (!token){
      return res.sendStatus(403)
  }
  try{
      const data =jwt.verify(token, process.env.JWT_SECRET)
      req.username = data.username
      req.id = data.id
      return next();
  }catch{
      return res.sendStatus(403)
  }
}

// Routes
// Login Check
app.get('/loginCheck', authorization, (req,res)=>{
  res.status(200).json({username:req.username, id:req.id})
})
// SignUp
app.post('/signup', signupHandler)
// Login
app.post('/login',  loginHandler)
// LogOut
app.get('/logout', (req, res) => {
  res.clearCookie('jwtToken'); 
  res.status(200).json({message:"User Logged Out"})
});
// World
app.post('/world-stream',authorization, worldStreamHandler);
app.post('/world-save',authorization, worldSaveHandler);
app.get('/worlds',authorization, getAllWorldsHandler);
app.get('/worlds/:id',authorization, getWorldByIdHandler);
// Area
app.post('/area-stream',authorization, areaStreamHandler);
app.post('/area-save',authorization, areaSaveHandler);
app.get('/areas',authorization, getAllAreasHandler);
app.get('/areas/:id',authorization, getAreaByIdHandler);
// Location
app.post('/location-stream',authorization, locationStreamHandler);
app.post('/location-save', authorization,locationSaveHandler);
app.get('/locations',authorization, getAllLocationsHandler);
app.get('/locations/:id',authorization, getLocationByIdHandler);


app.use((error,res)=>{
  console.log(error)
  res.status(500).json({error:"Internal Error"})
})

// Route Handlers
// SignUp
async function signupHandler(req,res,next){
  try{
  const {username, password} = req.body
  const data = await dataBaseQuery('SELECT username FROM users WHERE username = $1', [username])
  if(data.length > 0){
    res.status(400).json({message: "Username Already Taken"}) 
  }else{
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password,salt)
    await dataBaseQuery('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPass])
    res.status(201).json({message: 'Entry added successfully'})
  }
  }catch (error){
    next(error)
  }
}
// Login
async function loginHandler(req,res,next){
  const {username, password} = req.body
  const data = await dataBaseQuery('SELECT username, password, id FROM users WHERE username = $1', [username])
  if (data.length === 1){
    const hashedPass = data[0].password
    const id = data[0].id
    bcrypt.compare(password, hashedPass, (error, match)=>{
        if (error){
            next(error)
        }else if(match){
            const token = jwt.sign({username,id}, process.env.JWT_SECRET, { expiresIn: '1h'});
            const cookieOptions = {
                maxAge: 3600000,
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production'
            };
            res.setHeader('Set-Cookie', cookie.serialize('jwtToken', token, cookieOptions));
            res.status(200).json({message: 'Authenticated'})
        }else{
            res.status(401).json({error: 'Authentication Failed'})
        }
    })
  }else{
    res.status(404).json({error: 'User not found'})
  }
}
// World
async function worldStreamHandler(req, res,next) {
  try{
  const { name, simpledes } = req.body;
  const userMessage = `Create the description of a fantasy world with the name of ${name} using the basic description of ${simpledes}`;
  const fullDescription = await chatgtp(req, userMessage,systemContent)
  res.status(200).json({ message: "stream complete" });
  }catch (error){
    next(error)
  }
}

async function worldSaveHandler(req, res,next) {
  try{
  const { name, simpledes, fulldes} = req.body;
  const data = await dataBaseQuery('INSERT INTO worlds (name, simpledes, fulldes, user_id) VALUES ($1,$2,$3,$4) RETURNING *;', [name, simpledes, fulldes, req.id])
  res.status(200).json({ message: "world saved" });
  }catch (error){
    next(error)
  }
}

async function getAllWorldsHandler(req, res,next) {
  try{
  const data = await dataBaseQuery('SELECT name, id FROM worlds WHERE user_id = $1;', [req.id]);
  res.status(200).json(data);
  }catch (error){
    next(error)
  }
}

async function getWorldByIdHandler(req, res,next) {
  try{
  const data = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1', [req.params.id]);
  res.status(200).json(data);
  }catch (error){
    next(error)
  }
}
// Area
async function areaStreamHandler(req, res,next) {
  try{
  const { name, simpledes, world } = req.body;
  const currentWorld = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1',[world])
  const userMessage = `Create the description of a fantasy area within ${currentWorld[0].name || "fantasy world"} with this description: ${currentWorld[0].fulldes || "no description"} with the name of ${name} using the basic description of ${simpledes}`;
  const fullDescription = await chatgtp(req, userMessage, systemContent);
  res.status(200).json({ message: "stream complete" });
  }catch (error){
    next(error)
  }
}

async function areaSaveHandler(req, res,next) {
  try{
  const { name, simpledes, fulldes, world} = req.body;
  const data = await dataBaseQuery('INSERT INTO areas (name, simpledes, fulldes, world_id, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;', [name, simpledes, fulldes, world, req.id]);
  res.status(200).json({ message: "area saved" });
  }catch (error){
    next(error)
  }
}

async function getAllAreasHandler(req, res,next) {
  try{
  const data = await dataBaseQuery('SELECT name, id FROM areas WHERE user_id = $1;', [req.id]);
  res.status(200).json(data);
  }catch (error){
    next(error)
  }
}

async function getAreaByIdHandler(req, res,next) {
  try{
  const data = await dataBaseQuery('SELECT * FROM areas WHERE id = $1', [req.params.id]);
  res.status(200).json(data);
  }catch (error){
    next(error)
  }
}
// Location
async function locationStreamHandler(req, res,next) {
  try{
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
  }catch (error){
    next(error)
  }
}

async function locationSaveHandler(req, res,next) {
  try{
  const { name, simpledes, fulldes, area, monsters} = req.body;
  const data = await dataBaseQuery('INSERT INTO locations (name, simpledes, fulldes, area_id, monsters, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;', [name, simpledes, fulldes, area, monsters, req.id]);
  res.status(200).json({ message: "location saved" });
  }catch (error){
    next(error)
  }
}

async function getAllLocationsHandler(req, res,next) {
  try{
  const data = await dataBaseQuery('SELECT name, id FROM locations WHERE user_id = $1', [req.id]);
  res.status(200).json(data);
  }catch (error){
    next(error)
  }
}

async function getLocationByIdHandler(req, res,next) {
  try{
    const data = await dataBaseQuery('SELECT * FROM locations WHERE id = $1', [req.params.id]);
    res.status(200).json(data);
  }catch (error){
    next(error)
  }

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
