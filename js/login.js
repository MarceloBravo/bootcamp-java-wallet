$(document).ready(function(){

     $('#loginForm').submit(
        function(event){
            event.preventDefault();
            if(validateData()){
                $('#modalBody').html('Te haz autenticado correctamente')
                $('#msgModal').css('display', 'block');
                return;
            }
            $('#alertDanger').css('display', 'block');
        }
     )

    $("#username").keyup(function(){
        $('#alertDanger').css('display', 'none');
    });


    $("#password").keyup(function(){  
        $('#alertDanger').css('display', 'none');
    });

    $("#btnCloseModal").click(function(){
        $('#modalBody').html('');
        $('#msgModal').css('display', 'none');
        localStorage.setItem('user', $("#username").val());
        $(location).attr('href', "menu.html");
    });
    
});

function validateData(){
    const username =  $("#username").val();
    const password = $('#password').val();
    return username.trim().length >= 1 && password.trim().length >= 5;
}

