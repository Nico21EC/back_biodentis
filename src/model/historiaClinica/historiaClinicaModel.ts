'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose7 = require("mongoose");
const Schema7 = mongoose7.Schema;

const historiaEsquema=new Schema7({
temperatura:{
    type:String,
    require:true,
    max:10
},
peso:{
    type:String,
    require:true,
    max:10
},
presion:{
    type:String,
    max:10,
    require:true,
    
},
anestesia:{
    type:String,
    max:2,
    require:true,

},
alergia:{
    type:String,
    max:2,
    require:false,
    
},hemoragia:{
    type:String,
    max:2,
    require:false
},tratamientoMedico:{
    type:String,
    max:2,
    require:false
},
paciente: {
    type: Schema7.Types.ObjectId,
    ref: 'Paciente'
},
recetas: [{
    type: Schema7.Types.ObjectId,
    ref: 'Receta'
}]

},
{
    timestamps:true
});

module.exports = mongoose7.model('HistoriasClinica', historiaEsquema);