'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose11 = require("mongoose");
const Schema11 = mongoose11.Schema;

const pacienteEsquema=new Schema11({
nombre:{
    type:String,
    require:true,
    max:30
},
apellido:{
    type:String,
    require:true,
    max:30
},
numCedula:{
    type:String,
    max:10,
    require:true,
    
},
correo:{
    type:String,
    require:true,

},
celular:{
    type:String,
    max:10,
    require:true,

},
direccion:{
    type:String,
    require:false,
    max:30
},sexo:{
    type:String,
    require:false,
    max:1
},edad:{
    type:Number,
    require:false,
    min:8
},

diagnosticos: [{
    type: Schema11.Types.ObjectId,
    ref: 'Diagnostico'
}],
historia: {
    type: Schema11.Types.ObjectId,
    ref: 'HistoriasClinica'
},

},
{
    timestamps:true
});

module.exports = mongoose11.model('Paciente', pacienteEsquema);