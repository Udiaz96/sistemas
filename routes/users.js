var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');
var XLSX = require('xlsx');
var multiparty = require('multiparty');
var habilidades = {};
const Combinatorics = require('js-combinatorics');
const Heap = require('heap');
const MinHeap = new Heap(function cmp(a, b) {
  if (a.h < b.h) {
    return -1;
  } 
  if (b.h < a.h) {
    return 1;
  }
  return 0;
});
var globalTeamList = [];
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
  sqlQuery = "SELECT Eneagrama.nombre, Empleado.idEmpleado FROM Eneagrama INNER JOIN Empleado WHERE Empleado.idEneagrama = Eneagrama.idEneagrama ";
  connection = mysql.createConnection(config);
  
  connection.query(sqlQuery,(error,results,fields)=>{

  if(error)
  {
    console.log(error);
  }  
    
    
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
    for(i = 0; i < results.length; i++)
    {      
      console.log(results[i].nombre + " " + results[i].idEmpleado);      
      switch(results[i].nombre){
          case "1":
          {
            empleados[0][1].push(results[i].idEmpleado);
            break;
          }
          case "2":
          {
            empleados[0][2].push(results[i].idEmpleado);
            break;
          }
          case "3":
          {
            empleados[0][3].push(results[i].idEmpleado);
            break;
          }
          case "4":
          {
            empleados[0][4].push(results[i].idEmpleado);
            break;
          }
          case "5":
          {
            empleados[0][5].push(results[i].idEmpleado);
            break;
          }
          case "6":
          {
            empleados[0][6].push(results[i].idEmpleado);
            break;
          }
          case "7":
          {
            empleados[0][7].push(results[i].idEmpleado);
            break;
          }
          case "8":
          {
            empleados[0][8].push(results[i].idEmpleado);
            break;
          }
          case "9":
          {
            empleados[0][9].push(results[i].idEmpleado);
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

//    console.log('vacio');
  //  res.render('error.ejs');
});
router.get('/formarEquipos',function(req,res,next){
  let visit = {};
  sqlQuery = "SElECT * FROM empleadovstool;";
  connection = mysql.createConnection(config);
  connection.query(sqlQuery,[],(error,results,fields)=>{
    results.forEach(function(element) {
      if(!(element.idEmpleado in habilidades)){
        habilidades[element.idEmpleado] = [];
        //Aprovecho para inicializar mi arreglo de visitados en false
        visit[element.idEmpleado] = false;
      }
      habilidades[element.idEmpleado].push(element.idTool);
    });
    // res.send(habilidades);
    //console.log(habilidades);
    //res.json(habilidades);
    //Aqui va todo lo de formar equipos
    let compatiblesQuery = 'CALL FORMAR_EQUIPO'; //Llamada para los compatibles
    let compatibles = [];
    connection.query(compatiblesQuery,[],(error,results,fields)=>{
        compatibles = results;
    });
    let team_members = [];
    team_members.push(1); //Push the leader
    globalTeamList = []; //limpieamos el arreglo
    
    formar_equipos(1,team_members,1,visit,allEmployees,5);
  });
});

function formar_equipos(team_length,team_members, nodo, visit,compatibles,N){ 
  //If we are in a sheet node means we have a team formed
  //So we return that team
  if(team_length>N)
      return; 
  //console.log("nodo:",nodo)
  if(team_length == N){
      //console.log(team_members);
      //console.log(JSON.stringify(team_members));
      
      let rnd = Math.random() * (100 - 0) + 0; //CalcularHeuristica();
      let tm = Object.assign({},team_members);
      //TeamList.push(tm);
      let tmS = JSON.stringify(tm);
      let nodo ={
          "key":tmS,
          "h":CalcularHeuristica(team_members)
      }
      if(MinHeap.size()>10)
          MinHeap.pushpop(nodo);
      else
          MinHeap.push(nodo);
      //console.log("after push: ",team_members);
      return;
      //return team_members;
  }
  //Otherwise we still trying to form teams
  let k  = (N - team_length) >= 2 ? 2:1; //How many childs cant his node have 
                            //We are greedy an try to have allways 2 childs until is not possible
  //let Combinatorics = require('js-combinatorics');
  //console.log(compatibles);
  ///console.log("type compatibles:",typeof compatibles);
  let opciones = Combinatorics.bigCombination(compatibles, k); //We get []Ck combinatorics
  if(k == 1){
      while(a = opciones.next()){ 
          let a_aux = a;
          if(!visit[a_aux[0]]){
              if(!(nodo in team_members))
                  team_members[nodo] = [];
              team_members[nodo].push(a_aux[0]);
              visit[a_aux[0]]  = true;
              team_length = team_length +1;
              let nodo_aux = a_aux[0];
              formar_equipos(team_length,team_members, nodo_aux, visit,compatibles,N);
              delete team_members[nodo];
              visit[a_aux[0]] = false;
              team_length = team_length -1;
          }
      }
  }else if (k==2){
      while(a = opciones.next()){ 
          let a_aux = a;
          if(!visit[a_aux[0]] && !visit[a_aux[1]]){
              if(!(nodo in team_members))
                  team_members[nodo] = [];
              team_members[nodo].push(a_aux[0]);
              team_members[nodo].push(a_aux[1]);
              visit[a_aux[0]] = visit[a_aux[1]] = true;
              let nodo_aux = a_aux[0];
              team_length = team_length +2;
              //console.log("Log before 1st rescursive call",a_aux);
              formar_equipos(team_length,team_members, nodo_aux, visit,compatibles,N);
              nodo_aux = a_aux[1];
              //console.log("Log before 2nd rescursive call",a_aux);
              formar_equipos(team_length,team_members,nodo_aux, visit,compatibles,N);
              delete team_members[nodo];
              //console.log("Despuerte de vaciar",team_members);
              team_length = team_length -2;
              //console.log("Debería estar en nodo 3 ",nodo);
              //console.log("Log after 2nd rescursive call",a_aux);
              visit[a_aux[0]] = visit[a_aux[1]] = false;
              

          }
      }
  }
}
function CalcularHeuristica(team_members){
  let H = 0; //Heurística Total
  let C = 0; //Heurística de Compatibilidad
  let T = 0; //Heurística de Majo de Tools 
  
}
module.exports = router;

