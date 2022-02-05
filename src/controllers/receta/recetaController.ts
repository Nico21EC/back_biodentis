import { request, response } from "express";
import mongoose, { Schema } from 'mongoose';
'üse strict'


var Esquema=require('../../model/receta/recetaModel');
var EsquemaHistoria=require('../../model/historiaClinica/historiaClinicaModel');


 exports.createReceta =async (req, res) => {
     
    const recetanew= new Esquema();
    recetanew.fecha=Date.parse(req.body.fecha);
    recetanew.medicamento=req.body.medicamento;
    recetanew.dosis=req.body.dosis;
    recetanew.historiaClinica=req.body.historiaClinica;
   

    await recetanew.save().then((result)=>{
        EsquemaHistoria.findOne({_id:recetanew.historiaClinica},(err,historia)=>{
            if(historia){
                historia.recetas.push(recetanew);
                historia.save();
                res.json({ message: 'Receta en historia clinica creada con exito' });
            }else{
                res.status(500).json({ err });
            }
        })
      

    }).catch((error) => {
        res.status(500).json({ error });
      });
    
    
  
 };

