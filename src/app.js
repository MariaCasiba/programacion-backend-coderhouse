import express from "express";
import exphbs from "express-handlebars";
import cors from "cors";
import { configObject, connectDB } from "./config/index.js";
import cookieParser from "cookie-parser";
import __dirname from "./utils/index.js";
import indexRouter from "./routes/index.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { handleError } from "./middlewares/error/handleError.js";
import { logger, addLogger } from "./utils/logger.js";
import configureSockets from "./utils/socketManager.js";


const app = express();
const PORT = configObject.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(cors());


// middleware de passport
initializePassport();
app.use(passport.initialize());

// motor de plantilla handlebars
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);


app.use(addLogger);
app.use(indexRouter);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// conexión a mongo
connectDB();

// servidor http
const serverHttp = app.listen(PORT, (err) => {
  if (err) {
    logger.fatal(err);
  }
  logger.info(`Servidor Express listo en puerto ${PORT}`);
});

// websockets
configureSockets(serverHttp); 

app.use(handleError);

