const express = require('express')
const bodyparser = require('body-parser')
const mysqlConnect = require('./connection')
const person = require('./routes/person')
const login = require('./routes/login')
const app = express()

app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}))
app.use('/login',login)
app.use('/person',person)


app.get('/',(req,res)=>{
    res.send(req.query.arr)
})

app.listen(3000,()=>{
    console.log("app running")
})
