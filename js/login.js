$(document).ready(function(){

     $('#loginForm').submit(
        function(event){
            event.preventDefault();
            if(login()){
                
                $(location).attr('href', "dashboard.html");
                return;
            }
            showMessage('Usuario o contraseña incorrectos', 'danger');
        }
     )
});

function login(){
    const email =  $("#email").val();
    const password = $('#password').val();
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    if(users.length === 0){
        return false;
    }
    const exists = users.filter(user => user.email === email && user.pwd === password)
    if(exists.length === 0){
        return false;
    }
    sessionStorage.setItem('userSession', JSON.stringify(exists[0].rut));
    return true;
}

