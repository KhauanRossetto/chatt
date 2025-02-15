function abrirMenu() {
    const sidebar = document.getElementById('sidebar');
    const cobrir = document.getElementById('cobrir');

    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-250px';
        cobrir.style.display = 'none';
    } else {
        sidebar.style.right = '0';
        cobrir.style.display = 'block';
    }
}

function enviarMensagem() {
    const messageInput = document.getElementById('mensagemEnviada');
    const message = messageInput.value.trim();

    if (message) {
        const messageData = {
            from: userName,
            to: destination,
            text: message,
            type: visibility === 'Reservadamente' ? 'private_message' : 'message'
        };
        axios.post('https://mock-api.driven.com.br/api/v6/uol/messages/aea4deed-d4ae-46eb-bbba-6bbc418b71cc', messageData)
        .then(() => {
            messageInput.value = '';
            carregarmensagem(); // Recarrega as mensagens após o envio
        })
        .catch((error) => {
            console.error('Erro ao enviar mensagem:', error);
            location.reload();
        });
    }
}




document.getElementById('mensagemEnviada').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        enviarMensagem(); // Envia a mensagem quando pressionar "Enter"
    }
});

let userName;

window.onload = function() {
    promptNomeUsuario();
};

function promptNomeUsuario() {
    userName = prompt("Digite seu nome abaixo:");
    entrarNaSala();
}

const UUID = "aea4deed-d4ae-46eb-bbba-6bbc418b71cc"; // Define UUID
let visibility = "Todos"; // Definido como "Todos" por padrão
let destination = "Todos"; // Definido como "Todos" por padrão

function entrarNaSala() {
    axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/aea4deed-d4ae-46eb-bbba-6bbc418b71cc`, { name: userName })
        .then(() => {
            console.log("Entrou na sala com sucesso!");
            iniciarChat();
        })
        .catch(() => {
            console.log("Nome de usuário já existe, escolha outro.");
            promptNomeUsuario(); // Se o nome já existir, pede novamente
        });
}

function iniciarChat() {
    setInterval(() => manterLigado(), 5000);
    setInterval(() => carregarmensagem(), 3000);
    setInterval(() => participantesCarregados(), 10000);
    carregarmensagem();
    participantesCarregados();
}

function manterLigado() {
    axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/aea4deed-d4ae-46eb-bbba-6bbc418b71cc`, { name: userName })
        .catch(() => location.reload());
}

function carregarmensagem() {
    axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/aea4deed-d4ae-46eb-bbba-6bbc418b71cc`)
        .then(response => {
            const messages = response.data;
            const containerChat = document.getElementById("containerChat");
            containerChat.innerHTML = "";

            messages.forEach(message => {
                if (message.type === "private_message" && message.to !== userName && message.from !== userName) return;
                
                const messageElement = document.createElement("div");
                messageElement.classList.add("mensagens");

                if (message.type === "status") {
                    messageElement.classList.add("entrada");
                    messageElement.style.backgroundColor = "#DCDCDC";
                } else if (message.type === "private_message") {
                    messageElement.classList.add("chatReservado");
                    messageElement.style.backgroundColor = "#FFDEDE";
                } else {
                    messageElement.classList.add("chatBox");
                    messageElement.style.backgroundColor = "white";
                }

                messageElement.innerHTML = 
                    `<span>${message.time}</span> <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}`;
                containerChat.appendChild(messageElement);
            });

            containerChat.lastElementChild?.scrollIntoView();
        });
}


function participantesCarregados(){
    axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/aea4deed-d4ae-46eb-bbba-6bbc418b71cc`)
        .then(response => {
            const participantsList = document.getElementById("participantesLista");
            participantsList.innerHTML = `
                <div class="opcoes">
                    <span>Todos</span>
                    <input type="radio" name="participant" checked onclick="setDestination('Todos')">
                </div>

            `;

            response.data.forEach(participant => {
                const participantOption = document.createElement("div");
                participantOption.classList.add("opcao");
                participantOption.innerHTML = `
                    <span>${participant.name}</span>
                    <input type="radio" name="participant" onclick="setDestination('${participant.name}')">
                `;
                participantsList.appendChild(participantOption);
            });
        });
}

function setVisibility(vis) {
    visibility = vis;
    destinoDaMensagem();
}

function setDestination(name) {
    destination = name;
    destinoDaMensagem();
}

function destinoDaMensagem() {
    const destinationText = visibility === 'Reservadamente' ? `(${destination})` : '(todos)';
    document.getElementById("destinoMensagem").textContent = `Enviando para ${destination} ${destinationText}`;
}

promptUserName(); // Chama a função para pedir o nome do usuário
