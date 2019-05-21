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

  $("#inputGroupSelect01").change(function() {
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

        if($("#inputSelectLeader").is(":empty")){
        if (response.length > 0) {
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

  $("#inputSelectLeader").change(function() {
    empleado = $("#inputSelectLeader").val();
    proyecto = $("#inputGroupSelect01").val();
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

          console.log("Apoyo: " + empleado  + " " + proyecto );

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
