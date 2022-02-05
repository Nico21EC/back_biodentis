import { request, response } from "express";
import mongoose, { Schema } from 'mongoose';
'üse strict'


var Esquema = require('../../model/historiaClinica/historiaClinicaModel');
var EsquemaPaciente = require('../../model/paciente/pacienteModel');
var paciente_id;

exports.createHistoria = (req, res) => {
  const historianew = new Esquema();
  historianew.temperatura = req.body.temperatura;
  historianew.peso = req.body.peso;
  historianew.presion = req.body.presion;
  historianew.anestesia = req.body.anestesia;
  historianew.alergia = req.body.alergia;
  historianew.hemoragia = req.body.hemoragia;
  historianew.tratamientoMedico = req.body.tratamientoMedico;
  historianew.paciente = req.body.paciente;
  console.log("antes de buscar paciente")

  EsquemaPaciente.findOne({ nombre: req.body.paciente }, (err, pac) => {

    if (pac) {
      console.log("encontro paciente");

      historianew.paciente = pac._id;
      pac.historia = historianew.paciente;
      pac.save();
      console.log("cambiando a object id");
      console.log(historianew.paciente);

      historianew.save().then((result) => {
        console.log(result);
        if (result) {

          res.json({ message: 'Paciente en historia clinica creado con exito' });
        } else {
          res.status(400).json({ message: 'Error al crear Historia Clinica' });
        }


      })
        .catch((error) => {
          res.status(500).json({ error });
        });
    }else{
      res.status(400).json({ message: 'Error al encontrar paciente' });
    }
  })



};
exports.historias = (req, res) => {
  Esquema.find({}).populate('recetas').populate('tratamientos').populate('paciente').exec(function (err, historia) {
    res.status(200).send(historia);
  });

};

exports.numHistorias=(req, res)=>{
 
  Esquema.countDocuments({ })
  .then((numDocs) =>{console.log(`${numDocs} documents match the specified query.`)
      res.status(200).send(String(numDocs+1));})
  .catch(err => console.error("Failed to count documents: ", err))
}


