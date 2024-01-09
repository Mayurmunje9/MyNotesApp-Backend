const connectToMongo = require("./db");
const cors = require("cors");
const express = require('express')
const app = express()
const port = 4000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use(cors());

app.use(express.json())
//Avalable routes 
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/notes',require('./Routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
connectToMongo();

// Your other server setup or application logic goes here
