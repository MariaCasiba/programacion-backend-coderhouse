
/*
const crearCarrito = async () => {
    try {
        const response = await fetch("/api/carts/", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        
        const data = await response.json();

        if (data && data.status === "success") {
            const cartId = data.payload && data.payload._id ? data.payload_id.toString() : null;

            if (cartId) {
                console.log("Carrito creado con id:", cartId);
                localStorage.setItem("cart", JSON.stringify({ _id: cartId}));
                return { _id: cartId };
            } else {
                console.log("Error al obtener el id del carrito desde la respuesta: ", data);
                return null;
            }
            
        } else {
            console.log("Error al crear el carrito. Respuesta del servidor:", data);
            return null;
        }
    } catch (error) {
        console.log("Error en Crear el Carrito! " + error);
        return null;
    }
}*/

const crearCarrito = async () => {
    try {
        const response = await fetch("/api/carts/", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        const data = await response.json();

        if (data && data.status === "success" && data.payload && data.payload._id) {
            const cartId = data.payload._id.toString(); // Convertir ObjectId a cadena
            console.log("Carrito creado con id:", cartId);
            localStorage.setItem("cart", JSON.stringify({ _id: cartId }));
            return { _id: cartId };
        } else if (data && data.status === "success" && data.payload_id) {
            const cartId = data.payload_id.toString(); // Manejar la respuesta anterior (sin '_id')
            console.log("Carrito creado con id:", cartId);
            localStorage.setItem("cart", JSON.stringify({ _id: cartId }));
            return { _id: cartId };
        } else {
            console.log("Error al obtener el ID del carrito desde la respuesta:", data);
            return null;
        }
    } catch (error) {
        console.log("Error en Crear el Carrito! " + error);
        return null;
    }
}


const obtenerIdCarrito = async () => {
    try {
        if (!localStorage) {
            console.log("localStorage no está disponible en este navegador.");
            return null;
        }

        let cart = await crearCarrito();

        if (cart && cart._id) {
            console.log("Id del carrito:", cart._id);
            return cart._id;
        } else {
            console.log("No se pudo obtener el id del carrito.");
            return null;
        }
    } catch (error) {
        console.log("Error en obtener el Id del Carrito! " + error);
        return null;
    }
}


const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();

        if (!cid) {
            console.log("No se pudo obtener el id del carrito");
            return;
        }
        
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({})
        })

        if (response.ok) {
            const data = await response.json();
            console.log("Se agregó al carrito!", data);

        } else {
            console.log("Error al agregar el producto al carrito", response.status);
        }
            
    } catch (error) {
        console.log("Error en agregar el producto al Carrito! " + error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-productid');
            agregarProductoAlCarrito(productId);
        });
    });
});