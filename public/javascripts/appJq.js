$(document).ready(function(){
    console.log("Ready");

    $('#buttonSend').click(function(){
      
        var form = $("form")[0];
        var fd = new FormData(form);
        fd.append("Done","file");
        console.log(fd.has("archivoExcel"));

        $.ajax({
            url: "users/data",
            method: "POST",
            enctype: "multipart/form-data",
            contentType: false,
            processData: false,
            data: fd,            
            complete: function(){
                console.log("Completo");
            },
            success: function(response)
            {
                console.log(response);
            }            
        });
   
    });
    
  });