import { ticketModel } from "./models/ticket.model.js";

export class TicketService {

    constructor() {
        this.model = ticketModel
    }

    // creat ticket
    createTicket = async (data) => {
        
        try {

            const ticket = new ticketModel(data);
            await ticket.save();
            console.log("Ticket creado:", ticket);
            return ticket;
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            throw error;
        }
    }
}

