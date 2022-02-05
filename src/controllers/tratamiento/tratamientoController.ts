import { request, response } from "express";
import mongoose, { Schema } from 'mongoose';

var Esquema=require('../../model/tratamiento/tratamientoModel');
var EsquemaHistoria=require('../../model/historiaClinica/historiaClinicaModel');


 exports.createTratamiento =async (req, res) => {
    const tratamientonew= new Esquema();
    tratamientonew.fecha=Date.parse(req.body.fecha);
    tratamientonew.planTratamiento=req.body.planTratamiento;
    tratamientonew.total=Number(req.body.total);
    tratamientonew.abono=Number(req.body.abono);
    tratamientonew.saldo=Number(req.body.saldo);
    tratamientonew.estado=req.body.estado;
    tratamientonew.historiaClinica=req.body.historiaClinica;
   
    await tratamientonew.save().then((result)=>{
        EsquemaHistoria.findOne({_id:tratamientonew.historiaClinica},(err,historia)=>{
            if(historia){
                historia.tratamientos.push(tratamientonew);
                historia.save();
                res.json({ message: 'Tratamiento en historia clinica creada con exito' });
            }else{
                res.status(500).json({ err });
            }
        })
      

    }).catch((error) => {
        res.status(500).json({ error });
      });
    
    
  
 };
