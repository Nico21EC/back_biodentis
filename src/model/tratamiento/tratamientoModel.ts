'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose14 = require("mongoose");
const Schema14 = mongoose14.Schema;

const tratamientoEsquema=new Schema14({
fecha:{
    type:Date,
    require:true,
    
},
planTratamiento:{
    type:String,
    require:true,
    max:80
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
    
}

},
{
    timestamps:true
});

module.exports = mongoose14.model('Tratamiento', tratamientoEsquema);