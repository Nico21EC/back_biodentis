'use strict'
//import mongoose, { Schema } from 'mongoose';
//import * as Mongoose from "mongoose";

const mongoose8 = require("mongoose");
const Schema8 = mongoose8.Schema;

const odontogramaEsquema = new Schema8({
    fechaOdonto: {
        type: Date,
        require:false,
    },diagnostico: {
        type: Schema8.Types.ObjectId,
        ref: 'Diagnostico'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose8.model('Odontograma', odontogramaEsquema);