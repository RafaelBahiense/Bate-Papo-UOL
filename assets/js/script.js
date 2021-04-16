// Login request.then(resp => {startChat(resp, requestObj);});

let requestObj;
let username;
let to = "Todos";
let type;

function setUserName(element) {
    username = element.previousElementSibling.value;
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
    request.catch(sessionStatusError);
}

function startChatError(error) {
    const statusCode = error.response.status;
    if(statusCode === 400) {
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
    setTimeout(scrollIntoView, 500);
    setInterval(getMessages, 3000);
}

function scrollIntoView() {
    const test = document.querySelector('.messages_container > div:last-child').scrollIntoView();
}

function displayMessages(response) {
    // console.log(response.data);
    document.querySelector(".messages_container").innerHTML = ""
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].type === "message") {
            buildPublicMessage(response.data[i]);

        } else if ((response.data[i].type === "status")) {
            buildStatusMessage(response.data[i]);
        
        } else if (response.data[i].to === username || response.data[i].from === username) {
            buildPrivateMessage(response.data[i])
        }
    }
    getActiveUsers()
    console.log("getActiveUsers")

}

function buildPublicMessage(messageData) {
    document.querySelector(".messages_container").innerHTML +=  `<div class="message">
                                                                    <span><span class="time">${messageData.time}</span>  <strong>${messageData.from}</strong> para <strong>Todos</strong>:  ${messageData.text}</span>
                                                                </div>`;
}

function buildStatusMessage(messageData) {
    document.querySelector(".messages_container").innerHTML +=  `<div class="message in_out">
                                                                    <span><span class="time">${messageData.time}</span>  <strong>${messageData.from}</strong>  ${messageData.text}</span>
                                                                </div>`;
}

function buildPrivateMessage(messageData) {
    document.querySelector(".messages_container").innerHTML +=  `<div class="message private">
                                                                    <span><span class="time">${messageData.time}</span>  <strong>${messageData.from}</strong> reservadamente para <strong>${messageData.to}</strong>:  ${messageData.text}</span>
                                                                </div>`;
}

function sendMessage(element) {
    const text = element.previousElementSibling.firstElementChild.value;
    const messageObj = {
        from: username,
        to: "Todos",
        text: text,
        type: "message" // ou "private_message" para o bônus
    }
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObj);
    request.then(getMessagesAfterSending);
    request.catch(sendMessageError);
}

function getMessagesAfterSending(response) {
    getMessages(response);
    document.querySelector(".msg_input").value = "";
    setTimeout(scrollIntoView, 500);
}

function sendMessageError(error) {
    const statusCode = error.response.status;
    alert("Erro ao enviar sua menssagem!\nA Pagina será atualizada!");
    window.location.reload();
}

// key listener 

const msgInput = document.querySelector(".msg_input");
console.log(msgInput);
msgInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage(msgInput.parentElement.nextElementSibling);
    }
});

// active users

function showActiveUsersTab() {
    document.querySelector(".users_tab").setAttribute("id", "");
}

function hideActiveUsersTab() {
    document.querySelector(".users_tab").setAttribute("id", "hidden_users_tab");
}

function getActiveUsers() {
    const request = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    request.then(buildParticipantsList);
    request.catch(sessionStatusError);
    console.log("finished getActiveUsers")
}

function buildParticipantsList(response) {
    console.log("buildParticipantsList");
    console.log(document.querySelector(".submenu_title").nextElementSibling);
    console.log(response);
    document.querySelector(".submenu_title").nextElementSibling.innerHTML =    `<div class="options">
                                                                            <div>
                                                                                <ion-icon name="people"></ion-icon>
                                                                                <span>  Todos</span>
                                                                            </div>
                                                                            <ion-icon name="checkmark-sharp"></ion-icon>
                                                                        </div>`;
    for(let i = 0; i < response.data.length; i++) {
        if(response.data[i].name !== to) {
            buildUser(response.data[i].name, "");
        }
        else {
            buildUser(response.data[i].name, " hidden");
        }
    }
}

function buildUser(userName) {
    document.querySelector(".submenu_title").nextElementSibling.innerHTML +=   `<div class="options">
                                                                            <div>
                                                                                <ion-icon name="people"></ion-icon>
                                                                                <span>  ${userName}</span>
                                                                            </div>
                                                                            <ion-icon name="checkmark-sharp" class="hidden"></ion-icon>
                                                                        </div>`;
}