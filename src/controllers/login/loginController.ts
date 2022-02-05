
const request = require("express");
const response = require("express");
//import { request, response } from "express";

const mongoose2 = require("mongoose");
const Schema = require("mongoose");
//import mongoose, { Schema } from 'mongoose';
'üse strict'


var Esquema=require('../../model/login/Odontologo.ts');
var EsquemaSucu=require('../../model/sucursales/sucursalesModel.ts');
var EsquemaCita=require('../../model/cita/citaModel.ts');
var jwt=require("jsonwebtoken");
 exports.createOdontolo = async(req, res) => {
     
    const odonew= new Esquema();
    odonew.nombre=req.body.nombre;
    odonew.apellido=req.body.apellido;
    odonew.fechaNacimiento=Date.parse(req.body.fechaNacimiento);
    odonew.correo=req.body.correo;
    odonew.contrasenia=req.body.contrasenia;
    odonew.sucursal=req.body.sucursal;
    await odonew.save().then(async (result)=>{
        await  EsquemaSucu.findOne({nombre:odonew.sucursal},(err,sucu)=>{
            if(sucu){
                sucu.odontologos.push(odonew);
                sucu.save();
                res.json({ message: 'Odontologo creado con exito' });
            }else{
                res.status(500).json({ err});
            }
        })
    }).catch((error) => {
        res.status(500).json({ error });
      });
    
    
  
 };


exports.loginOdontolo = async(req, res) => {
    await Esquema.findOne({correo:req.body.correo,contrasenia:req.body.contrasenia}, req.body, {new:false}, (err,odon)=>{
       console.log(req.body);
        if (err){
            res.status(500).send(err);
        }
        if(!odon) {
            console.log("NO encuntra el USUARIO")
             res.status(404).send('Algo malo paso usuario');
        }else{
            const pass = req.body.contrasenia;
            console.log(odon)
            if(pass){
               
               var token= jwt.sign({_id:odon.id},"secretKey");
               res.status(201).json({token});
             
            }else{
                res.status(404).send('Algo malo paso contra');
            }
    }})

    };


    exports.allodontologos=async(req,res)=>{
        await   Esquema.find({},function (err, odo){
            EsquemaCita.populate(odo,{path:"citas"},function(err,odo){
                res.status(200).send(odo);
            })
        })
    };


    exports.cambioEstado=async(req,res)=>{
        console.log(req.body)
        const odonew= new Esquema();
        odonew.correo=req.body.correo;
        console.log(odonew.correo);
        await Esquema.findOneAndUpdate({correo:odonew.correo}, {estado:'bloqueado'},(err,odon)=>{
            if (err){
                res.status(500).send(err);
            }
            if(!odon) {
                
                 res.status(404).send('Error al encontrar el usuario');
            }else{
               
            console.log("usuario bloqueado");
            res.status(201).json(odon);
                    
                
        }})
    };


    exports.cambioContraseñaOdontolo = async (req, res) => {
        await   Esquema.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, (err,odon)=>{
            if (err){
                res.status(500).send(err);
            }
            if(!odon) {
                response.status(404).send('Error en las credenciales');
            }else{
                const pass = req.body.contrasenia;
                if(pass){
                    res.status(201).json(odon);
                    
                }
        }})
    
        };