$(document).ready(function() {
    console.log("Ready");

    $("#buttonSend").click(function() {
        console.log("Click");
        var form = $("form")[0];
        var fd = new FormData(form);
        fd.append("Done", "file");
        console.log(fd.has("archivoExcel"));

        $.ajax({
            url: "users/data",
            method: "POST",
            enctype: "multipart/form-data",
            contentType: false,
            processData: false,
            data: fd,
            complete: function() {
                console.log("Completo");
            },
            success: function(response) {
                var select = $("#inputGroupSelect01");
                for (i = 0; i < response.length; i++) {
                    var option = document.createElement("option");
                    option.value = response[i].idProject;
                    option.innerHTML = response[i].nombre;
                    select.append(option);
                }
                //console.log(response);
            }
        });
    });

    var leaders = [];
    $("#inputGroupSelect01").change(function() {
        leaders = [];
        proyecto = $("#inputGroupSelect01").val();
        $("#inputSelectLeader").empty();
        $("#tbody-subleaders").empty();
        $("#tbody-Equipo").empty();

        console.log(proyecto);
        $.ajax({
            url: "users/proyectos",
            method: "POST",
            data: {
                key: proyecto
            },
            complete: function() {
                console.log("Completo");
            },
            success: function(response) {
                var select = $("#inputSelectLeader");

                if ($("#inputSelectLeader").is(":empty")) {
                    if (response.length > 0) {
                        leaders = response;
                        $("#projectTitle").text("Proyecto: " + response[0].PROYECTO);
                        $("#eneatipoLider").text("Eneatipo: " + response[0].ENEATIPO);
                    }

                    for (i = 0; i < response.length; i++) {
                        var option = document.createElement("option");
                        option.value = response[i].ID_EMPLEADO;
                        option.innerHTML = response[i].EMPLEADO;
                        select.append(option);
                    }

                    console.log(response);
                }
            }
        });
    });

    ////////////////FORMA EQUIPOS

    $('#buttonIniciarEquipos').click(function() {

        empleado = $("#inputSelectLeader").val();
        tamano = $("#idTamano").val();
        idProyecto = $('#inputGroupSelect01').val();

        console.log('IdLider' + empleado);
        console.log('Tamaño: ' + tamano);
        console.log('Id proyecto:' + idProyecto)

        $.ajax({
            url: "/formarEquipos",
            method: "POST",
            data: {
                idLeader: empleado,
                LengthTeam: tamano,
                idProyecto: idProyecto
            },
            dataType: 'JSON',
            success: function(response) {

                var output = [];
                var contador = 0;


                //ELIMINAMOS LAS h del response
                for (let i = 0; i < response.length; i++) {

                    delete response[i].h;

                }

                console.log(response);


                //Primero Recorremos la response para sacar las keys y las values 
                Object.entries(response).forEach(([key, value]) => {

                    //Como en este punto las keys son las posiciones del arreglo y los values son un arreglo de json
                    //volveremos a recorrerlo para tener un json final mas comodo de manipular
                    Object.entries(value).forEach(([key, value]) => {

                        console.log(key);
                        console.log(value);

                        //Agregamos las keys y los values en un arreglo final
                        output.splice(contador, 0, {
                            key: key,
                            value: value
                        });

                        contador++;


                    });

                    console.log('------------------');



                });

                console.log('--OUTPUTFINAL--');
                console.log(output);



                //////CREACION DE TABLAS
                /*for (let i = 0; i < output.length / 2; i++) {

                    $('#contenedor-global').append(`

                    <div class="row justify-content-center text-center">
                      <div class="col-12">
                          <h1 class="display-4">Equipo ${i}</h1>
                      </div>
                  </div>

                      <div class="row justify-content-center mt-3 mb-3">
                      <div class="col-12 card card-body">
                          <table class="table table-striped" id="tablaEquipo-${i}">
                              <thead>
                                  
                              </thead>
                              <tbody>
          
                              </tbody>
                          </table>
                      </div>
                  </div>
                  `);

                }*/

            }
        });
    });

    $("#inputSelectLeader").change(function() {
        empleado = $("#inputSelectLeader").val();
        proyecto = $("#inputGroupSelect01").val();
        tamano = $("#idTamano").val();
        $("#tbody-Equipo").empty();


        console.log(empleado + " " + proyecto);

        $("#tbody-subleaders").empty();




        $.ajax({
            url: "users/vengadores",
            method: "POST",
            data: {
                empleado: empleado,
                proyecto: proyecto
            },
            complete: function() {
                console.log("Completo");
            },
            success: function(response) {




                var table = $("#tbody-subleaders");

                if ($("#tbody-subleaders").is(":empty")) {
                    for (i = 0; i < response[0].length; i++) {

                        $("#eneatipoLider").text("Eneatipo: " + response[0][i].ID_ENEATIPO_LIDER);

                        var row = document.createElement("tr");

                        var td1 = document.createElement("td");
                        var td2 = document.createElement("td");

                        td1.innerHTML = response[0][i].EMPLEADO;
                        td2.innerHTML = response[0][i].ENEATIPO;

                        row.append(td1);
                        row.append(td2);

                        //option.value = response[i].ID_EMPLEADO;
                        //option.innerHTML = response[i].EMPLEADO;
                        table.append(row);
                        console.log(
                            response[0][i].EMPLEADO + " " + response[0][i].ENEATIPO
                        );
                    }

                    console.log(response);
                    empleado = $("#inputSelectLeader").val();
                    proyecto = $("#inputGroupSelect01").val();

                    console.log("Apoyo: " + empleado + " " + proyecto);

                    $.ajax({
                        url: "users/apoyo",
                        method: "POST",
                        data: {
                            empleado: empleado,
                            proyecto: proyecto
                        },
                        complete: function() {
                            console.log("Completo");
                        },
                        success: function(response) {
                            console.log(response);
                            console.log(response[0]);
                            var table = $("#tbody-Equipo");

                            for (i = 0; i < response[0].length; i++) {
                                var row = document.createElement("tr");

                                var td1 = document.createElement("td");
                                var td2 = document.createElement("td");

                                td1.innerHTML = response[0][i].EMPLEADO;
                                td2.innerHTML = response[0][i].ENEATIPO;

                                row.append(td1);
                                row.append(td2);


                                table.append(row);

                                console.log("Resto de equipo " + response[0][1].EMPLEADO + " " + response[0][1].ENEATIPO);
                            }


                        }
                    });
                }
            }

        });
    });
});