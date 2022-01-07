const mysql = require('mysql');

const sqlconnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test2"
  });

  sqlconnect.connect((err)=>{
    if(err) throw err;
    let sqlquery = "CREATE TABLE IF NOT EXISTS person(USER_ID INT NOT NULL AUTO_INCREMENT, USERNAME VARCHAR(100) NOT NULL,CONTACT_NUMBER INT, PASSWORD VARCHAR(100) NOT NULL, IV VARCHAR(50), CREATE_DATE_TIME DATETIME NOT NULL, PRIMARY KEY(USER_ID))";
    sqlconnect.query(sqlquery,(err,result)=>{
        if(err) throw err;
    })
  })

  module.exports = sqlconnect