$("#spnLogout").click(() => {
    sessionStorage.removeItem('userSession');
    $(location).attr('href', "index.html");
});