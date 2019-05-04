var express = require('express');
var router = express.Router();
var mysql = express('mysql');
var config = require('./config.js');

/* GET users listing. */
router.get('/', function(req, res, next) {  

  var conn = mysql.createConnection(config);
  var sqlQuery = 'SELECT NOW()';

  conn.query(sqlQuery,(error,results,fields) =>
  {
    if(error)
      {
        console.log("Error");
        res.send('Error' +  error);
      }
      else{
        console.log("Resultados " + results);
        res.send('Results' +  results);
      }      
  });

  res.send(":D");
});

module.exports = router;
