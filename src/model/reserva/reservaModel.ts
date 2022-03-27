'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose13 = require("mongoose");
const Schema13 = mongoose13.Schema;

const reservaEsquema = new Schema13({
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

module.exports = mongoose13.model('Reserva', reservaEsquema);