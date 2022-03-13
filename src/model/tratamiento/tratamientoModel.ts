'use strict'

const mongoose14 = require("mongoose");
const Schema14 = mongoose14.Schema;

const tratamientoEsquema=new Schema14({
descripcion:{
    type:String,
    require: true,
    max:100
},
costo:{
    type: String,
    require: true,
},
abono:{
    type: String,
    require: true,
},
saldo:{
    type: String,
    require: true,
},
sesiones:{
    type: String,
    require: true
}, 
diagnostico:{
    type: Schema14.Types.ObjectId,
    ref: 'Diagnostico'
},
},
{
    timestamps:true
});

module.exports = mongoose14.model('Tratamiento', tratamientoEsquema);