require('dotenv').config()

const app = require('./app')
const http = require('http')

const server = http.createServer(app)

server.listen(3001, () => {
  console.log(`server running on port ${3001}`);
})

const start = async () => {
  await connectToDatabase()
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  })
}