'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose23 = require("mongoose");
const Schema23 = mongoose23.Schema;

const seguimientoEsquema = new Schema23({
fecha:{
    type:Date,
    require:true,
},
total:{
    type:Number,
    require:false,
},
abono:{
    type:Number,
    require:false,
},
saldo:{
    type:Number,
    require:false,
},
estado:{
    type:String,
    max:20,
    require:false,
},
tratamientos: [{
    type: Schema23.Types.ObjectId,
    ref: 'Tratamiento'
}],
paciente: {
    type: Schema23.Types.ObjectId,
    ref: 'Paciente'
}
},
{
    timestamps:true
});

module.exports = mongoose23.model('Seguimiento', seguimientoEsquema);