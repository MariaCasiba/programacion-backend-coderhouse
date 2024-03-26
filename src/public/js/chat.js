const token = localStorage.getItem("token");

const socket = io({
    auth: {
        token: token
    }
});


const messages = document.getElementById("messages");
const user = document.getElementById("user");
const message = document.getElementById("message");
const btnSendMessage = document.getElementById("btnSendMessage");

// conexión inicial

socket.on("connect", () => {
    socket.emit("ClientMessage", { message: "Soy el cliente, estoy usando socket"});
})


// Manejar mensajes recibidos

socket.on("messages", (data) => {
    let salida = "";

    data.forEach(item => {
        salida += `<p class="card-text"><b>${item.user}:</b> <span class="fst-italic">${item.message}</span></p>`;
    });

    messages.innerHTML = salida;
    });


    // Manejar nuevo mensaje recibido

    socket.on("newMessage", (data) => {
        // Agregar el nuevo mensaje a la interfaz de usuario
        const newMessageHTML = `<p class="card-text"><b>${data.user}:</b> <span class="fst-italic">${data.message}</span></p>`;
        messages.innerHTML += newMessageHTML;

        
});


btnSendMessage.addEventListener("click", () => {
    const userValue = user.value;
    const messageValue = message.value;
    if (userValue && messageValue) {
        socket.emit("newMessage", { user: userValue, message: messageValue });
        user.value = "";
        message.value = "";
    }
});