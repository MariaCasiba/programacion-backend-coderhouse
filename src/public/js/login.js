const loginUser = async () => {
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    if (!email || !password) {
        alert("Complete los campos de usuario y contraseña.")
        return;
    }

    const user = {email, password};

    try{
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.ok) {
            location.href = "/products";
        } else {
            alert("Falló el login: " + data.message);
        }
    } catch (error) {
        console.error('Error al procesar la solicitud', error)
    }
    

};



document.getElementById("btnLogIn").onclick = loginUser;