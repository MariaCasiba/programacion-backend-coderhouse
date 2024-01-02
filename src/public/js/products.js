
const crearCarrito = async () => {
    try {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart"));
        } else {
            const response = await fetch("/api/carts/", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const data = await response.json();
            localStorage.setItem("cart", JSON.stringify(data));

            return data;
        }
    } catch (error) {
        console.log("Error en Crear el Carrito! " + error);
    }
}

const obtenerIdCarrito = async () => {
    try {
        let cart = await crearCarrito();
        return cart._id;
    } catch (error) {
        console.log("Error en obtener el Id del Carrito! " + error);
    }
}


const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();

        await fetch("/api/carts/" + cid + "/products/" + pid, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Se agregó al Carrito!");
            });
    } catch (error) {
        console.log("Error en agregar el Producto al Carrito! " + error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) { 
        btnLogout.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/sessions/logout", {
                    method: "POST",
                });

                if (response.status === 200) {
                    console.log("Sesión cerrada con éxito");
                    window.location.href = "/login";
                } else {
                    console.log("Error al cerrar sesión");
                }
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});