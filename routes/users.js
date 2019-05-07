var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');
var XLSX = require('xlsx');
var multiparty = require('multiparty');

//var request = require('request');

/* GET users listing. */
router.get('/time', function(req, res, next) {  

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
        console.log("Resultados " + JSON.stringify(results));
        res.send('Results' +  results.Resultados);
      }      

      conn.end();
  });

  //res.send(":D");
});

router.post('/data',function(req,res,next) {

  console.log("Params "  + JSON.stringify(req.params));
  console.log("Body " + JSON.stringify(req.body));

  /*
  var fileExcel = req.body.file;  
  var wb = XLSX.readFile(fileExcel);
	// generate array of arrays 
  data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
  console.log(data);
  */

  var form = new multiparty.Form();
	  
  form.parse(req, function(err, fields, files) {
        console.log("Files " + files); // do whatever you want with uploaded file(s)
        var wb = XLSX.readFile(files.archivoExcel[0].path);
 

      
      sqlTruncate = "TRUNCATE TABLE ProjectVSLoss;TRUNCATE TABLE LossVSTool;TRUNCATE TABLE EmpleadoVSTool;";
      connectionTruncate = mysql.createConnection(config);
      connectionTruncate.query(sqlTruncate,(error,results,fields) => {
        if(error)
          console.log(error);
      });

      



      loss = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
      for(i = 0; i < loss.length; i++)
      {
        connection = mysql.createConnection(config);  
        
        sqlQuery = "CALL NUEVA_LOSS(?);"
        var stringLoss = loss[i][0];
        console.log(i + " : " + stringLoss);
        connection.query(sqlQuery,[stringLoss],(error,results,fields) =>
        {
          //console.log(stringLoss);
          if(error)
            {
              console.log("Error");
              res.send('Error' +  error);
            }                          
        });

        //console.log("Loss " + loss[i][0]);
      }
      //console.log(data);



      var tools = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]], {header:1});
      var superQueryTools  = "";
      for(i = 1; i < tools.length; i++)
      {
        
        for(j = 0; j < 3; j++)
        {
          //console.log("Basic tool: " + tools[i][0] + " Intermediate tool:  " + tools[i][1] + " Advanced tool: " + tools[i][2]);          
          switch(j)
          {
            case 0:
            {
              if(tools[i][j] != undefined){
                console.log(j + " " + tools[i][j]);

              //connection = mysql.createConnection(config);  
              sqlQuery = "CALL NUEVA_TOOL(1,'"+ tools[i][j] +"');";
              superQueryTools = superQueryTools + sqlQuery;
              //connection.query(sqlQuery,[1,tools[i][j]]);
              }
              break;
            }
            case 1:
            {
              if(tools[i][j] != undefined){
                console.log(j + " " + tools[i][j]);
              
              //connection = mysql.createConnection(config);  
              sqlQuery = "CALL NUEVA_TOOL(2,'"+ tools[i][j] +"');";
              superQueryTools = superQueryTools + sqlQuery;
              //connection.query(sqlQuery,[2,tools[i][j]]);
              }
              break;
            }
            case 2:
            {
              if(tools[i][j] != undefined){
                console.log(j + " " + tools[i][j]);
              
              //connection = mysql.createConnection(config);  
              sqlQuery = "CALL NUEVA_TOOL(3,'"+ tools[i][j] +"');";
              superQueryTools = superQueryTools + sqlQuery;
              //connection.query(sqlQuery,[3,tools[i][j]]);
              }
              break;
            }
          }
        }        
      }

      connectionTools = mysql.createConnection(config);
      connection.query(superQueryTools);
      connection.end();



    
      var projects = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]], {header:1});

      for(i = 1; i < projects.length; i++)
      {
        connection = mysql.createConnection(config);  
        sqlQuery = "CALL NUEVO_PROJECT(?,?)";
        connection.query(sqlQuery,[projects[i][0],projects[i][1]]);
        console.log("Project " + projects[i][0] + " Saving " + projects[i][1]);
      }



      var employees = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[3]], {header:1});
      var superQueryEmployees = '';
      for(i = 1; i < employees.length; i++)
      {        
        sqlQuery = "CALL NUEVO_EMPLEADO(\'" + employees[i][3] + "\',\'" + employees[i][0] + "\',\'" + employees[i][1] + "\',\'" + employees[i][2] + "\');";        
        superQueryEmployees = superQueryEmployees + sqlQuery;       
        console.log("Número " + employees[i][0] + " Nombre " + employees[i][1]  + " Puesto " + employees[i][2] + " Eneatipo "  + employees[i][3]);
      }

      connectionEmployees = mysql.createConnection(config);  
      connectionEmployees.query(superQueryEmployees);





      var lossVStools = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[4]], {header:1});
      var parameters = [];
      //var superQuery = 'CALL NUEVO_LOSS_VS_TOOL(?,?);';  
      var superQuery = '';      
      var counter = 0;
      for(i = 4; i < 47; i++){ //47
        for(j = 2; j <= 121; j++) //121
        {
          if(lossVStools[i][j] == 1){                        
            parameters.push( lossVStools[i][1],lossVStools[2][j]);
            sqlQuery = 'CALL NUEVO_LOSS_VS_TOOL(\''+lossVStools[i][1]+'\',\''+lossVStools[2][j]+'\');';
            //sqlQuery = "INSERT INTO `LossVSTool`(`idLoss`,`idTool`) VALUES (\'"+lossVStools[i][1]+"\',\'"+lossVStools[2][j]+"\');"
            superQuery = superQuery + sqlQuery;            
            counter++;
            console.log("Loss vs tool :::  Loss: " + lossVStools[i][1] + " Tool: " + lossVStools[2][j] + " Activo " + lossVStools[i][j]);            
          }
        }        
      }
      console.log("total " + counter);
      console.log(parameters);
      console.log(superQuery);
      connectionLossVStools = mysql.createConnection(config);  
      connectionLossVStools.query(superQuery,parameters,(error,results,fields) => {
        if(error)
          console.log(error);
      });
      connectionLossVStools.end();

    

   
      var projectsVSloss = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[5]], {header:1});
      //var superQueryProjectVSLoss = 'CALL NUEVO_PROJECT_VS_LOSS(?,?);';
      var superQueryProjectVSLoss = '';
      var paramsProjectVSLoss = [];
      for(i = 1; i < projectsVSloss.length; i++)
      {
        for(j = 2; j <= 7; j++)
        {
          if(projectsVSloss[i][j] != undefined)
          {            

            str1 = projectsVSloss[i][1];            
            str2 = projectsVSloss[i][j];            

            paramsProjectVSLoss.push(str1);
            paramsProjectVSLoss.push(str2);
            
           //sqlQuery = 'CALL NUEVO_PROJECT_VS_LOSS(\''+str1+'\',\''+str2+'\');';
           sqlQuery = 'CALL NUEVO_PROJECT_VS_LOSS(?,?);';

           superQueryProjectVSLoss =  superQueryProjectVSLoss + sqlQuery;
            //console.log("Project vs loss: " + "Project: " + projectsVSloss[i][1] + " Loss: " + projectsVSloss[i][j]);
            console.log(sqlQuery);
          }
        }
      }

      console.log(superQueryProjectVSLoss);
      connectionprojectsVSloss = mysql.createConnection(config);  
      connectionprojectsVSloss.query(superQueryProjectVSLoss,paramsProjectVSLoss,(error,results,fields) => {
        if(error)
          console.log(error);
      });
      connectionprojectsVSloss.end();



      var personelVStools = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[6]], {header:1});

      var superQueryPersonelVSTools = '';
      var paramsPersonelVSTools = [];

      for(i = 4; i < 47; i++){
        for(j = 2; j <= 121; j++) 
        {
          if(personelVStools[i][j] === 1)
          {
            sqlQuery  = "CALL NUEVO_PERSONEL_VS_TOOL(?,?);";
            superQueryPersonelVSTools = superQueryPersonelVSTools + sqlQuery;
            paramsPersonelVSTools.push(personelVStools[i][0],personelVStools[2][j]);
             console.log("Personel vs tool personel: " + personelVStools[i][0] + " Tool " + personelVStools[2][j] + " Activo " + personelVStools[i][j]);
          }
        }        
      }

      connectionPersonelVSTools = mysql.createConnection(config);  
      connectionPersonelVSTools.query(superQueryPersonelVSTools,paramsPersonelVSTools,(error,results,fields) => {
        if(error)
          console.log(error);
      });
      connectionPersonelVSTools.end();

      /*
      var eneagrama = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[7]], {header:1});
      var parametersEneagrama = [];
      var superQueryEneagrama = '';
      for(i = 1; i < eneagrama.length; i++)
      {        
          sqlQuery  = 'INSERT INTO `Triada`(`idEneagrama`, `idEneagrama2`, `idEneagrama3`) VALUES (?,?,?);';
          parametersEneagrama.push( eneagrama[i][0], eneagrama[i][1], eneagrama[i][2]);
          superQueryEneagrama =  superQueryEneagrama + sqlQuery;

          console.log("1: " + eneagrama[i][0] +  " 2: " + eneagrama[i][1] + " 3: " + eneagrama[i][2]);
      }

      connectionEneagrama = mysql.createConnection(config);  
      connectionEneagrama.query(superQueryEneagrama,parametersEneagrama,(error,results,fields) => {
        if(error)
          console.log(error);
      });
      connectionEneagrama.end();
*/
      

      res.send(":D");
  });

});

module.exports = router;
