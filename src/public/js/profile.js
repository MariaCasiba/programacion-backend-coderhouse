

document.addEventListener("DOMContentLoaded", function () {
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) { 
        btnLogout.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/sessions/logout", {
                    method: "GET",
                });

                if (response.status === 200) {
                    console.info("Sesión cerrada con éxito");
                    window.location.href = "/login";
                } else {
                    console.error("Error al cerrar sesión");
                }
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});