$(document).ready(function(){

     $('#loginForm').submit(
        async function(event){
            event.preventDefault();
            if(await login()){
                
                $(location).attr('href', "dashboard.html");
                return;
            }
            showMessage('Usuario o contraseña incorrectos', 'danger');
        }
     )
});

const login = async () => {
    const email =  $("#email").val();
    const password = await hashPassword($('#password').val());
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

