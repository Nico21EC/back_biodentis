'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose12 = require("mongoose");
const Schema12 = mongoose12.Schema;

const recetaEsquema=new Schema12({
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

module.exports = mongoose12.model('Receta', recetaEsquema);