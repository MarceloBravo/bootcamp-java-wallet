$(document).ready(function(){

    $("#registerForm").on('submit', function(event){
        event.preventDefault();
        validaDatos();

    })
})

const validaDatos = () => {
    const rut = $("#rut").val();
    const nombre = $("#nombre").val();
    const email = $("#email").val();
    const pwd = $("#password").val();
    const confirmPwd = $("#confirmPassword").val();

    return true;
}