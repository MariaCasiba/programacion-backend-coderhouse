


const socket= io({
    auth: {
        token: localStorage.getItem("token")
    }
});


// websockets
socket.on("connect", () => {
    console.log("Cliente conectado");

socket.emit("ClientMessage", { message: "Soy el cliente, estoy usando socket"});


// obtengo los datos del formulario RealTimeProducts y emito addProduct
const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const code = document.getElementById('code').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;
        const category = document.getElementById('category').value;
        const thumbnails = document.getElementById('thumbnails').value;

        const token = localStorage.getItem("token");

        if (token) {
            
            socket.emit('addProduct', {
                product: {
                    title: title,
                    description: description,
                    code: code,
                    price: price,
                    stock: stock,
                    category: category,
                    thumbnails: thumbnails
                },
                token: token
            });
        } else {
            console.error("No se pudo obtener el token");
        }
    });
    


// escucha productAdded 
    socket.on('productAdded', (data) => {
        const newProduct = data.product;
        const user = data.user; 
        console.log("user en cliente: " , user)

        let owner = "admin"; // Valor por defecto
        if (user && user.role === "premium") {
            owner = user.email;
        }
        console.log("nuevo producto agregado: ", newProduct);
        
        const rtProductList = document.getElementById("rt-products");
        
        const productItem = document.createElement("li");
        productItem.className = "list-group-item d-flex justify-content-between align-items-start";
        productItem.innerHTML = `
            <div class="ms-2 me-auto" id="${newProduct._id}">
                <div class="fw-bold fs-6">Nombre:
                    ${newProduct.title}
                </div>
                <div>
                    <b>Descripción:</b> ${newProduct.description}
                    <b>Precio:</b> ${newProduct.price}
                    <b>Code:</b> ${newProduct.code}
                    <b>Stock:</b> ${newProduct.stock}
                    <b>Categoría:</b> ${newProduct.category}
                    <b>Imagen:</b> ${newProduct.thumbnails}

                </div>
                <button class="delete-button btn btn-primary my-3" data-product-id="${newProduct._id}">Eliminar</button>
            </div>`;
            
        rtProductList.appendChild(productItem);    
            
    })
    
    // para eliminar prod
    const rtProductList = document.getElementById("rt-products");
    rtProductList.addEventListener("click", (event) => {
        if (event.target.classList.contains('delete-button')) {
            const productId = event.target.dataset.productId;
            socket.emit ('deleteProduct', productId);
        }
    });
    

// Escuchar productoDeleted
    socket.on('productDeleted', (productId) => {
        const deletedProduct = document.getElementById(productId);
        if (deletedProduct) {
        deletedProduct.parentElement.removeChild(deletedProduct);
        }
    })


})
