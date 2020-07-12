const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const DefaultRoute = require('./API/Routes/DefaultRoute')
const login = require('./API/Routes/LoginUser')
const user = require('./API/Routes/RoutesUser')

// MONGOOSE CONNECTION
mongoose.connect('mongodb+srv://garvit_singh:qwsdcvyujkm@cluster0-tpxdq.mongodb.net/litehackathon?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch( err => console.log(`Error from mongoose connection ${err}`));

// USING EXTRA PACKAGES
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// ROUTES TO BE APPENDED HERE
app.use('/',DefaultRoute)
app.use('/ngo_',login)
app.use('/users',user)

// ERROR HANDLING
app.use((req,res,next)=>{
    err = new Error('Not Found');
    err.status = 404;
    next(err);
})
app.use((err, req, res , next)=> {
    res.status(err.status || 500);
    res.json({
        error : err.message
    })
})

module.exports = app
