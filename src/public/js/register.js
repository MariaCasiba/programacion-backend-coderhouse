const registerUser = async () => {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;
    let password = document.getElementById("password").value;

    if (!first_name  || !email  || !password) {
        alert("Por favor, complete los datos faltantes");
        return; 
    }

    const user = { first_name, last_name, email, age, password };

    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(user)
        });
    
    
        if (response.ok) {
            console.log("Usuario registrado con éxito");
    
            const registroExitoso = document.getElementById("registroExitoso");
            registroExitoso.style.display = "block";
    
        } else {
            const data = await response.json();
            console.log("Error en el registro", data.message);
    
            const registroFallido = document.getElementById("registroFallido");
            registroFallido.style.display = "block";
            setTimeout(() => {
                document.getElementById("registroFallido").style.display = "none";
                document.getElementById("first_name").value = "";
                document.getElementById("last_name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("age").value = "";
                document.getElementById("password").value = "";
            }, 3000);
        }

    } catch {
        console.error('Error al procesar la solicitud', error);

    }
} 

document.getElementById("btnRegister").onclick = registerUser;