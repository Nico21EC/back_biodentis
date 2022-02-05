'use strict'
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const diagnosticoEsquema=new Schema({

diagnostico:[{
    cor:String,
    faceDente: Number,
    informacoesAdicionais: String,
    letra: String,
    nome: String,
    numeroDente: Number,
}],odontograma: {
    type: Schema.Types.ObjectId,
    ref: 'Odontograma'
}
},
{
    timestamps:true
});

module.exports = Mongoose.model('Diagnostico', diagnosticoEsquema);