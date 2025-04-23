import express, { json } from 'express'; //importamos express
import cors from "cors"; //importar cors
import "./database/connection.js" //importar conexion a base de datos

const app = express(); // Crear el servidor ejecutando express
const port = 3001;//crear un puerto

const whiteList = ["http://localhost:3000","http://localhost:3001", "http://localhost:5173"];

//configurar cors
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso no permitido"));
    }
  },
};

app.use(cors(corsOptions)); //usar cors
app.use(json());// Middleware para parsear JSON

//iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});