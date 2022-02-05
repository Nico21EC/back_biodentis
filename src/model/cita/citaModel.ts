'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const citaEsquema = new Schema({
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

module.exports = Mongoose.model('Cita', citaEsquema);