const http = require('http')
const app = require('./app')

const PORT = process.env.PORT || 1001

const server = http.createServer(app)

server.listen(PORT , () => console.log(`Server Running on PORT ${PORT}...`))