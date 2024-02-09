import { Command } from "commander";

const program = new Command();

program
    .option('-p <port>', 'puerto en el servidor', 8080)
    .option('--mode <mode>', 'modo de manejo de entornos', 'development')
    .parse()

module.exports = { program }
