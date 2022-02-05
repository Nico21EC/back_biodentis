'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose10 = require("mongoose");
const Schema10 = mongoose10.Schema;

const zonaEsquema=new Schema10({
nombre:{
    type:String,
    require:true,
}
}
);

module.exports = mongoose10.model('ZonasBucales', zonaEsquema);