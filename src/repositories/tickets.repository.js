import { TicketService } from "../daos/mongo/ticketDaoMongo.js";
import { logger } from "../utils/logger.js";

class TicketRepository {
    constructor() {
        this.ticketService = new TicketService()
    }

    // crear ticket
    createTicket = async (data) => {
        try {
            return await this.ticketService.createTicket(data);
            
        } catch(error) {
            logger.warning("Error al crear el ticket: ", error);
            throw error;
        }
    }
}

export default TicketRepository
