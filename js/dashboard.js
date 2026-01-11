$(document).ready(function(){
    const userAccount = validateAccount();

    const amount = userAccount.wallet.amount;

    if(!amount || amount <= 0){
        $("#btnSendMoney").attr('disabled',true);
    }

    $("#h-monto").html('$' + amount);

    $("#btnDeposit").click(() => {
        $(location).attr('href', "deposit.html");
    })
    
    $("#btnSendMoney").click(() =>{
        $(location).attr('href', "sendmoney.html");
    });
    
    $("#btnTransactions").click(() => {
        $(location).attr('href', "transactions.html");
    });
    
});