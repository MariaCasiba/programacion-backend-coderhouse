import { UserService } from "../daos/mongo/usersDaoMongo.js";
import { CartService } from "../daos/mongo/cartsDaoMongo.js";
import { ChatService } from "../daos/mongo/chatDaoMongo.js";
import { ProductService } from "../daos/mongo/productsDaoMongo.js";
import { TicketService } from "../daos/mongo/ticketDaoMongo.js";

import UserRepository from "./user.repository.js";
import CartRepository from "./carts.repository.js";
import ChatRepository from "./chat.repository.js";
import ProductRepository from "./products.repository.js";
import TicketRepository from "./tickets.repository.js";

const userService = new UserRepository(new UserService());
const cartService = new CartRepository(new CartService());
const chatService = new ChatRepository(new ChatService());
const productService = new ProductRepository(new ProductService());
const ticketService = new TicketRepository(new TicketService());

export { userService, cartService, chatService, productService, ticketService };
