let userAccount = null;
$(document).ready(function(){

    userAccount = validateAccount();

    const amount = userAccount.wallet.amount;

    $("#h-monto").html('$' + amount);

    $('#btnDeposit').click(() => {deposit()} );

    $("#btnCancel").click(()=> {
        $(location).attr('href', "dashboard.html");
    });

    $("#depositAmount").change(()=> $("#msgDepositAmount").html(''));

    $("#btnSecondaryModal").click(()=> {
        $(location).attr('href', "dashboard.html");
    });

});


const deposit = () => {
    $("#msgDepositAmount").html('');
    let errorMsg = null;
    try{
        const amount = $("#depositAmount").val();
        if(isNaN(amount) || amount <= 0){
            $("#msgDepositAmount").html("Monto no válido");
            return;
        }
        userAccount.wallet.amount += parseInt(amount);
        
        errorMsg = 'Deposito realizado. Error al actualizar el historial.';
        updateHistory(amount);

        errorMsg = 'Error al actualizar el registro';
        updateLocalStorage();        

        showMessage('Dinero depositado correctamente', 'success');
    }catch(error){
        showMessage(errorMsg ??'Error al depositar dinero', 'danger');
    }
}

const updateHistory = (amount) => {
    let historyArray = userAccount.wallet.history ?? [];
    historyArray.push({nombre: userAccount.nombre, amount, type: 'deposit', date: new Date().toLocaleString()});
    userAccount.wallet.history = historyArray;
}


const updateLocalStorage = () => {
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const index = users.findIndex(user => user.rut === userAccount.rut);
    users[index] = userAccount;
    localStorage.setItem('users', JSON.stringify(users));
}