var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');
var XLSX = require('xlsx');
var multiparty = require('multiparty');
//var request = require('request');

/* GET users listing. */
/*
router.post('/time', function(req, res, next) {  

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
        res.render('index', { title:  results});
      }      

      conn.end();
  });

  //res.send(":D");
});*/

router.post('/projectVsTool',function(req,res){  
  idProyecto = req.body.idProyecto;
  sqlQuery = "SELECT Project.nombre, Tool.idTool FROM Project INNER JOIN ProjectVSLoss ON Project.idProject = ProjectVSLoss.Project_idProject INNER JOIN Loss ON ProjectVSLoss.Loss_idLoss = Loss.idLoss INNER JOIN LossVSTool ON Loss.idLoss = LossVSTool.idLoss INNER JOIN Tool ON LossVSTool.idTool = Tool.idTool WHERE Project.idProject = ?;";
  connection = mysql.createConnection(config);
  connection.query(sqlQuery,[idProyecto],(error,results,fields)=>{
  if(error)
  {
    console.log(error);
  }      
    res.send(results);  
  });
});


router.post('/formarEquipos',function(req,res){  
  res.send(req.body.idLeader + " " + req.body.tamano);
});

router.post('/empleades',function(req,res){
  sqlQuery = "SELECT Empleado.idEmpleado FROM Empleado;";
  connection = mysql.createConnection(config);
  connection.query(sqlQuery,(error,results,fields)=>{
  if(error)
  {
    console.log(error);
  }{    
    ids = []
    for(i = 0; i < results.length; i++)
    {
      ids.push(results[i].idEmpleado);
    }
    res.send(ids);
  }
  });
});

router.post('/empleatipos',function(req,res){
  sqlQuery = "call OBTENER_COMPATIBILIDAD();";
  connection = mysql.createConnection(config);
  
  connection.query(sqlQuery,(error,results,fields)=>{

  if(error)
  {
    console.log(error);
  }  
    
  console.log(results[0]);    
  //console.log(results[0].length);
    empleados = [
      {
        "1":[],
        "2":[],
        "3":[],
        "4":[],
        "5":[],
        "6":[],
        "7":[],
        "8":[],
        "9":[]
      }
    ];
    eneatipo = 1;
    for(i = 0; i < results[0].length; i++)
    {               
      console.log(results[0][i].eneatipo + " " + results[0][i].eneatipoCompatible);
      switch(results[0][i].eneatipo){
          case 1:
          {
            empleados[0][1].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 2:
          {
            empleados[0][2].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 3:
          {
            empleados[0][3].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 4:
          {
            empleados[0][4].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 5:
          {
            empleados[0][5].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 6:
          {
            empleados[0][6].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 7:
          {
            empleados[0][7].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 8:
          {
            empleados[0][8].push(results[0][i].eneatipoCompatible);            
            break;
          }
          case 9:
          {
            empleados[0][9].push(results[0][i].eneatipoCompatible);            
            break;
          }

      }      
  }
  res.send(empleados);  
  });

});

router.post('/apoyo',function(req,res,next){
  sqlQuery = "CALL REUNIR_HEROES_DE_APOYO(?,?)";
  connection = mysql.createConnection(config);

  empleado = req.body.empleado;
  proyecto = req.body.proyecto;

  console.log(empleado + " " + proyecto);

  connection.query(sqlQuery,[empleado,proyecto],(error,results,fields)=>{

    if(error)
    {
      console.log(error);
    }{
      console.log(results);
      res.send(results);
    }
  });

});

router.post('/vengadores',function(req,res,next){

  sqlQuery = "CALL REUNIR_VENGADORES(?,?)";
  connection = mysql.createConnection(config);

  empleado = req.body.empleado;
  proyecto = req.body.proyecto;

  console.log(empleado + " " + proyecto);

  connection.query(sqlQuery,[empleado,proyecto],(error,results,fields)=>{

    if(error)
    {
      console.log(error);
    }{
      console.log(results);
      res.send(results);
    }
  });

});

router.post('/proyectos',function(req,res,next){

        sqlQuery = "SELECT datawarehouse.PROYECTO, datawarehouse.ID_PROJECTO, datawarehouse.EMPLEADO, datawarehouse.ID_EMPLEADO,datawarehouse.ENEATIPO FROM datawarehouse WHERE datawarehouse.ID_PROJECTO = ? AND (datawarehouse.ENEATIPO = 1 OR datawarehouse.ENEATIPO = 7 OR datawarehouse.ENEATIPO = 8) GROUP BY datawarehouse.PROYECTO, datawarehouse.ID_PROJECTO, datawarehouse.EMPLEADO, datawarehouse.ID_EMPLEADO, datawarehouse.ENEATIPO";
        //sqlQuery = "SELECT * FROM Project";
        connection = mysql.createConnection(config);
        
        
        console.log(req.body.key);
        
        connection.query(sqlQuery,[req.body.key],(error,results,fields)=>
        {
          //console.log(sqlQuery);
          if(error)
          {
            console.log(error);
            res.send(error);
          }else{
              //console.log("Aqui");
              console.log(results);
              res.send(results);  
          }                  
        }); 
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
        

        if(files.archivoExcel[0].size != 0)
        {
        console.log("Va a estart null");


        console.log("Files " + files); // do whatever you want with uploaded file(s)
        var wb = XLSX.readFile(files.archivoExcel[0].path);
 

      
      sqlTruncate = "TRUNCATE TABLE ProjectVSLoss;TRUNCATE TABLE LossVSTool;TRUNCATE TABLE EmpleadoVSTool;";
      connectionTruncate = mysql.createConnection(config);
      connectionTruncate.query(sqlTruncate,(error,results,fields) => {
        if(error)
          console.log(error);
      });

      
      loss = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});

      sqlQueryLoss = "";
      paramsLoss = [];

      for(i = 0; i < loss.length; i++)
      {                
       
        var stringLoss = loss[i][0];
        paramsLoss.push(stringLoss);
        sqlQuery = "CALL NUEVA_LOSS(\'"+stringLoss+"\');"
        sqlQueryLoss = sqlQueryLoss +  sqlQuery;

        //console.log(i + " : " + stringLoss);      
        //console.log("Loss " + loss[i][0]);
      }

      connection = mysql.createConnection(config);  
      connection.query(sqlQueryLoss,(error,results,fields) =>
      {
        //console.log(stringLoss);
        if(error)
          {
            console.log(error);              
          }                          
      });

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
                //console.log(j + " " + tools[i][j]);

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
                //console.log(j + " " + tools[i][j]);
              
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
                //console.log(j + " " + tools[i][j]);
              
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
      connectionTools.query(superQueryTools,(error,results,fields)=>{
        if(error)
        {
          console.log(error);
        }
      });
      connectionTools.end();

    
      var projects = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]], {header:1});
      sqlQueryProjects = "";
      projectsParams = [];

      for(i = 1; i < projects.length; i++)
      {
                
        str1 = projects[i][0];
        str2 = projects[i][1];

        projectsParams.push(str1);
        projectsParams.push(str2);

        sqlQuery = "CALL NUEVO_PROJECT(?,?);";
        sqlQueryProjects = sqlQueryProjects + sqlQuery;        
        

        //console.log("Project " + projects[i][0] + " Saving " + projects[i][1]);
      }

      connectionProjects = mysql.createConnection(config);  
      connectionProjects.query(sqlQueryProjects,projectsParams,(error,results,fields)=>
      {
        if(error)
        {
          console.log(error);
        }
      });
      connectionProjects.end();



      var employees = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[3]], {header:1});
      var superQueryEmployees = '';
      for(i = 1; i < employees.length; i++)
      {        
        sqlQuery = "CALL NUEVO_EMPLEADO(\'" + employees[i][3] + "\',\'" + employees[i][0] + "\',\'" + employees[i][1] + "\',\'" + employees[i][2] + "\');";        
        superQueryEmployees = superQueryEmployees + sqlQuery;       
        //console.log("Número " + employees[i][0] + " Nombre " + employees[i][1]  + " Puesto " + employees[i][2] + " Eneatipo "  + employees[i][3]);
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
            //console.log("Loss vs tool :::  Loss: " + lossVStools[i][1] + " Tool: " + lossVStools[2][j] + " Activo " + lossVStools[i][j]);            
          }
        }        
      }
      //console.log("total " + counter);
      //console.log(parameters);
      //console.log(superQuery);
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
            //console.log(sqlQuery);
          }
        }
      }

      //console.log(superQueryProjectVSLoss);
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
             //console.log("Personel vs tool personel: " + personelVStools[i][0] + " Tool " + personelVStools[2][j] + " Activo " + personelVStools[i][j]);
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
      

      /*
      sqlQuery = 'CALL CREAR_VISTA();';
      connectionView = mysql.createConnection(config);

      connectionView.query(sqlQuery,(error,results,fields)=>{
          if(error)
          {
            res.send(error);
            console.log(error);
          }

          res.render('equipos');
      });  

      connectionView.end();
  */

            
      console.log("Termina if");


      //sqlQuery = "SELECT datawarehouse.PROYECTO,datawarehouse.ID_PROJECTO FROM datawarehouse GROUP BY datawarehouse.PROYECTO, datawarehouse.ID_PROJECTO";
      sqlQuery = "SELECT * FROM Project";
      connection = mysql.createConnection(config);
      connection.query(sqlQuery,(error,results,fields)=>
      {
        if(error)
        {
          res.send(error);
        }

        //console.log("AQui");
        //console.log(results);
        //res.send('@');
        res.send(results);
      });      
    }//Termina if
    else
    { 
       res.render('index.ejs');
    }

  });
});
module.exports = router;
