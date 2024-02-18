import { connect } from "mongoose";



class MongoSingleton {
    static instance
    constructor(url) {
        connect(url)
    }

    static getInstance (url) {
        if(this.instance){
            console.log('Base de datos ya conectada')
            return this.instance
        }

        this.instance = new MongoSingleton(url)
        console.log('Conectado a base de datos Mongo')
        return this.instance

    }
}

export default MongoSingleton;