'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const odontogramaEsquema = new Schema({


    fechaOdonto: {
        type: Date,
        require:false,
    },diagnostico: {
        type: Schema.Types.ObjectId,
        ref: 'Diagnostico'
    }
},
    {
        timestamps: true
    });

module.exports = Mongoose.model('Odontograma', odontogramaEsquema);