let contacts = [];
let selectedContact = null;
const searchContact = $("#searchContact").val();
let userAccount = null;
let acction = null;


$(document).ready(function(){

    userAccount = validateAccount();

    contacts = userAccount.wallet.contacts;

    listContacts();

    $("#btnCerrarModal").click(()=>{
        cerrarModal();
    });

    $("#btnNuevoContacto").click(()=>{
        nuevoContacto();
    });

    $("#btnEnviarDinero").click(()=>{
        solicitarMonto();
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
        if(acction === 'nuevo_contacto'){
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
            $("#alertDangerModal").css("display", "block");
            $("#alertDangerModal").html("Debe completar todos los campos");
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
    let id = 0;
    let innerHTML = '';
    data.forEach(contact => {
        innerHTML += `<li id="contacto-${id}" class="list-group-item" style="cursor: pointer" onclick="liSeleccionarContactoClick(${id})">
          <div class="contact-info">
            <span class="contact-name">${contact.nombre} ${contact.apellido}</span>
            <span class="contact-details">CBU: ${contact.CBU}, Alias: ${contact.Alias}, Banco: ${contact.Banco}</span>
          </div>
        </li>`;
        id++;
    })
    $("#contactList").html(innerHTML);
}


const liSeleccionarContactoClick = (id) => {
    const items = document.querySelectorAll('ul li');
    selectedContact = null;
    items.forEach(li => {
        if(li.classList.contains('active')){
            li.classList.remove('active');
        }else{
            if(li.id === 'contacto-'+id){
                li.classList.add('active');
                selectedContact = contacts[id];
            }
        }
    })
}

const solicitarMonto = () => {
    if(!selectedContact){
        showMessage('Debe seleccionar un contacto', 'danger');
        return;
    }
    $("#inputMonto").val('');
    $("#alertInfo").html("");
    $("#ModalMontoEnvio").modal("show");
}

const enviarDinero = () => {
    let msgError = null;
    try{
        const monto = $("#inputMonto").val();
        if(!monto || monto <= 0){
            $("#alertInfo").html("Debe ingresar un monto válido");
            return;
        }
        msgError = 'Error al enviar dinero';
        let currentAmount = userAccount.wallet.amount;
        let newAmount = currentAmount - monto;
        userAccount.wallet.amount = newAmount;

        msgError = 'Error al actualizar el registro';
        updateLocalStorage();
        msgError = 'Error al actualizar el historial';
        updateHistory();
        showMessage(`Dinero enviado correctamente:<br/>Monto: $${monto}<br/>Enviado a: ${selectedContact.nombre} ${selectedContact.apellido}`, 'success');
        $("#ModalMontoEnvio").modal("hide");
    }catch(error){
        showMessage(msgError ??'Error al enviar dinero', 'danger');
    }

}

const updateLocalStorage = () => {
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const index = users.findIndex(user => user.rut === userAccount.rut);
    users[index] = userAccount;
    localStorage.setItem('users', JSON.stringify(users));
}

const updateHistory = (amount) => {
    let historyArray = userAccount.wallet.history ?? [];
    historyArray.push({rut: userAccount.rut, nombre: userAccount.nombre, amount, type: 'deposit', date: new Date().toLocaleString()});
    userAccount.wallet.history = historyArray;
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