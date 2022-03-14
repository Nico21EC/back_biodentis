//import { request, response } from "express";
const response15 = require("express")
const mongoose15 = require("mongoose");
const Schema15 = mongoose15.Schema;

'üse strict'

var EsquemaOdontograma = require('../../model/cita/citaModel.ts');
var EsquemaSucu = require('../../model/sucursales/sucursalesModel.ts');
var EsquemaOdo = require('../../model/login/Odontologo.ts');
var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts');

exports.createCita = async(req, res) => {
    console.log("BODY", req.body)
    const citanew = new EsquemaOdontograma();
    citanew.fecha = req.body.fecha;
    citanew.nombre = req.body.nombre;
    citanew.apellido = req.body.apellido;
    citanew.motivo = req.body.motivo;
    citanew.sucursal = req.body.sucursal;
    citanew.odontologo = req.body.odontologo;

    await citanew.save().then(async(result) => {
        await EsquemaSucu.findOne({ _id: citanew.sucursal }, async (err1, sucu) => {
            if (sucu) {
                sucu.citas.push(citanew);
                sucu.save()
               await EsquemaOdo.findOne({ _id: citanew.odontologo }, (err2, odo) => {
                    if (odo) {
                        odo.citas.push(citanew);
                        odo.save()
                        res.json({ message: 'Odontologo creado con exito' });
                    } else if (err2) {
                        return res.status(500).json({ message: 'error al crear' });
                    }
                });
            } else if (err1) {
                return res.status(500).json({ message: 'Error al crear' });
            }
        });

    }).catch((error) => {
        res.status(500).json({ error });
    });
};

exports.cambioDatosCita = (req, res) => {
    console.log(req.params.id);
    EsquemaOdontograma.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, pac) => {
        if (err) {
            res.status(500).send(err);
        }
        if (!pac) {
            return response15.status(404).send('Error al encontrar cita');
        } else {
            const fecha = Date.parse(req.body.fecha);
            const hora = req.body.hora;
            console.log(req.body);


            if (fecha || hora) {
                res.status(201).json(pac);

            } else {
                response15.status(409).send('Error al actualizar cita');
            }
        }
    })

};

exports.listaCitas = (req, res) => {
    EsquemaOdontograma.find({}).exec(function (err, citas) {
        res.status(200).json(citas);
    });
}
