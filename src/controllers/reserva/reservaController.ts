import { request, response } from "express";
import mongoose, { Schema } from 'mongoose';
import * as moment from 'moment';
'üse strict'


var Esquema = require('../../model/reserva/reservaModel');


exports.createReserva = (req, res) => {
    console.log(req.body)
 console.log(moment(req.body.fecha).format('LLL'))
    const reservanew = new Esquema();
    console.log(req.body)
    reservanew.fecha =  moment(req.body.fecha).format('LLL');
    
    
    reservanew.motivo = req.body.motivo;
    reservanew.nombre = req.body.nombre;
    reservanew.apellido = req.body.apellido;


    reservanew.save().then((result) => {
        res.status(200).json(result);


    }).catch((error) => {
        res.status(500).json({ error });
    });



};

exports.cambioDatosReserva = (req, res) => {
    console.log(req.params.id);
    Esquema.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, pac) => {
        if (err) {
            res.status(500).send(err);
        }
        if (!pac) {
            return response.status(404).send('Error al encontrar reserva');
        } else {
            const fecha = Date.parse(req.body.fecha);
            const hora = req.body.hora;
            console.log(req.body);


            if (fecha || hora) {
                res.status(201).json(pac);

            } else {
                response.status(409).send('Error al actualizar reserva');
            }
        }
    })

};

exports.listaReservas = (req, res) => {
    Esquema.find({}).exec(function (err, reservas) {
        res.status(200).json(reservas);
    });
}

exports.reservaEdit = (req, res) => {
    Esquema.findOne({})
    .where({fecha: req.params.fecha})
    .exec((err, act) => {
        if(err) {
            console.log('hubo un error');
            return res.status(500).json({error: err.message}); //debes enviar una respuesta o llamar al manejador de errores (return next(err))
        }
        console.log(act);
        return res.status(200).json(act); // en este ejemplo se envía el resultado
    });
}
