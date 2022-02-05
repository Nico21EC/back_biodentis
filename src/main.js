'use strict'
const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const mongoose = require('mongoose');

const cors= require('cors');
const bodyParse=require('body-parser');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

/*
  mongoose.connect(
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

*/
//const router = express.Router();

app.use(cors());
app.use(express.json());

app.use('/api',router);
/*
const loginRoute = require("./routes/login/loginRoute");
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
*/

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