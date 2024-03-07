import { ticketService } from "../repositories/service.js";

class TicketController {
    constructor() {
        this.ticketService =  ticketService;
    }

    createTicket = async (req, res) => {
        try {    
            const { code, purchase_datetime, amount, purchaser } = req.body;

            if(!code || !purchase_datetime || !amount || !purchaser) {
                return res.status(400).json({ message: "Datos incompletos para crear el ticket de compra."})
            }

            const ticketData = {
                code,
                amount,
                purchase_datetime,
                purchaser
            };

            const ticket = await this.ticketService.createTicket(ticketData);
            req.logger.info("Ticket creado correctamente")
            res.status(201).json({ message: "Ticket creado correctamente", ticket });
            
        } catch (error) {
            req.logger.error('Error en la creación del ticket de compra:', error);
            res.status(500).json({ message: "Error interno del servidor al crear el ticket de compra"});
        }
    }

}


export default new TicketController();