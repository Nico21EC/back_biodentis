//import { request, response } from "express";
//import mongoose, { Schema } from 'mongoose';

'üse strict'

var Esquema = require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts');
var EsquemaOdontograma = require('../../model/diagnostico/diagnosticoModel.ts');

exports.creatediagnostico = async (req, res) => {
    console.log(req);
    const diagnosticonew = new Esquema();
    //diagnosticonew.fecha=Date.parse(req.body.fecha);
    diagnosticonew.diagnostico = req.body.diagnostico;
    //diagnosticonew.odontograma=req.body.odontograma;
    diagnosticonew.paciente = req.body.paciente;
    console.log("odontogramaaaaaaaaqaaaaa")
    console.log(req);
  
            diagnosticonew.odontograma =  req.body.odontograma;
          
            await diagnosticonew.save().then((result) => {

                EsquemaPaciente.findOne({ _id: diagnosticonew.paciente }, (err, pac) => {
                    console.log(diagnosticonew.paciente )
                    if (pac) {
                        pac.diagnosticos.push(diagnosticonew);
                        pac.save();
                        res.json({ message: 'Odontograma  en diagnostico creado con exito' });
                    } else if (err) {
                        res.status(400).json({ message: 'Error al crear Odontograma' })
                    }
                });

            }).catch((error) => {
                res.status(500).json({ error });
            });
      
  
};