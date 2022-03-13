var EsquemaTratamiento = require('../../model/tratamiento/tratamientoModel.ts');
var EsquemaDiagnostico = require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaSeguimiento = require('../../model/tratamiento/seguimientoModel.ts')
var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts')

exports.createTratamiento = async (req, res) => {
    const tratamientonew = new EsquemaTratamiento();
    tratamientonew.descripcion = req.body.descripcion;
    tratamientonew.costo = req.body.costo;
    tratamientonew.abono = req.body.abono;
    tratamientonew.saldo = req.body.saldo;
    tratamientonew.sesiones = req.body.sesiones;
    await tratamientonew.save().then((result) => {
        console.log(req.body.diagnostico);
        EsquemaDiagnostico.findOne({ _id: req.body.diagnostico }, (err, diagnostico) => {
            if (diagnostico) {
                diagnostico.tratamientos.push(tratamientonew);
                diagnostico.save();
                EsquemaSeguimiento.findOne({ _id: req.body.seguimiento }, (exc, seguimiento) => {
                    if (seguimiento) {
                        seguimiento.tratamientos.push(tratamientonew);
                        seguimiento.save()
                        res.json(result)
                    } else {
                        res.status(500).json({ exc })
                        console.log("Catch 500 guardar seguimiento");
                    }
                }
                )
            } else {
                res.status(500).json({ err });
                console.log("Catch 500 diagnostico");
            }
        }
        )
    }).catch((error) => {
        res.status(500).json({ error });
        console.log("Catch 500 tratamiento");
    });
};

exports.createSeguimiento = async (req, res) => {
    const seguimientoNew = new EsquemaSeguimiento();
    seguimientoNew.fecha = Date.parse(req.body.fecha);
    seguimientoNew.total = req.body.total;
    seguimientoNew.abono = req.body.abono;
    seguimientoNew.saldo = req.body.saldo;
    seguimientoNew.paciente = req.body.paciente;
    console.log(seguimientoNew)
    EsquemaPaciente.findOne({ _id: req.body.paciente }, async (err, paciente) => {
        if (paciente) {
            seguimientoNew.paciente = req.body.paciente;
            await paciente.save();
            console.log(seguimientoNew.paciente);
            await seguimientoNew.save().then((result) => {
                console.log(result);
                if (result) {
                    res.send(result)
                } else {
                    res.status(400).json({ message: 'Error al crear Seguimiento' });
                }
            }
            ).catch((error) => {
                res.status(500).json({ error });
                console.log("Catch de await seguimiento");
            });
        } else {
            res.status(400).json({ message: 'Error al encontrar paciente' });
        }
    }
    )
};

exports.tratamiento = (req, res) => {
    EsquemaTratamiento.findOne({ diagnostico: req.params.id }).exec(function (err, trat) {
        res.status(200).send(trat);
    });
};

exports.pacienteSeguimiento = (req, res) => {
    //encuentra al seguimiento por id de paciente
    EsquemaSeguimiento.find({ paciente: req.params.id }).exec(function (err, seg) {
        res.status(200).send(seg);
    });
};

exports.seguimiento = (req, res) => {
    EsquemaSeguimiento.findOne({ _id: req.params.id }).populate('tratamientos').exec(function (err, seg) {
        res.status(200).send(seg);
    });
};

exports.cambioDatos = (req, res) => {
    console.log(req.params.id);
    EsquemaSeguimiento.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, seg) => {
        if (err) {
            res.status(500).send(err);
        }
        if (!seg) {
            return res.status(404).send('Error al encontrar seguimiento');
        } else {
            const abono = req.body.abono;
            const saldo = req.body.saldo;
            const total = req.body.total;
            if (abono || saldo || total) {
                res.status(201).json(seg);
            } else {
                res.status(409).send('Error al actualizar datos de seguimiento');
            }
        }
    })
};

exports.actualSegTrat = (req, res) => {
    console.log(req.params.id);
    EsquemaTratamiento.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, trat) => {
        if (err) {
            res.status(500).send(err);
        }
        if (!trat) {
            return res.status(404).send('Error al encontrar seguimiento');
        } else {
            const abono = req.body.abono;
            const saldo = req.body.saldo;            
            if (abono || saldo ) {
                res.status(201).json(trat);
            } else {
                res.status(409).send('Error al actualizar datos de tratamiento');
            }
        }
    })
};