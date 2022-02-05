'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const historiaEsquema=new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
},
recetas: [{
    type: Schema.Types.ObjectId,
    ref: 'Receta'
}],
tratamientos: [{
    type: Schema.Types.ObjectId,
    ref: 'Tratamiento'
}],

},
{
    timestamps:true
});

module.exports = Mongoose.model('HistoriasClinica', historiaEsquema);