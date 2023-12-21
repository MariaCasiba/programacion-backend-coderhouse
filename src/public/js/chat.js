const socket = io();
const messages = document.getElementById("messages");
const user = document.getElementById("user");
const message = document.getElementById("message");
const btnSendMessage = document.getElementById("btnSendMessage");

// conexión inicial

socket.on("connect", () => {
    console.log("Conexión establecida con el servidor!"); 
    socket.emit("message", "Hola, soy un nuevo cliente!");
    socket.emit("newMessage", { user: "Usuario", message: "Mensaje" });
})



// Manejar mensajes recibidos
socket.on("messages", (data) => {
    let salida = "";

    data.forEach(item => {
        salida += `<p class="card-text"><b>${item.user}:</b> <span class="fst-italic">${item.message}</span></p>`;
    });

    messages.innerHTML = salida;
    });

  // Enviar mensaje
    btnSendMessage.addEventListener("click", () => {
        const userValue = user.value;
        const messageValue = message.value;

    if (userValue && messageValue) {
        socket.emit("newMessage", { user: userValue, message: messageValue });

      // Limpiar campos
        user.value = "";
        message.value = "";
    }
});