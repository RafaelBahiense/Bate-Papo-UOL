// Login request.then(resp => {startChat(resp, requestObj);});

let requestObj;

function setUserName(element) {
    const username = element.previousElementSibling.value;
    if (username.length < 4) {
        alert("Nome pequeno demais!");
        return;
    }
    setSessionUserName(username);
}

function setSessionUserName(username) {
    requestObj = {name: username};
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", requestObj);
    request.then(startChat);
    request.catch(startChatError);
}

function startChat() {
    setInterval(sessionStatus, 5000)
    document.querySelector(".login").id = "hidden_login_screen";
    getMessages();
    refreshMessages();
}

function sessionStatus() {
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
    window.location.reload();
}

// Chat

function getMessages() {
    const request = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    request.then(displayMessages);
    request.catch(sessionStatusError);
}

function refreshMessages() {
    setTimeout(scrollOnStart, 1000);
    setInterval(getMessages, 3000);
}

function scrollOnStart() {
    const test = document.querySelector('.messages_container > div:last-child').scrollIntoView();
}

function displayMessages(response) {
    console.log(response.data);
    document.querySelector(".messages_container").innerHTML = ""
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].to === "Todos") {
            if (response.data[i].type === "message") {
                buildPublicMessage(response.data[i], "");
            } else {
                buildPublicMessage(response.data[i], "in_out");
            }
        }
    }
}

function buildPublicMessage(messageData, style) {
    document.querySelector(".messages_container").innerHTML +=  `<div class="message ${style}">
                                                                    <span><span class="time">${messageData.time}</span>  <strong>${messageData.from}</strong> para <strong>Todos</strong>:  ${messageData.text}</span>
                                                                </div>`;
}