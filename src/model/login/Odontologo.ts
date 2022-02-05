'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const odoEsquema=new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Cita'
}],

},
{
    timestamps:true
});

module.exports = Mongoose.model('Odontologo', odoEsquema);
