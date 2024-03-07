

const loginUser = async () => {
    try {
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;

        const user = { email, password };

        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(user),
            credentials: "include", 
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.status === "success") {
                console.log("Inicio de sesión exitoso");

                const token = data.token || getCookie("token");

                localStorage.setItem("token", token);
                location.href = "/products";
            } else {
                console.error("Falló el inicio de sesión", data && data.message);
                showLoginError(data && data.message || "Error en el inicio de sesión. Inténtalo de nuevo.");   
            }
        } else {
            const errorData = await response.json();
            console.error("Error en la respuesta del servidor:", response.status, response.statusText);
            showLoginError(errorData.error || "Error en el inicio de sesión. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud", error);
        showLoginError("Error en el inicio de sesión. Inténtalo de nuevo.");
    }
};


function showLoginError(message) {
    const errorMessageElement = document.getElementById("loginErrorMessage");

    errorMessageElement.textContent = message;
    errorMessageElement.classList.add("alert", "alert-danger");
    errorMessageElement.style.display = "block";
    setTimeout(() => {
        errorMessageElement.style.display = "none";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    }, 3000);
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

document.getElementById("btnLogIn").onclick = loginUser;
