const showMessage = (msg, type) => {
    $("#myModal").modal('show');
    $("#modalBody").html(msg);
    $("#myModal .modal-header").css('background-color', type === 'success' ? 'green' : 'red');
    $("#myModal .modal-header").css('color', type === 'success' ? 'white' : 'white');
    $("#myModal #btnSecondaryModal").css('display', type === 'success' ? 'none' : 'block');
    $("#myModal #btnPrimaryModal").css('display', type === 'success' ? 'block' : 'none');
}