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
        $(location).attr('href', "index.html");
        return;
    }
    const userData = users.filter(user => user.rut === userSession);
    // El usuario no existe
    if(userData.length === 0){
        $(location).attr('href', "index.html");
        return;
    }

    // El objeto no tiene todos sus campos o está corrupto
    if(userData[0].wallet.amount === undefined || userData[0].wallet.amount === undefined || userData[0].wallet.amount === undefined){
        $(location).attr('href', "index.html");
        return;
    }

    return userData[0];
  }catch(error){
    $(location).attr('href', "index.html");
    return;
  }
}


const hashPassword = async (texto) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
  } catch (error) {
    console.error("Error en hashPassword:", error);
    console.error("Este error puede ocurrir si la página no se está ejecutando en un contexto seguro (HTTPS o localhost), que es un requisito para la API de criptografía web.");
    throw error;
  }
}