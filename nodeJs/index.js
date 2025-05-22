import express, { json } from 'express'; //import express
import cors from "cors"; //import cors
import './scheduler.js'
import "./database/connection.js" //import connection to database
import userRouter from "./routes/user.route.js" //import routes users
import contactRouter from "./routes/contact.route.js" //import routes contacts"
import feedbackRouter from "./routes/feedback.route.js" //import routes feedback
import appointmentRouter from "./routes/appointments.route.js" //import routes appointments
import profileVisitRouter from "./routes/profileVisits.route.js" //import routes profileVisits
import reviewRouter from "./routes/review.route.js" //import routes reviews
import dotenv from 'dotenv';


dotenv.config();



const app = express(); // Create server with express
const PORT = process.env.PORT || 3001;

//const whiteList = ["http://localhost:3000","http://localhost:3001", "http://localhost:5173"];

//cors config
/*const allowedOrigins = ['http://localhost:5173','http://localhost:3001','http://localhost:3000']; // Reemplaza con el puerto/dominio de tu frontend
 const corsOptions = {
   origin: function (origin, callback) {
     // Permite solicitudes sin 'origin' (como Postman o curl) o si el origen está en la lista blanca
     console.log(origin);
     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Asegúrate de incluir OPTIONS
   allowedHeaders: ['Content-Type', 'Authorization'], // Añade otros headers que tu app use
   credentials: true // Si necesitas enviar cookies o cabeceras de autorización
};
 app.use(cors(corsOptions));*/


app.use(json());// Middleware for JSON
app.use('/api',[userRouter, contactRouter, feedbackRouter, appointmentRouter, profileVisitRouter, reviewRouter]);//routes


app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});
//start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});