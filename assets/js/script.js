// Login

function setUserName(element) {
    const username = element.previousElementSibling.value;
    if (username.length < 4) {
        alert("Nome pequeno demais!");
        return;
    }
    setSessionUserName(username);
}

function setSessionUserName(username) {
    const requestObj = {name: username};
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", requestObj);
    request.then(resp => {startChat(resp, requestObj);});
    request.catch(startChatError);
}

function startChat(response, requestObj) {
    setInterval(5000, sessionStatus, requestObj)
    document.querySelector(".login").id = "hidden_login_screen";
}

function sessionStatus(requestObj) {
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", requestObj);
    request.catch(startChatError);
}

function startChatError(error) {
    const statusCode = error.response.status;
    if(statusCode === "400") {
        alert("Já existe um usuário online com esse nome!")
    }
}

function sessionStatusError(error) {
    const statusCode = error.response.status;
    alert("Erro desconhecido, a pagina será recarregada!");
    window.location.replace(window.location.href)
}


// Chat