'use strict'
const mongoose5 = require("mongoose");
const Schema5 = mongoose5.Schema;

//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";
const citaEsquema = new Schema5({
    nombre: {
        type: String,

        require: false,
    },
    apellido: {
        type: String,
        max: 80,
        require: false,
    },
    fecha: {
        type: Date,
        require: true,

    },
  
    motivo: {
        type: String,
        max: 80,
        require: false,
    }

},
    {
        timestamps: true
    });

module.exports = mongoose5.model('Cita', citaEsquema);