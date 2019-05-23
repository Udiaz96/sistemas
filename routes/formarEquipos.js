var express = require('express');
var router = express.Router();
var config = require('./config.js');
var mysql = require('mysql');
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
router.get('/',function(req,res,next){
    //Obtenemos todas las tools de cada uno de los empleados
    let empleados = [];
    let compatibles = []
    let habilidades = [];
    let team_members = [];
    let visit = {}; //Nuestro arreglo de visitados
    sqlQuery = "SElECT * FROM empleadovstool;";
    connection = mysql.createConnection(config);
    connection.query(sqlQuery,[],(error,results,fields)=>{
        if(!error){
            //Metemos las habilidades de cada empleado
            //Tambien inicializamos el areglo de visitados
            results.forEach(function(element) {
                if(!(element.idEmpleado in habilidades)){
                  habilidades[element.idEmpleado] = [];
                  //Es un nuevo empleado, lo marcamos como no visitado
                  visit[element.idEmpleado] = false;
                  empleados.push(element.idEmpleado);
                }
                //Insertamos una nueva habilidad del empleado
                habilidades[element.idEmpleado].push(element.idTool);
            });
            
            //Obtenemos la lista de empleados compatibles por cada eneatipo
            sqlQuery = "call OBTENER_COMPATIBILIDAD();";
            connection = mysql.createConnection(config);
            let ListaCompatibles;
            connection.query(sqlQuery,(error,results,fields)=>{
                if(!error){
                    ListaCompatibles = [{"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[],"8":[],"9":[]}];
                    eneatipo = 1;
                    for(i = 0; i < results[0].length; i++){               
                    //console.log(results[0][i].eneatipo + " " + results[0][i].eneatipoCompatible);
                        switch(results[0][i].eneatipo){
                            case 1:{ListaCompatibles[0][1].push(results[0][i].eneatipoCompatible);break;}
                            case 2:{ListaCompatibles[0][2].push(results[0][i].eneatipoCompatible);break;}
                            case 3:{ListaCompatibles[0][3].push(results[0][i].eneatipoCompatible);break;}
                            case 4:{ListaCompatibles[0][4].push(results[0][i].eneatipoCompatible);break;}
                            case 5:{ListaCompatibles[0][5].push(results[0][i].eneatipoCompatible);break;}
                            case 6:{ListaCompatibles[0][6].push(results[0][i].eneatipoCompatible);break;}
                            case 7:{ListaCompatibles[0][7].push(results[0][i].eneatipoCompatible);break;}
                            case 8:{ListaCompatibles[0][8].push(results[0][i].eneatipoCompatible);break;}
                            case 9:{ListaCompatibles[0][9].push(results[0][i].eneatipoCompatible);break;}
                        }      
                    }
                    let idTeamLeader = 88;//req.params.idLeader;
                    //Metemos el líder al equipo
                    team_members.push(idTeamLeader);
                    //Marcamos al líder como visitado
                    visit[idTeamLeader] = true;
                    //funcionDePrueba(1,team_members,1,visit,empleados,5);
                    formar_equipos(1,team_members,1,visit,empleados,5);
                }
            });
        }   
    });
    res.send("Ya acabé jejeje")
});
// function funcionDePrueba(team_length,team_members, nodo, visit,compatibles,N){ 
//     if(team_length>N)
//         return;
//     if(team_length ==N){
//         console.log("TEAM FOUND");
//         console.log(team_members);
//         return;
//     }
//     let sqlQuery = "SElECT * FROM empleado;";
//     connection = mysql.createConnection(config);
//     connection.query(sqlQuery,[],(error,results,fields)=>{
//         let ids =[];
//         results.forEach(function(element){
//             ids.push(element.idEmpleado)
//         });
//         console.log(ids);
//         team_members.push(idss[0]);
//         funcionDePrueba(team_length+1,team_members,1,visit,ids,5);
//     });
// }  
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
  function GetEmployees(){
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
      return ids;
    }
    });
  }
  module.exports = router;
  