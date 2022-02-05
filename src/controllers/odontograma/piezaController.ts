import { request, response } from "express";
import mongoose, { Schema } from 'mongoose';
'üse strict'
var Esquema=require('../../model/odontograma/piezasModel');
var EsquemaOdontograma=require('../../model/odontograma/odontogramaModel');
var EsquemaPieza=require('../../model/odontograma/piezasModel');


 exports.createPieza = async (req, res) => {
    
    const piezanew= new Esquema();
    piezanew.num=req.body.num;
    piezanew.diagPieza=req.body.diagPieza;
    piezanew.zonasBucales=req.body.zonasBucales;
    piezanew.odontograma=req.body.odontograma;
  
    console.log(req.body);
     
    await piezanew.save().then((result)=>{
      if(result){
        
        EsquemaOdontograma.findOne({_id:piezanew.odontograma},(err,odo)=>{
          if(odo){
            odo.piezas.push(piezanew);
            odo.save();
              res.json({ message: 'Odontograma creada con exito' });
          }else{
              res.status(500).json({ err });
          }
      })            
       } else{
        res.status(400).json({ message: 'Error al crear Pieza'});
      }  
        })
    .catch((error) => {
        res.status(500).json({ error });
      });
 };


