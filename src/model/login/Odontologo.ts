'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";
const mongoose3 = require("mongoose");
const Schema2 = mongoose3.Schema;
const odoEsquema=new Schema2({
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
fechaNacimiento:{
    type:Date,
    require:false,
    
},
correo:{
    type:String,
    require:true,

},
contrasenia:{
    type:String,
    require:true,
    min:8
},estado:{
    type:String,
    default: 'activo'
},citas: [{
    type: Schema2.Types.ObjectId,
    ref: 'Cita'
}],

},
{
    timestamps:true
});

module.exports = mongoose3.model('Odontologo', odoEsquema);
