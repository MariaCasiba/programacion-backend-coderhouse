

const loginUser = async () => {
    try {
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;

        if (!email || !password) {
            alert("Complete los campos de usuario y contraseña.");
            return;
        }

        const user = { email, password };

        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            try {
                const data = await response.json();

                if (data && data.status === "success") {
                    console.log("Inicio de sesión exitoso");
                    location.href = "/products";
                } else {
                    console.log("Falló el inicio de sesión", data && data.message);
                    showLoginError(data && data.message || "Error en el inicio de sesión. Inténtalo de nuevo.");
                }
            } catch (error) {
                console.error("Error al parsear la respuesta JSON", error);
                showLoginError("Error en el inicio de sesión. Inténtalo de nuevo.");
            }
        } else if (response.status === 401) {
            const data = await response.json();
            showLoginError(data && data.message || "Error en el inicio de sesión. Inténtalo de nuevo.");
        } else {
            console.log("Error en el inicio de sesión", response.statusText);
            showLoginError(response.statusText || "Error en el inicio de sesión. Inténtalo de nuevo.");
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

document.getElementById("btnLogIn").onclick = loginUser;