let contacts = [];
let selectedContact = null;
const searchContact = $("#searchContact").val();
let userAccount = null;
let action = null;


$(document).ready(function(){

    userAccount = validateAccount();

    contacts = userAccount.wallet.contacts;

    $("#h-monto").html('$' + userAccount.wallet.amount);

    listContacts();

    $("#btnCerrarModal").click(()=>{
        cerrarModal();
    });

    $("#btnNuevoContacto").click(()=>{
        nuevoContacto();
    });

    $("#btnEnviarDinero").click(()=>{
        openContactListClick();
    });

    $("#btnRealizarEnvio").click(()=>{
        enviarDinero();
    });

    $("#btnCancelarEnvio").click(()=>{
        $("#ModalMontoEnvio").modal("hide");
    });

    $("#btnBackToMenu").click(()=>{
        $(location).attr('href', "dashboard.html");
    });

    $("#btnPrimaryModal").click(() => {
        if(action === 'nuevo_contacto'){
            $("#myModal").modal("hide");
            acction = null;
            return;
        }
        $(location).attr('href', "dashboard.html");
    });

    $("#btnSecondaryModal").click(() => {
        $("#myModal").modal("hide");
    })

    $("#inputMonto").change(() => {
        $("#alertInfo").html("");
    })

    $("#btnSearchContact").click(() => {
        openContactListClick();
     })

     $("#btnBack").click(() => {
        $("#div-contactos").css('display', 'none');
        $("#div-transaccion").css('display', 'block');
        if(selectedContact){
            liSeleccionarContactoClick(selectedContact.cbu)
        }
        selectedContact = null;
     })

     $("#btnExecuteTransaction").click(()=> {
        enviarDinero();
     })
    
});


/**
 * Resetea los campos y cierra el formulario modal de creación de contacto
 */
const cerrarModal = () => {
    $("#inputNombre").val('');
    $("#inputApellido").val('');
    $("#inputCBU").val(0);
    $("#inputAlias").val('');
    $("#inputBanco").val('');
    $("#alertDangerModal").css("display", "none");
}

const nuevoContacto = () => {
    action = 'nuevo_contacto';
    try{
        const firstName = $("#inputNombre").val();
        const lastName = $("#inputApellido").val();
        const cbu = $("#inputCBU").val();
        const alias = $("#inputAlias").val();
        const bank = $("#inputBanco").val();
        if(!firstName || !lastName || !cbu || !alias || !bank){
            showMessage("Debe completar todos los campos", "danger");
            return;
        }
        if(contacts.find(contact => contact.CBU === cbu)){
            showMessage("Ya existe un contacto con ese CBU", "danger");
            return;
        }
        contacts.push({nombre: firstName, apellido: lastName, CBU: cbu, Alias: alias, Banco: bank});
        saveContacts();

        listContacts();
        $('#btnCerrarModal').click();
        showMessage('Contacto creado correctamente', 'success');
    }catch(error){
        showMessage('Error al crear el contacto', 'danger');
    }
};


const saveContacts = () => {
    userAccount.wallet.contacts = contacts;
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const index = users.findIndex(user => user.rut === userAccount.rut);
    users[index] = userAccount;
    localStorage.setItem('users', JSON.stringify(users));
}

const listContacts = (filtered = null) => {
    const data = filtered || contacts;
    let innerHTML = '';
    data.forEach(contact => {
        innerHTML += `<li id="contacto-${contact.CBU}" class="list-group-item" style="cursor: pointer" onclick="liSeleccionarContactoClick(${contact.CBU})">
          <div class="contact-info">
          <span class="contact-details">CBU: ${contact.CBU}</span>
          <span class="contact-name">${contact.nombre} ${contact.apellido}</span>
          <span class="contact-details">, Alias: ${contact.Alias}, Banco: ${contact.Banco}</span>
          </div>
        </li>`;
    })
    $("#contactList").html(innerHTML);
}


const liSeleccionarContactoClick = (cbu) => {
    const items = document.querySelectorAll('ul li');
    selectedContact = null;
    items.forEach((li, index) => {
        if(li.classList.contains('active')){
            li.classList.remove('active');
        }else{
            if(li.id === 'contacto-'+cbu){
                li.classList.add('active');
                selectedContact = contacts.find(contact => contact.CBU === `${cbu}`);
            }
        }
    })
}

const enviarDinero = () => {
    let msgError = null;
    try{
        const monto = parseInt($("#inputMonto").val());
        if(!selectedContact){
            msgError = 'Debe seleccionar un contacto';
            throw new Error(msgError);
        }
        msgError = 'Error al enviar dinero';
        let currentAmount = userAccount.wallet.amount;
        let newAmount = currentAmount - monto;
        userAccount.wallet.amount = newAmount;

        updateHistory(monto);

        updateLocalStorage();
        
        $("#h-monto").html('$' + newAmount);
        showMessage(`Dinero enviado correctamente:<br/>Monto: $${monto}<br/>Enviado a: ${selectedContact.nombre} ${selectedContact.apellido}`, 'success');
        $("#ModalMontoEnvio").modal("hide");
    }catch(error){
        showMessage(msgError ??'Error al enviar dinero', 'danger');
    }

}

const updateLocalStorage = () => {
    try{
        let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
        const index = users.findIndex(user => user.rut === userAccount.rut);
        users[index] = userAccount;
        localStorage.setItem('users', JSON.stringify(users));
    }catch(error){
        showMessage('Error al actualizar el reistro', 'danger');
    }
}

const updateHistory = (monto) => {
    try{
        let historyArray = userAccount.wallet.history ?? [];
        historyArray.push({nombre: selectedContact.nombre, amount: monto, type: 'send', date: new Date().toLocaleString()});
        userAccount.wallet.history = historyArray;
    }catch(error){
        showMessage('Error al actualizar el historial', 'danger');
    }
}

const inputSearchContactChange = (event) => {
    const value = event.target.value;
    const filtered = contacts.filter(contact => {
        if(
            contact.nombre.toLowerCase().includes(value.toLowerCase()) || 
            contact.apellido.toLowerCase().includes(value.toLowerCase()) || 
            contact.CBU.toString().includes(value) || 
            contact.Alias.toLowerCase().includes(value.toLowerCase()) || 
            contact.Banco.toLowerCase().includes(value.toLowerCase())
        ){
            return contact;
        }
    })
    listContacts(filtered);
}

const openContactListClick = () => {
    const monto = parseInt($("#inputMonto").val());
    if(!monto || monto <= 0){
        showMessage("Debe ingresar un monto válido","danger");
        return;
    }
    if(monto > userAccount.wallet.amount){
        showMessage("No tienes saldo suficiente para realizar ésta operación","danger");
        return;
    }
    $("#div-transaccion").css('display', 'none');
    $("#div-contactos").css('display', 'block');
}