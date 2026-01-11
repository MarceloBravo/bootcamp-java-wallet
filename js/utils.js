function validarRut(rutCompleto) {
  rutCompleto = rutCompleto.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  const cuerpo = rutCompleto.slice(0, -1);
  const dv = rutCompleto.slice(-1);

  if (cuerpo.length < 7) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i));
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvFinal === dv;
}


function validarEmail(email) {
  // Expresión regular para validar formato de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


const validateAccount = () => {
  try{
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const userSession = sessionStorage.getItem('userSession') ? JSON.parse(sessionStorage.getItem('userSession')) : {};
    // No hay usuarios registrados
    if(users.length === 0 || !userSession){
        $(location).attr('href', "login.html");
        return;
    }
    const userData = users.filter(user => user.rut === userSession);
    // El usuario no existe
    if(userData.length === 0){
        $(location).attr('href', "login.html");
        return;
    }

    // El objeto no tiene todos sus campos o está corrupto
    if(userData[0].wallet.amount === undefined || userData[0].wallet.amount === undefined || userData[0].wallet.amount === undefined){
        $(location).attr('href', "login.html");
        return;
    }

    return userData[0];
  }catch(error){
    $(location).attr('href', "login.html");
    return;
  }
}