$(document).ready(function(){
    console.log("Ready equipos");

    $('#inputGroupSelect01').change(function(){
        var proyecto = $('#inputGroupSelect01').val();
         console.log("ID:" + proyecto);
        $.ajax({
             url:"/users/proyectos",
             method: "post",
             data:{
                proyecto: proyecto
             },
             complete: function(){
                 console.log("Done");
             },
             success: function(response)        
             {              
                console.log(response);
               /* var select = $('#inputGroupSelectMunicipios');
 
                for(i = 0; i < response.length; i++)
                {
                 var option = document.createElement('option');
                 option.value = response[i].idMunicipio;
                 option.innerHTML = response[i].nombre;                
                 select.append(option);*/
                
             }
             
        });
     });
});