let contacts = [];
let selectedContact = null;
const searchContact = $("#searchContact").val();
let userAccount = null;
let action = null;
let contactToDelete = null;


$(document).ready(function(){

    userAccount = validateAccount();

    contacts = userAccount.wallet.contacts;

    $("#h-monto").html('$' + userAccount.wallet.amount);

    listContacts();

    $("#btncloseModal").click(()=>{
        closeModal();
    });

    $("#btnnewContact").click(()=>{
        newContact();
    });

    $("#btntransferMoney").click(()=>{
        openContactListClick();
    });

    $("#btnRealizarEnvio").click(()=>{
        transferMoney();
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
        $("#btndeleteContact").css('display', 'none');
    })

    $("#inputMonto").change(() => {
        $("#alertInfo").html("");
    })

    $("#btnSearchContact").click(() => {
        openContactListClick();
    })

    $("#searchContact").change(() => {
        inputSearchContactChange();
    })
    
    $("#searchContact").focus(() => {
        $("#searchContact").val('');
    })

    $("#btnBack").click(() => {
        $("#div-contactos").css('display', 'none');
        $("#div-transaccion").css('display', 'block');
        $("#inputMonto").val('');
        if(selectedContact){
            selectContact(selectedContact.cbu)
        }
        selectedContact = null;
    })

    $("#btnExecuteTransaction").click(()=> {
        transferMoney();
    })

    $("#btndeleteContact").click(() => {
        deleteContact(contactToDelete.CBU);
    })
});


/**
 * Resetea los campos y cierra el formulario modal de creación de contacto
 */
const closeModal = () => {
    $("#inputNombre").val('');
    $("#inputApellido").val('');
    $("#inputCBU").val(0);
    $("#inputAlias").val('');
    $("#inputBanco").val('');
    $("#alertDangerModal").css("display", "none");
}

const newContact = () => {
    action = 'nuevo_contacto';
    try{
        const firstName = $("#inputNombre").val();
        const lastName = $("#inputApellido").val();
        const cbu = $("#inputCBU").val();
        const alias = $("#inputAlias").val();
        const bank = $("#inputBanco").val();
        if(!firstName || !lastName || !cbu || !alias || !bank){
            $("#modalTitle").html('Error');
            showMessage("Debe completar todos los campos", "danger");
            return;
        }
        if(contacts.find(contact => contact.CBU === cbu)){
            $("#modalTitle").html('Error');
            showMessage("Ya existe un contacto con ese CBU", "danger");
            return;
        }
        contacts.push({nombre: firstName, apellido: lastName, CBU: cbu, Alias: alias, Banco: bank});
        saveContacts();

        listContacts();
        $('#btncloseModal').click();
        $("#modalTitle").html('Exito');
        showMessage('Contacto creado correctamente', 'success');
    }catch(error){
        $("#modalTitle").html('Error');
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
        innerHTML += `<tr id="contacto-${contact.CBU}" class="list-group-item" style="cursor: pointer" onclick="selectContact(${contact.CBU})">
          <td class="contact-info">
            <span class="contact-details">CBU: ${contact.CBU}</span>
            <span class="contact-name">${contact.nombre} ${contact.apellido}</span>
            <span class="contact-details">, Alias: ${contact.Alias}, Banco: ${contact.Banco}</span>
          </td>
          <td class="contact-action">
            <button class="btn btn-sm" onclick="showDeletedContactModal(${contact.CBU})">
              <img src="./assets/trash-icon.png" alt="Eliminar" width="16" height="16">
            </button>
          </td>
        </tr>`;
    })
    $("#contactList").html(innerHTML);
}


const selectContact = (cbu) => {
    const items = document.querySelectorAll('tr');
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

const transferMoney = () => {
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
        $("#modalTitle").html('Exito');
        showMessage(`Dinero enviado correctamente:<br/>Monto: $${monto}<br/>Enviado a: ${selectedContact.nombre} ${selectedContact.apellido}`, 'success');
        $("#ModalMontoEnvio").modal("hide");
    }catch(error){
        $("#modalTitle").html('Error');
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
        $("#modalTitle").html('Error');
        showMessage('Error al actualizar el reistro', 'danger');
    }
}

const updateHistory = (monto) => {
    try{
        let historyArray = userAccount.wallet.history ?? [];
        historyArray.push({nombre: selectedContact.nombre, amount: monto, type: 'send', date: new Date().toLocaleString()});
        userAccount.wallet.history = historyArray;
    }catch(error){
        $("#modalTitle").html('Error');
        showMessage('Error al actualizar el historial', 'danger');
    }
}


const inputSearchContactChange = (event) => {
    const value = $("#searchContact").val();
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
        $("#modalTitle").html('Error'); 
        showMessage("Debe ingresar un monto válido","danger");
        return;
    }
    if(monto > userAccount.wallet.amount){
        $("#modalTitle").html('Error');
        showMessage("No tienes saldo suficiente para realizar ésta operación","danger");
        return;
    }
    $("#div-transaccion").css('display', 'none');
    $("#div-contactos").css('display', 'block');
}

const showDeletedContactModal = (cbu) => {
    contactToDelete = contacts.find(contact => contact.CBU === cbu.toString());
    $("#btndeleteContact").css('display', 'inline-block');
    $("#modalTitle").html('Eliminar contacto');
    showMessage(`¿Desea eliminar el contacto ${contactToDelete.nombre} ${contactToDelete.apellido}?`, 'info');
}

const deleteContact = (cbu) => {
    $("#btndeleteContact").css('display', 'none');
    try{
        event.stopPropagation();
        contacts = contacts.filter(contact => contact.CBU !== cbu.toString());
        saveContacts();
        listContacts();
        $("#modalTitle").html('Contacto eliminado');
        showMessage('Contacto eliminado correctamente', 'success');
    }catch(error){
        $("#modalTitle").html('Error');
        showMessage('Error al eliminar el contacto', 'danger');
    }
}