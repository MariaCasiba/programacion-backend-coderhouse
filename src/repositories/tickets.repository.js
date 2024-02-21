import { TicketService } from "../daos/mongo/ticketDaoMongo.js";

class TicketRepository {
    constructor() {
        this.ticketService = new TicketService()
    }

    // crear ticket
    createTicket = async (data) => {
        try {
            return await this.ticketService.createTicket(data);
            
        } catch(error) {
            console.error("Error al crear el ticket: ", error);
            throw error;
        }
    }
}

export default TicketRepository
