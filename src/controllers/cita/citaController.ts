//import { request, response } from "express";

const response15 = require("express")
const mongoose15 = require("mongoose");
const Schema15 = mongoose15.Schema;

'üse strict'


var EsquemaOdontograma=require('../../model/cita/citaModel.ts');
var EsquemaSucu=require('../../model/sucursales/sucursalesModel.ts');
var EsquemaOdo=require('../../model/login/Odontologo.ts');
var EsquemaPaciente=require('../../model/paciente/pacienteModel.ts');

 exports.createCita =(req, res) => {
     
    const citanew= new EsquemaOdontograma();
    citanew.fecha=Date.parse(req.body.fecha);
    citanew.hora=req.body.hora;
    citanew.motivo=req.body.motivo;
    citanew.sucursal=req.body.sucursal;
    citanew.odontologo=req.body.odontologo;
    citanew.paciente=req.body.paciente;

    citanew.save().then( (result)=>{
        EsquemaSucu.findOne({nombre:citanew.sucursal},(err,sucu)=>{
            if(sucu){
                sucu.citas.push(citanew);
                sucu.save();
               // res.json({ message: 'Cita en sucursal creado con exito' });
            }else if(err){
              return   res.status(500).json({ message:'Error al crear' });
            }
        });
        EsquemaOdo.findOne({nombre:citanew.odontologo},(err,odo)=>{
            console.log(odo);
            if(odo){
                odo.citas.push(citanew);
                odo.save();
                //res.json({ message: 'Cita en odontologo y sucursal creado con exito' });
            }else if(err){
               return res.status(500).json({ message: 'error al crear'  });
            }
        });
      EsquemaPaciente.findOne({nombre:citanew.paciente},(err,pac)=>{
            console.log(pac);
            if(pac){
                pac.citas.push(citanew);
                pac.save().then(()=>console.log("Paciente acrualizado")).catch(error => console.log(error));
               
               return res.json({ message: 'Cita en  odontologo ,sucursal y paciente creado con exito' });
            }else if(err){
               return res.status(500).json({ message:'error al crear' });
            } 
        }); 
       
    }).catch((error) => {
        res.status(500).json({ error });
      });
    
     
  
 };

 exports.cambioDatosCita= (req, res) => {
    console.log(req.params.id);
    EsquemaOdontograma.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, (err,pac)=>{
        if (err){
            res.status(500).send(err);
        }
        if(!pac) {
            return response15.status(404).send('Error al encontrar cita');
        }else{
            const fecha = Date.parse(req.body.fecha);
            const hora=req.body.hora;
            console.log(req.body);
            
            
            if(fecha || hora){
                res.status(201).json(pac);
                
            }else{
                response15.status(409).send('Error al actualizar cita');
            }
    }})
  
    };

exports.listaCitas= (req, res) => {
    EsquemaOdontograma.find({}).exec(function (err, citas) {
        res.status(200).json(citas);
      });
    }
