

// crear carrito
const crearCarrito = async () => {
    try {
        const response = await fetch("/api/carts/", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        const data = await response.json();

        if (data && data.status === "success" && data.payload && data.payload._id) {
            const cartId = data.payload._id.toString(); 
            console.log("Carrito creado con id:", cartId);
            localStorage.setItem("cart", JSON.stringify({ _id: cartId }));
            return { _id: cartId };
        } else if (data && data.status === "success" && data.payload_id) {
            const cartId = data.payload_id.toString(); 
            console.log("Carrito creado con id:", cartId);
            localStorage.setItem("cart", JSON.stringify({ _id: cartId }));
            return { _id: cartId };
        } else {
            console.error("Error al obtener el ID del carrito desde la respuesta:", data);
            return null;
        }
    } catch (error) {
        console.error("Error en Crear el Carrito! " + error);
        return null;
    }
}


// obtener carrito por id
const obtenerIdCarrito = async () => {
    try {
        if (!localStorage) {
            console.error("localStorage no está disponible en este navegador.");
            return null;
        }

        const existingCart = localStorage.getItem("cart");

        if (existingCart) {
            const cart = JSON.parse(existingCart);
            if (cart._id) {
                console.log("Id del carrito existente: ", cart._id);
                return cart._id.toString();
            }
        }

        const response = await fetch("/api/users/current", {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8",
        }
            
        });

        const userData = await response.json();

        if (response.ok && userData && userData.cartId) {
            const existingCartId = userData.cartId.toString();
            console.log("Id del carrito existente asociado al usuario: ", existingCartId);
            localStorage.setItem("cart", JSON.stringify({ _id: existingCartId }));
            return existingCartId;
        }
        
        const newCart = await crearCarrito();

        if (newCart && newCart._id) {
            console.log("Id del nuevo carrito:", newCart._id);
            localStorage.setItem("cart", JSON.stringify({ _id: newCart._id }));
            return newCart._id.toString();
        } else {
            console.error("No se pudo obtener el id del carrito");
            return null;
        }
                
    } catch (error) {
        console.error("Error en obtener el Id del Carrito! " + error);
        return null;
    }
}


// agregar producto al carrito
const agregarProductoAlCarrito = async (pid) => {
    try {
    
        const responseUser = await fetch("/api/sessions/current", {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        const userData = await responseUser.json();

        if (!responseUser.ok) {
            console.error("Error al obtener información del usuario:", userData && userData.error);
            alert("Ud. no está autorizado a hacer compras en esta página")
            return;
        }

        const cid = userData.user.cartId;

        if (!cid) {
            console.error("No se pudo obtener el id del carrito");
            return;
        }

        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({})
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Se agregó al carrito!", data);

        } else {
            console.error("Error al agregar el producto al carrito", response.status);
        }
            
    } catch (error) {
        console.error("Error en agregar el producto al Carrito! ", error);

        if (response) {
            const responseData = await response.text();
            console.log("Respuesta del servidor al agregar el producto:", responseData);
        }
    }
}



// btn agregar al carrito
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-productid');
            agregarProductoAlCarrito(productId);
        });
    });


// btn logout
const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) { 
        btnLogout.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/sessions/logout", {
                    method: "GET",
                });

                if (response.status === 200) {
                    console.error("Sesión cerrada con éxito");
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


const terminarCompra = async(req, res) => {
    try {
        const responseUser = await fetch("/api/sessions/current", {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        const userData = await responseUser.json();

        if (!responseUser.ok) {
            console.error("Error al obtener información del usuario:", userData && userData.error);
            return;
        }

    
        const cid = userData.user.cartId;

        console.log("cid en terminarCompra: ", userData.user.cartId)

        if (!cid) {
            console.log("No se pudo obtener el id del carrito");
            return;
        }

        const responseCart = await fetch(`/api/carts/${cid}`, {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });


        const cartData = await responseCart.json();
        console.log("CartData: " , cartData)

        if(!cartData || !cartData.payload || !cartData.payload.products) {
            console.error("CartData no contiene el atributo products")
            return
        }

        const { products } = cartData.payload;

        const outOfStockProducts = products.filter(product => product.product.stock === 0);

        if (outOfStockProducts.length > 0) {
            alert("Algunos productos no tienen suficiente stock. Se continuará la compra con los productos disponibles.")
        } 

        if (outOfStockProducts.length === products.length) {
            alert("Ningún producto tiene suficiente stock. No se pudo completar la compra.");
            return; 
        }

        const ticketData = {
            products
        };

        const url = `/api/carts/${cid}/purchase`;

    const responsePurchase = await fetch(url, {
        method: 'POST',
        credentials: "include",
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify(ticketData)
    });

    if (!responsePurchase.ok) {
        console.error("Error en la respuesta", responsePurchase.statusText);
        const text = await response.text();
        console.error(text);
        return;
    }

    const data = await responsePurchase.json();
    console.log("Compra realizada con éxito", data);

    alert("Gracias por tu compra! Se envió un email con los detalles de tu compra.")
    window.location.href = '/products'

    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
}

