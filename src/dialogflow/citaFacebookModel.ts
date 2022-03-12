'use strict'
const mongoose21 = require("mongoose");
const Schema21 = mongoose21.Schema;
const citaFacebookEsquema = new Schema21({
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
    hora:{
        type: String,
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

module.exports = mongoose21.model('CitaFacebook', citaFacebookEsquema);

//CitaFacebook