$(document).ready(function(){

     loadTranscations();

     $("#select-filter").change(function(){
        loadTranscations();
     });
})

function loadTranscations(){
    const history = localStorage.getItem('history');
    if(!history){
         $("#historial").html('No hay movimientos');
         return;
    }
    const historyArray = JSON.parse(history);
    let htmlHistory = '';
    const historyFiltered = $("#select-filter").val() !== '' ? historyArray.filter(transaction => transaction.type === $("#select-filter").val()) : historyArray;
    historyFiltered.forEach(transaction => {
        htmlHistory += `<li class="list-group-item">
                        ${transaction.contact.nombre} ${transaction.contact.apellido} - $${transaction.amount} - ${getTipoTransaccion(transaction.type)} - ${transaction.date ?? 'Sin info'}
                        </li>`;
    });
    $("#historial").html(htmlHistory);
}

function getTipoTransaccion(type){
    if(type === 'deposit'){
        return 'Deposito';
    }
    if(type === 'send'){
        return 'Envio';
    }
    return 'Desconocida';
}
