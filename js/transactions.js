let userAccount = null;
$(document).ready(function(){

    userAccount = validateAccount();

     loadTranscations();

     $("#select-filter").change(function(){
        loadTranscations();
     });
     
})

const loadTranscations = () => {
    const history = userAccount.wallet.history ?? [];
    if(!history){
        showMessage('No hay movimientos', 'danger');
         return;
    }
    let htmlHistory = '';
    const historyFiltered = $("#select-filter").val() !== '' ? history.filter(transaction => transaction.type === $("#select-filter").val()) : history;
    historyFiltered.forEach(transaction => {
        htmlHistory += `<li class="list-group-item">
                            <div class="transaction-col">${transaction.nombre}</div>
                            <div class="transaction-col text-end">$${transaction.amount}</div>
                            <div class="transaction-col text-end">${getTipoTransaccion(transaction.type)}</div>
                            <div class="transaction-col text-end">${transaction.date ?? 'Sin info'}</div>
                        </li>`;
    });
    $("#historial").html(htmlHistory);
}

const getTipoTransaccion = (type) => {
    if(type === 'deposit'){
        return 'Deposito';
    }
    if(type === 'send'){
        return 'Envio';
    }
    return '';
}