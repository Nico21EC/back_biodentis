//import { request, response } from "express";
//import mongoose, { Schema } from 'mongoose';
'üse strict'

var EsquemaOdontograma=require('../../model/sucursales/sucursalesModel.ts');
var EsquemaCita=require('../../model/cita/citaModel.ts');
var EsquemaOdo=require('../../model/login/Odontologo.ts');


 exports.createSucursal = (req, res) => {
     const sucunew= new EsquemaOdontograma();
     sucunew.nombre=req.body.nombre;
     sucunew.direccion=req.body.direccion;
     sucunew.contacto=req.body.contacto;
     
    console.log(req.body);
     
    sucunew.save().then((result)=>{
      if(result){
        res.json({ message: 'Sucursal creado con exito' });
      }else{
        res.status(400).json({ message: 'Error al crear Sucursal'});
      }  
               
            
        })
    .catch((error) => {
        res.status(500).json({ error });
      });
 };


 
exports.sucursales = (req, res) => {
    EsquemaOdontograma.find({}).populate('citas').populate('odontologos').exec(function(err,sucu){
      res.status(200).send(sucu);
    });

    };
  