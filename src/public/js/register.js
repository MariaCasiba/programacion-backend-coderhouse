
const registerUser = async () => {
    try {
        let first_name = document.getElementById("first_name").value;
        let last_name = document.getElementById("last_name").value;
        let email = document.getElementById("email").value;
        let age = document.getElementById("age").value;
        let password = document.getElementById("password").value;

        
            const user = { first_name, last_name, email, age, password };

            const response = await fetch("/api/sessions/register", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(user)
            });
        

            if (response.ok) {
                
                const data = await response.json();

                if (data && data.status === 'success') {
                    console.log("Usuario registrado con éxito");

                    const registroExitoso = document.getElementById("registroExitoso");
                    const registroFallido = document.getElementById("registroFallido");
                    registroExitoso.style.display = "block";
                    registroFallido.style.display = "none";
                } else {
                    console.error("Error en el registro", data && data.message);
                    showErrorAlert(data && data.message || 'Error en el registro. Inténtalo de nuevo.');
                    }
                } else {
                    const errorData = await response.json();
                    console.error("Error en el registro", response.status, response.statusText);
                    showErrorAlert( errorData.error || 'Hubo un problema al procesar la solicitud de registro. Por favor, inténtalo de nuevo.');
                }
        
    } catch (error) {
        console.error('Error al procesar la solicitud', error);
        showErrorAlert('Error en el registro. Inténtalo de nuevo.'); 
    };
}

function showErrorAlert(message) {
    const registroExitoso = document.getElementById("registroExitoso");
    const registroFallido = document.getElementById("registroFallido");
    registroExitoso.style.display = "none";
    registroFallido.textContent = message;
    registroFallido.classList.add("alert", "alert-danger");
    registroFallido.style.display = "block";
    setTimeout(() => {
        registroFallido.style.display = "none";
        document.getElementById("first_name").value = "";
        document.getElementById("last_name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("age").value = "";
        document.getElementById("password").value = "";
    }, 3000);
}

document.getElementById("btnRegister").onclick = registerUser;

