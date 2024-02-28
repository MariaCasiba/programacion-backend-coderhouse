import { Router } from "express";
import { faker } from '@faker-js/faker';

const mockRouter = Router(); 


const generateProduct = () => {
    let product = {
        _id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(6),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.string.numeric(5, {bannerDigits: ['0']})),
        stock: parseInt(faker.string.numeric(2)),
        category: faker.commerce.department(),
        thumbnail: faker.image.url()
    }
    return product;
}

mockRouter.get("/mockingproducts", (req, res) => {
    try {
        let products = []
        for (let i = 0; i < 101; i++) {
        products.push(generateProduct())
        }
        res.send({status: "success", payload: products})
    } catch (error) {
        console.error(error)
        res.status(500).send({error: error, message: "No se pudieron obtener los mock products"})
    }
    
        
})


export default mockRouter