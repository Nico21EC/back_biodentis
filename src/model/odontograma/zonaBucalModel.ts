'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const zonaEsquema=new Schema({
nombre:{
    type:String,
    require:true,

}

}
);

module.exports = Mongoose.model('ZonasBucales', zonaEsquema);