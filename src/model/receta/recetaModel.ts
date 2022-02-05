'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const recetaEsquema=new Schema({
fecha:{
    type:Date,
    require:true,
    
},
medicamento:{
    type:String,
    require:true,
    max:30
},
dosis:{
    type:String,
    max:30,
    require:false,
    
}

},
{
    timestamps:true
});

module.exports = Mongoose.model('Receta', recetaEsquema);