import express, { json } from 'express'; //import express
import cors from "cors"; //import cors
import "./database/connection.js" //import connection to database
import userRouter from "./routes/user.routes.js" //import routes users
import contactRouter from "./routes/contacts.routes.js" //import routes contacts"

const app = express(); // Create server with express
const port = 3001;//create port

const whiteList = ["http://localhost:3000","http://localhost:3001", "http://localhost:5173"];

//cors config
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso no permitido"));
    }
  },
};

app.use(cors(corsOptions)); //using cors
app.use(json());// Middleware for JSON
app.use([userRouter, contactRouter]);//middleware for routes

//start server
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});