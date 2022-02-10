'use strict'

const mongoose6 = require("mongoose");
const Schema6 = mongoose6.Schema;
const diagnosticoEsquema=new Schema6({

diagnostico:[{
    cor:String,
    faceDente: Number,
    informacoesAdicionais: String,
    letra: String,
    nome: String,
    numeroDente: Number,
}],
tratamiento: {
    type: Schema6.Types.ObjectId,
    ref: 'Tratamiento'
},
odontograma:{
    type:Schema6.Types.ObjectId,
    ref: 'Odontograma'
}
},
{
    timestamps:true
});

module.exports = mongoose6.model('Diagnostico', diagnosticoEsquema);