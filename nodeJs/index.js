import express, { json } from 'express'; //import express
import cors from "cors"; //import cors
import "./database/connection.js" //import connection to database
import userRouter from "./routes/user.route.js" //import routes users
import contactRouter from "./routes/contact.route.js" //import routes contacts"
import feedbackRouter from "./routes/feedback.route.js" //import routes feedback
import appointmentRouter from "./routes/appointments.route.js" //import routes appointments
import profileVisitRouter from "./routes/profileVisits.route.js" //import routes profileVisits
import reviewRouter from "./routes/review.route.js" //import routes reviews



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
app.use([userRouter, contactRouter, feedbackRouter, appointmentRouter, profileVisitRouter, reviewRouter]);//routes

//start server
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});