'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";


const mongoose9 = require("mongoose");
const Schema9 = mongoose9.Schema;


const piezaEsquema=new Schema9({
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

module.exports = mongoose9.model('Pieza', piezaEsquema);