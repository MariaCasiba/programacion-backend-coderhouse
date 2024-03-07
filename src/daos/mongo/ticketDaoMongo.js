import { ticketModel } from "./models/ticket.model.js";
import { logger } from "../../utils/logger.js";

export class TicketService {

    constructor() {
        this.model = ticketModel
    }

    // creat ticket
    createTicket = async (data) => {

            const ticket = new ticketModel(data);
            await ticket.save();
            logger.info("Ticket creado:", ticket);
            return ticket;
    }
}

