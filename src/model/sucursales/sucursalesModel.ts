
import mongoose, { Schema } from 'mongoose';
import * as Mongoose from "mongoose";
const sucuEsquema=new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Odontologo'
}],
citas: [{
    type: Schema.Types.ObjectId,
    ref: 'Cita'
}],

},

{
    timestamps:true
});

module.exports = Mongoose.model("Sucursales", sucuEsquema);
