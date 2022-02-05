'use strict'
const port = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

/*
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as Mongoose from "mongoose";
import { AppModule } from './app.module';
import cors from 'cors';

dotenv.config();
import env from './config/env'
import { request, response } from 'express';


const { mongoUser, mongoPwd, mongoDb, mongoHost } = env;


Mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPwd}@${mongoHost}/${mongoDb}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(
  () => {
    //bootstrap();
    console.log('Se conecto la base')
  }
).catch(
  (err) => console.log(err));
*/
const loginRoute = require('./routes/login/loginRoute');
const sucuRoute=require('./routes/sucursales/sucursalesRoute');
const citaRoute=require('./routes/cita/citaRoute');
const pacienteRoute=require('./routes/paciente/pacienteRoute');
const diagnosticoRoute=require('./routes/diagnostico/diagnosticoRoute');
const historiaClinicaRoute=require('./routes/historiaClinica/historiaClinicaRoute');
const odontogramaRoute=require('./routes/odontograma/odontogramaRouter');
const piezaRoute=require('./routes/odontograma/piezaRoute');
const recetaRoute=require('./routes/receta/recetaRoute');
const tratamientoRoute=require('./routes/tratamiento/tratamientoRoute');
const reservaRoute=require('./routes/reserva/reservaRoute');
const cors= require('cors');
const bodyParse=require('body-parser');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

const router = express.Router();

app.use(cors());
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});



app.use('/api',router);

loginRoute(router);
sucuRoute(router);
citaRoute(router);
pacienteRoute(router);
diagnosticoRoute(router);
historiaClinicaRoute(router);
odontogramaRoute(router);
piezaRoute(router)
recetaRoute(router);
tratamientoRoute(router);
reservaRoute(router);

app.get("/", (req, res) => {
  return res.send("Chatbot Funcionando 🤖🤖🤖");
});

app.listen(port, () => {
  console.log(`Escuchando peticiones en el puerto ${port}`);
});


/*
router.get('/', (request, response) => {
  response.send('Hello from home');
});

app.use(router);

app.listen(3000,()=>{
  console.log(`server corriendo`);
});*/