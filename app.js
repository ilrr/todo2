const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
require('express-async-errors')

const { connectToDatabase } = require('./util/db')

const tasklistRouter = require('./controllers/tasklists')
const registerRouter = require('./controllers/register')
const loginRouter = require('./controllers/login')
const taskRouter = require('./controllers/task')
const { errorHandler } = require('./util/middleware')

app.use('/api/tasklists', tasklistRouter)
app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)
app.use('/api/task', taskRouter)

app.use(express.static('client/build'))

// a dirty fix because for some reason app won't route to manifest.json
app.get("/manifest.json", (req, res) => res.sendFile(`${__dirname}/client/build/manifest.json`))
app.get(/^\/(.*)/, (req, res) => res.sendFile(`${__dirname}/client/build/index.html`))

app.use(errorHandler)

module.exports = app