'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const piezaEsquema=new Schema({
num:{
    type:String,
    require:true,

},diagPieza:{
    type:String,
    require:true,
},
zonasBucales:[{type:String}],
}
);

module.exports = Mongoose.model('Pieza', piezaEsquema);