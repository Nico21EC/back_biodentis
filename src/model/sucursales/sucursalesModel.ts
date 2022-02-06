
const mongoose4 = require("mongoose");
const Schema4 = mongoose4.Schema;

//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";
const sucuEsquema=new Schema4({
nombre:{
    type:String,
    require:true,
    max:30
},
direccion:{
    type:String,
    require:true,
    max:50
},
contacto:{
    type:String,
    require:false,
    max:50
},

odontologos: [{
    type: Schema4.Types.ObjectId,
    ref: 'Odontologo'
}],
citas: [{
    type: Schema4.Types.ObjectId,
    ref: 'Cita'
}],
},
{
    timestamps:true
});

module.exports = mongoose4.model("Sucursales", sucuEsquema);
