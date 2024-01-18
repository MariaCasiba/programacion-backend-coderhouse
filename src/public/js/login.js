

const loginUser = async () => {
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    if (!email || !password) {
        alert("Complete los campos de usuario y contraseña.");
        return;
    }

    const user = { email, password }; 


    try {
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const data = await response.json();

            if (data.status === "success") {
                location.href = "/products";
            } else {
                alert(`Falló el inicio de sesión:  ${data.error}`);
            }
    } else {
        const errorMessage = await response.text();
        alert(`Error en la solicitud: ${errorMessage}`);
    }
    }catch (error) {
        console.log("Error al procesr la solicitud", error);
        alert('Error en la solicitud: ' + error.message)
    }
} ;




document.getElementById("btnLogIn").onclick = loginUser;