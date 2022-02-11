'use strict'
const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongooseMain = require('mongoose');

//Import Config file
const config = require("./config/config.js")

const cors= require('cors');
const bodyParse=require('body-parser');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(express.static("public"));

  mongooseMain.connect(
      "mongodb+srv://nicolOnt:Imsherlock1854*@cluster0.emxpv.mongodb.net/Biodentis?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true,
},(err,res) =>{
    if(err) return console.log("Hubo un error en la base de datos", err);
    console.log("BASE DE DATOS CONECTADA");
}
);

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const router = express.Router();

app.use(cors());
app.use(express.json());

app.use('/messenger',router);

const loginRoute = require("./routes/login/loginRoute.ts");
const sucuRoute=require('./routes/sucursales/sucursalesRoute.ts');
const citaRoute=require('./routes/cita/citaRoute.ts');
const pacienteRoute=require('./routes/paciente/pacienteRoute.ts');
const diagnosticoRoute=require('./routes/diagnostico/diagnosticoRoute.ts');
const historiaClinicaRoute=require('./routes/historiaClinica/historiaClinicaRoute.ts');
const odontogramaRoute=require('./routes/odontograma/odontogramaRouter.ts');
const piezaRoute=require('./routes/odontograma/piezaRoute.ts');
const recetaRoute=require('./routes/receta/recetaRoute.ts');
const tratamientoRoute=require('./routes/tratamiento/tratamientoRoute.ts');
const reservaRoute=require('./routes/reserva/reservaRoute.ts');
const facebookRoute=require('./dialogflow/citaFacebookRouter.ts');

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
loginRoute(router);
sucuRoute(router);
facebookRoute(router);

app.get("/messenger", (req, res) => {
  return res.send("Chatbot Funcionando 🤖🤖🤖");
});

app.listen(port, () => {
  console.log(`Escuchando peticiones en el puerto ${port}`);
});