$(document).ready(function(){
    $("#registerForm").on('submit', function(event){
        event.preventDefault();
        if(validateData()){
            createUser();
            showMessage('Te has registrado correctamente', 'success');
            return;
        }
        showMessage('Error al registrarte', 'danger');
    })

    $("#rut").change(function(){ $("#msgRut").html(''); })

    $("#nombre").change(function(){ $("#msgNombre").html(''); })

    $("#email").change(function(){ $("#msgEmail").html(''); })

    $("#password").change(function(){ $("#msgPassword").html(''); })

    $("#confirmPassword").change(function(){ $("#msgConfirmPassword").html(''); })
})

const validateData = () => {
    let resp = true;
    const rut = $("#rut").val();
    const nombre = $("#nombre").val();
    const email = $("#email").val();
    const pwd = $("#password").val();
    const confirmPwd = $("#confirmPassword").val();
    resetErrorsMessage();
    if(!validarRut(rut) || isRutExists()){
         $("#msgRut").html('Rut no válido o ya está registrado');
        resp = false;
    }
    if(nombre.trim().length < 3){
        $("#msgNombre").html('Nombre invalido, el nombre debe tener almenos 3 carácteres');
        resp = false;
    }
    if(!validarEmail(email) || isEmailExists()){
        $("#msgEmail").html('Email no válido o ya está registrado');
        resp = false;
    }
    if(pwd.trim().length < 8){
        $("#msgPassword").html('Contraseña invalida, la contraseña debe tener almenos 8 carácteres');
        resp = false;
    }
    if(pwd !== confirmPwd){
        $("#msgConfirmPassword").html('Las contraseñas no coinciden');
        resp = false;
    }  

    return resp;
}

const resetErrorsMessage = () => {
    $("#msgRut").html('');
    $("#msgNombre").html('');
    $("#msgEmail").html('');
    $("#msgPassword").html('');
    $("#msgConfirmPassword").html('');
}

const createUser = () => {
    const rut = $("#rut").val();
    const nombre = $("#nombre").val();
    const email = $("#email").val();
    const pwd = $("#password").val();
    const confirmPwd = $("#confirmPassword").val();

    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    users.push({rut, nombre, email, pwd, confirmPwd, wallet: {amount: 0, history: [], contacts: []}});
    localStorage.setItem('users', JSON.stringify(users));
}

const isEmailExists = () => {
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    return users.filter(user => user.email === $("#email").val()).length > 0;
}

const isRutExists = () => {
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    return users.filter(user => user.rut === $("#rut").val()).length > 0;
}