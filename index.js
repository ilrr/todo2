require('dotenv').config();

const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  // console.log(`rejectUnauthorized: ${process.env.DATABASE_URL !== "localhost"}`)
  console.log(`server running on port ${PORT}`);
});

// const start = async () => {
//   await connectToDatabase()
//   app.listen(PORT, () => {
//     console.log(`server running on port ${PORT}`);
//   })
// }
