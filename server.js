
const OpenAI = require('openai');
const dotenv = require('dotenv');
const pool = require('./db.js');
const { pipeline } = require('stream');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"))
app.use(express.json())

io.on('connection', (socket) => {
  console.log('A user connected');

  app.set('socket', socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.post('/stream', async (req, res)=>{
  const {name, simpledes } = req.body
  const fullDescription = await generateText(req,res,name,simpledes)
  res.status(200).json({message: "stream complete"})
})

app.post('/streamsave', async (req, res)=>{
  
  const {name, simpledes,fulldes} = req.body
  const data = await postWorld(name,simpledes,fulldes)
  res.status(200).json({message:"world saved"})
})

app.get('/worlds', async (req,res)=>{
  const data = await dataBaseQuery('SELECT name, id FROM worlds;')
  res.status(200).json(data)
})

app.get('/worlds/:id', async (req,res)=>{
  const data = await dataBaseQuery('SELECT * FROM worlds WHERE id = $1', [req.params.id])
  res.status(200).json(data)
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


async function dataBaseQuery(query,args = []){
  const client = await pool.connect();
  try{
    const response = await client.query(query,args)
    return response.rows
  }catch (err){
    console.error('Error executing database query:', err)
    return err
  }finally{
    client.release()
  }
}


async function postWorld(name,simpledes, fulldes) {
  const client = await pool.connect();
  try{
    const response = await client.query('INSERT INTO worlds (name, simpledes, fulldes) VALUES ($1,$2,$3) RETURNING *;',[name,simpledes,fulldes])
    return response.rows
  }catch (err){
    return err
  }finally{
    client.release()
  }
}


const openai = new OpenAI({ apiKey: process.env.CHATGTP_API_KEY });

const systemContent =
  "You are a professional dungeon master and creative writer with over 50 years of experience.\
 You specialize in writing the flavor text for TTRPGS. Your work is extremely creative and artistic. You are helping write out the flavor text \
 for a new ttrpg module. Given the basic dungeon, city, or town layout, you are able to create a cohesive description of each room, building, and landmark.\
 You are precise and unique.";


async function generateText(req, res, name, simpledes) {
  const userMessage = `Create the description of a fantasy world with the name of ${name} using the basic description of ${simpledes}`
  const socket = req.app.get('socket')
  const completionStream = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userMessage},
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
  });
  let text = ""
  for await (const chunk of completionStream) {
    
    if (chunk.choices[0].delta.content){
      socket.emit('stream-chunk', chunk.choices[0].delta.content);
      text +=chunk.choices[0].delta.content
    } 
  }
  return text
}
