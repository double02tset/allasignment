const express = require('express')
const Router = express.Router()
const sqlconnect = require('../connection')
const {crypt, privatekey} = require('./crypt')
const jwt = require('jsonwebtoken')

Router.post('/',(req,res)=>{
    if(!req.body.username || !req.body.password) return res.status(400).send('provid all information')
    let sqlquery = "SELECT * FROM person WHERE USERNAME=?"
    sqlconnect.query(sqlquery,[req.body.username],(err,result)=>{
        if(err) return res.status(500).send(err)
        if(result.length == 0) return res.status(404).send("username,password not found")
        result[0].PASSWORD = crypt({"content":result[0].PASSWORD,"iv":result[0].IV},'decrypt')
        if(result[0].PASSWORD != req.body.password || result[0].USERNAME != req.body.username) return res.status(404).send('username, password not found')
        delete result[0].IV
        const name ={name:req.body.username}
        const accessToken = jwt.sign(name, privatekey)
        return res.send(accessToken)
    })
})

module.exports = Router