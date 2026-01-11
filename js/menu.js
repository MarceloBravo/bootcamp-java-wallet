$(document).ready(function(){
    let amount = localStorage.getItem('amount');
    if(!amount){
        amount = 0;
    }
    $("#h-monto").html('$' + amount);


    $("#btnDeposit").click(() => {
        disableButtons();
        showMessage("Redirigiendo a la pantalla depositar...", "deposit.html");
    })
    
    $("#btnSendMoney").click(() =>{
        disableButtons();
        showMessage("Redirigiendo a la pantalla enviar dinero...", "sendmoney.html");
    });
    
    $("#btnTransactions").click(() => {
        disableButtons();
        showMessage("Redirigiendo a la pantalla ultimos movimientos...", "transactions.html");
    });
    
});

function disableButtons(){
    $("#btnDeposit").attr('disabled', 'disabled');
    $("#btnSendMoney").attr('disabled', 'disabled');
    $("#btnTransactions").attr('disabled', 'disabled');
}

function showMessage(message, location){
    $("#alert-success").css("display", "block");
    $("#alert-success").html(message);
    setTimeout(()=>window.location.href = location, 3000);
}