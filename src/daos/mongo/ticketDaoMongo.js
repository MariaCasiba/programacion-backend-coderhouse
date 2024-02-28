import { ticketModel } from "./models/ticket.model.js";

export class TicketService {

    constructor() {
        this.model = ticketModel
    }

    // creat ticket
    createTicket = async (data) => {

            const ticket = new ticketModel(data);
            await ticket.save();
            console.log("Ticket creado:", ticket);
            return ticket;
    }
}

