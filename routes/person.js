const express = require('express')
const Router = express.Router()
const sqlconnect = require('../connection')
const {crypt, privatekey} = require('./crypt')
const jwt = require('jsonwebtoken')
const { resume } = require('../connection')

Router.post('/',(req,res)=>{
    if(!req.body.user_id || !req.body.username || !req.body.contact_number || !req.body.password){
        return res.send("provid necessary data")
    }
    let per_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let encpassword = crypt(req.body.password,'encrypt')
    let sqlquery = "INSERT INTO person (USER_ID, USERNAME, CONTACT_NUMBER, PASSWORD, IV, CREATE_DATE_TIME) VALUES ?";
    let values = [[req.body.user_id,req.body.username,req.body.contact_number,encpassword.content, encpassword.iv, per_date]]
    sqlconnect.query(sqlquery,[values],(err)=>{
        if(err){
            return res.send(err)
        }
        return res.send('stored successfully')
    })
})

Router.get('/', allow, (req,res)=>{
    let sqlquery = "SELECT * FROM person ORDER BY CREATE_DATE_TIME ASC";
    sqlconnect.query(sqlquery,(err,result)=>{
        if(err) return res.send(err)
        let resobj = result
        for(i in resobj){  
            resobj[i].PASSWORD = crypt({"content":resobj[i].PASSWORD,"iv":resobj[i].IV},'decrypt')
            delete resobj[i].IV
        }
        res.send(resobj)
    })
})

Router.get('/:id', allow, (req,res)=>{
    let sqlquery = "SELECT * FROM person WHERE USER_ID=?";
    sqlconnect.query(sqlquery,[req.params.id],(err,result)=>{
        if(err) return res.send(err)
        result[0].PASSWORD = crypt({"content":result[0].PASSWORD,"iv":result[0].IV},'decrypt')
        delete result[0].IV
        res.status(200).send(result)
    })
})

Router.delete('/',allow, (req,res)=>{
    let sqlquery = "DELETE FROM person WHERE USER_ID IN (?)"
    sqlconnect.query(sqlquery,[req.query.id],(err,result)=>{
        if(err) return res.send(err)
        res.status(200).send('deleated user')
    })
})

function allow(req,res,next){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, privatekey,(err,usee)=>{
        if(err) return res.sendStatus(401)
        next()
    })
}

module.exports = Router