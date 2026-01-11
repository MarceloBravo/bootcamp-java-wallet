$(document).ready(function(){
    let amount = localStorage.getItem('amount');
    if(!amount){
        amount = 0;
    }
    $("#h-monto").html('$' + amount);

    $('#depositForm').submit(
        function(event){
            event.preventDefault();
            deposit();
        }
    );


    $("#btnCancel").click(()=> {
        backToMenu("Regresando al menú principal...")
    });

});

function backToMenu(mensaje){
    $(".alert-danger").css("display", "none");
    $("#alert-container").css("display","block");
    $("#alert-container").html(mensaje);
    setTimeout(()=>window.location.href = "menu.html", 2000);
}


function deposit(){
    const amount = $("#depositAmount").val();
    if(isNaN(amount) || amount <= 0){
        $("#alert-container").css("display","none");
        $(".alert-danger").css("display", "block");
        return;
    }
    let currentAmount = localStorage.getItem('amount');
    if(!currentAmount){
        currentAmount = 0;
    }
    let newAmount = parseInt(currentAmount) + parseInt(amount);
    localStorage.setItem('amount', newAmount);
    $("#p-summary").html(`Monto depositado $ ${amount} <br/>Nuevo saldo $ ${newAmount}`);
    updateHistory();
    disabledButtons();
    backToMenu("Dinero depositado correctamente!");
}

function updateHistory(){
    const history = localStorage.getItem('history');
    let historyArray = [];
    if(!history){
        localStorage.setItem('history', JSON.stringify(historyArray));
    }else{
        historyArray = JSON.parse(history);
    }
    const usuario = localStorage.getItem('user');
    historyArray.push({contact: {nombre: usuario.split(' ')[0] ?? 'Desconocido', apellido: usuario.split(' ')[1] ?? ''}, amount: 1000, type: 'deposit', date: new Date().toLocaleString()});
    localStorage.setItem('history', JSON.stringify(historyArray));
}


function disabledButtons(){
    $("#btnDeposit").attr('disabled', 'disabled');
    $("#btnCancel").attr('disabled', 'disabled');
}