var express = require('express');
var router = express.Router();
var config = require('./config.js');
var mysql = require('mysql');
const Combinatorics = require('js-combinatorics');
const Heap = require('heap');
let ListaCompatibles;
const TablaEmpleadoIsEneatipo = {};
const TablaIdEmpleadoToName = {};
const MinHeap = new Heap(function cmp(a, b) {
    if (a.h < b.h)
        return -1;
    if (b.h < a.h) 
        return 1;
    return 0;
});
var habilidades = {};
const habilidades_proyecto = [];
router.post('/', function(req, res, next) {

    console.log("ID LIDER: " + req.body.idLeader);
    console.log("LENGHT TEAM: " + req.body.LengthTeam);
    console.log("ID PROYECTO: " + req.body.idProyecto);

    //Obtenemos todas las tools de cada uno de los empleados
    //let empleados = [];
    let team_members = {};
    let visit = {}; //Nuestro arreglo de visitados
    sqlQuery = "SElECT empleadovstool.idEmpleadoVSToolcol,empleadovstool.idEmpleado,empleadovstool.idTool,Tool.idLevelTool FROM empleadovstool INNER JOIN Tool ON EmpleadoVSTooL.idTool = Tool.idTool;";
    connection = mysql.createConnection(config);
    connection.query(sqlQuery, [], (error, results, fields) => {
        if (!error) {


            //Metemos las habilidades de cada empleado
            //Tambien inicializamos el areglo de visitados
            results.forEach(function(element) {
                if (!(element.idEmpleado in habilidades)) {
                    habilidades[element.idEmpleado] = {};
                    //Es un nuevo empleado, lo marcamos como no visitado
                    visit[element.idEmpleado] = false;
                    //empleados.push(element.idEmpleado);
                }
                //Insertamos una nueva habilidad del empleado con el nivel respectivo
                habilidades[element.idEmpleado][element.idTool] = element.idLevelTool;
            });
            //console.log(habilidades[88]);
            //Obtenemos la lista de empleados compatibles por cada eneatipo
            sqlQuery = "call OBTENER_COMPATIBILIDAD();";
            connection = mysql.createConnection(config);
            connection.query(sqlQuery, (error, results, fields) => {
                if (!error) {
                    ListaCompatibles = [{ "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": [] }];
                    for (i = 0; i < results[0].length; i++) {
                        //console.log(results[0][i].eneatipo + " " + results[0][i].eneatipoCompatible);
                        switch (results[0][i].eneatipo) {
                            case 1:
                                { if(!ListaCompatibles[0][1].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][1].push(results[0][i].eneatipoCompatible); break; }
                            case 2:
                                { if(!ListaCompatibles[0][2].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][2].push(results[0][i].eneatipoCompatible); break; }
                            case 3:
                                { if(!ListaCompatibles[0][3].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][3].push(results[0][i].eneatipoCompatible); break; }
                            case 4:
                                { if(!ListaCompatibles[0][4].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][4].push(results[0][i].eneatipoCompatible); break; }
                            case 5:
                                { if(!ListaCompatibles[0][5].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][5].push(results[0][i].eneatipoCompatible); break; }
                            case 6:
                                { if(!ListaCompatibles[0][6].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][6].push(results[0][i].eneatipoCompatible); break; }
                            case 7:
                                { if(!ListaCompatibles[0][7].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][7].push(results[0][i].eneatipoCompatible); break; }
                            case 8:
                                { if(!ListaCompatibles[0][8].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][8].push(results[0][i].eneatipoCompatible); break; }
                            case 9:
                                { if(!ListaCompatibles[0][9].includes(results[0][i].eneatipoCompatible)) ListaCompatibles[0][9].push(results[0][i].eneatipoCompatible); break; }
                        }
                    }
                    //console.log(ListaCompatibles);
                    let idTeamLeader = req.body.idLeader; //req.params.idLeader;
                    sqlQuery = "SELECT * FROM empleado;";
                    connection = mysql.createConnection(config);
                    connection.query(sqlQuery, (error, results, fields) => {
                        if (!error) {
                            results.forEach(function(element) {
                                TablaEmpleadoIsEneatipo[element.idEmpleado] = element.idEneagrama;
                                TablaIdEmpleadoToName[element.idEmpleado] = element.nombre;
                            });
                            //console.log(TablaEmpleadoIsEneatipo);
                            let eneatipo = TablaEmpleadoIsEneatipo[idTeamLeader];
                            //Metemos el líder al equipo
                            team_members[idTeamLeader] = [];
                            //Declaramos el arreglo de trabajadores compatibles con el líder
                            let compatibles = ListaCompatibles[0][eneatipo];
                            //console.log(compatibles);
                            //Marcamos al líder como visitado
                            visit[idTeamLeader] = true;
                            let N = req.body.LengthTeam; //req.params.LengthTeam;

                            let idProyecto = req.body.idProyecto; //req.params.idProyecto
                            sqlQuery = "SELECT DATAWAREHOUSE.ID_TOOL FROM DATAWAREHOUSE WHERE DATAWAREHOUSE.ID_PROJECTO = ?;"; //Aquí va la consulta para obtener las tools que necesita un proyecto
                            connection = mysql.createConnection(config);
                            connection.query(sqlQuery, [idProyecto], (error, results, fields) => {
                                results.forEach(function(it) {
                                    habilidades_proyecto.push(it.ID_TOOL);
                                });
                                formar_equipos(1, team_members, idTeamLeader, visit, compatibles, N);
                                let Equipos = MinHeap.toArray();
                                let EquiposByName = [];

                                Equipos.forEach(function(equipo) {
                                    let memebers = JSON.parse(equipo.key);
                                    let nodo = {};
                                    nodo['h'] = equipo.h;
                                    Object.keys(memebers).forEach(function(lid) {
                                        nodo[TablaIdEmpleadoToName[lid]] = [];
                                        memebers[lid].forEach(function(sub) {
                                            nodo[TablaIdEmpleadoToName[lid]].push(TablaIdEmpleadoToName[sub]);
                                        })
                                    });
                                    EquiposByName.push(nodo);
                                });
                                console.log('-----EQUIPOS----')
                                console.log(Equipos);
                                console.log("-------------");
                                console.log(EquiposByName);
                                //res.render('index', { equipos: EquiposByName });
                                res.json(EquiposByName);
                            });
                        }
                    });
                }
            });
        }
    });
});

function formar_equipos(team_length, team_members, nodo, visit, compatibles, N) {
    //If we are in a sheet node means we have a team formed
    //So we return that team
    if (compatibles == null)
        return;
    if (team_length > N)
        return;
    //console.log("nodo:",nodo)
    if (team_length == N) {
        //console.log(team_members);
        //console.log(JSON.stringify(team_members));
        let tm = Object.assign({}, team_members);
        //TeamList.push(tm);
        let tmS = JSON.stringify(tm);
        let nodo = {
            "key": tmS,
            "h": CalcularHeuristica(tm)
        }
        if (MinHeap.size() > 4)
            MinHeap.pushpop(nodo);
        else
            MinHeap.push(nodo);
        //console.log("after push: ",team_members);
        return;
        //return team_members;
    }
    //Otherwise we still trying to form teams
    let k = (N - team_length) >= 2 ? 2 : 1; //How many childs cant his node have 
    //We are greedy an try to have allways 2 childs until is not possible anymore
    
    let opciones = Combinatorics.bigCombination(compatibles, k); //We get []Ck combinatorics
    compatibles = ListaCompatibles[0][TablaEmpleadoIsEneatipo[nodo]];
    //console.log(compatibles);
    if (k == 1) {
        while (a = opciones.next()) {
            let a_aux = a;
            if (!visit[a_aux[0]]) {
                if (!(nodo in team_members))
                    team_members[nodo] = [];
                team_members[nodo].push(a_aux[0]);
                visit[a_aux[0]] = true;
                team_length = team_length + 1;
                let nodo_aux = a_aux[0];
                formar_equipos(team_length, team_members, nodo_aux, visit, compatibles, N);
                delete team_members[nodo];
                visit[a_aux[0]] = false;
                team_length = team_length - 1;
            }
        }
    } else if (k == 2) {
        while (a = opciones.next()) {
            let a_aux = a;
            if (!visit[a_aux[0]] && !visit[a_aux[1]]) {
                if (!(nodo in team_members)) //Initialize the node to put their childrens
                    team_members[nodo] = [];
                team_members[nodo].push(a_aux[0]);
                team_members[nodo].push(a_aux[1]);
                visit[a_aux[0]] = visit[a_aux[1]] = true;
                let nodo_aux = a_aux[0];
                team_length = team_length + 2;
                //console.log("Log before 1st rescursive call",a_aux);
                formar_equipos(team_length, team_members, nodo_aux, visit, compatibles, N);
                nodo_aux = a_aux[1];
                //console.log("Log before 2nd rescursive call",a_aux);
                formar_equipos(team_length, team_members, nodo_aux, visit, compatibles, N);
                delete team_members[nodo];
                //console.log("Despuerte de vaciar",team_members);
                team_length = team_length - 2;
                //console.log("Debería estar en nodo 3 ",nodo);
                //console.log("Log after 2nd rescursive call",a_aux);
                visit[a_aux[0]] = visit[a_aux[1]] = false;
            }
        }
    }
}

function CalcularHeuristica(team_members) {
    let H = 0; //Heurística Total
    //console.log("Habilidades on CH: ",habilidades_proyecto);
    let keys = Object.keys(team_members);
    let employees = {};
    keys.forEach(function(idEmpleado) {
        if (!(idEmpleado in employees))
            employees[idEmpleado] = 1;
        team_members[idEmpleado].forEach(function(sub) {
            if (!(sub.toString() in employees))
                employees[sub.toString()] = 1;
        })
    });
    let team_habilidades_level = {};
    let manejo_tool;
    habilidades_proyecto.forEach(function(tool) {
        manejo_tool = 0;
        Object.keys(employees).forEach(function(employee) {
            //console.log(employee);
            //console.log(habilidades[employee]);
            if(habilidades[employee]!=undefined)
                if (tool in habilidades[employee]) {
                    manejo_tool += habilidades[employee][tool];
                    //console.log(habilidades[employee][tool]);
                }
        });
        team_habilidades_level[tool] = manejo_tool / Object.keys(employees).length;
        H += team_habilidades_level[tool];
    });
    H /= habilidades_proyecto.length;
    return H;
}
module.exports = router;