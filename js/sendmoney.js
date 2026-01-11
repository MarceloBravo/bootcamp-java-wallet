 let contacts = [
    {nombre: 'Jon', apellido: 'Doe', CBU: 123456789, Alias: 'john.doe', Banco: 'ABC Banck'},
    {nombre: 'Jane', apellido: 'Smith', CBU: 987654321, Alias: 'jane.smith', Banco: 'XYZ Bank'},
];
let selectedContact = null;
const searchContact = $("#searchContact").val();


$(document).ready(function(){
    const storageContacts = localStorage.getItem('contacts');
    if(!storageContacts){
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }else{
        contacts = JSON.parse(storageContacts);
    }
    listContacts();
    

    $("#btnCerrarModal").click(()=>{
        cerrarModal();
    });

    $("#btnNuevoContacto").click(()=>{
        nuevoContacto();
    });

    $("#btnEnviarDinero").click(()=>{
        enviarDinero();
    });

    $("#btnBackToMenu").click(()=>{
        disableButtons();
        $("#alertSuccess").html("Regresando al menú principal...");
        $("#alertSuccess").css("display", "block");
        setTimeout(()=>window.location.href = "menu.html", 2000)
    });


    
});


function cerrarModal(){
    $("#inputNombre").val('');
    $("#inputApellido").val('');
    $("#inputCBU").val(0);
    $("#inputAlias").val('');
    $("#inputBanco").val('');
    $("#alertDangerModal").css("display", "none");
}

function nuevoContacto(){
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
    localStorage.setItem('contacts', JSON.stringify(contacts));
    listContacts();
    $('#btnCerrarModal').click();
};


function listContacts(filtered = null){
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


function liSeleccionarContactoClick(id){
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

function enviarDinero(){
    if(!selectedContact){
        $("#alertDanger").css("display", "block");
        $("#alertDanger").html("Debe seleccionar un contacto");
        return;
    }

    $("#alertInfo").css("display", "block");
    $("#alertInfo").html("Dinero enviado: $1000\nContacto: " + selectedContact.nombre + " " + selectedContact.apellido);
    let currentAmount = localStorage.getItem('amount');
    let newAmount = parseInt(currentAmount) - 1000;
    localStorage.setItem('amount', newAmount);
    updateHistory();
    disableButtons();
    setTimeout(()=> $(location).attr('href', "menu.html"), 3000);
}

function updateHistory(){
    const history = localStorage.getItem('history');
    let historyArray = [];
    if(!history){
        localStorage.setItem('history', JSON.stringify(historyArray));
    }else{
        historyArray = JSON.parse(history);
    }
    historyArray.push({contact: selectedContact, amount: 1000, type: 'send', date: new Date().toLocaleString()});
    localStorage.setItem('history', JSON.stringify(historyArray));
}

function inputSearchContactChange(event){
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

function disableButtons(){
    $("#btnShowModal").attr('disabled', 'disabled');
    $("#btnEnviarDinero").attr('disabled', 'disabled');
    $("#btnBackToMenu").attr('disabled', 'disabled');
}
