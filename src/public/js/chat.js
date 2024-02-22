
const socket = io();
const messages = document.getElementById("messages");
const user = document.getElementById("user");
const message = document.getElementById("message");
const btnSendMessage = document.getElementById("btnSendMessage");

// conexión inicial

socket.on("connect", () => {
    console.log("Conexión establecida con el servidor!"); 
    socket.emit("message", "Hola, soy un nuevo cliente!");
})


// Manejar mensajes recibidos

socket.on("messages", (data) => {
    let salida = "";

    data.forEach(item => {
        salida += `<p class="card-text"><b>${item.user}:</b> <span class="fst-italic">${item.message}</span></p>`;
    });

    messages.innerHTML = salida;
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

    // Manejar nuevo mensaje recibido

    socket.on("newMessage", (data) => {
        // Agregar el nuevo mensaje a la interfaz de usuario
        const newMessageHTML = `<p class="card-text"><b>${data.user}:</b> <span class="fst-italic">${data.message}</span></p>`;
        messages.innerHTML += newMessageHTML;
    
});