'üse strict'

var Esquema = require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaOdontograma = require('../../model/odontograma/odontogramaModel.ts');

exports.creatediagnostico = async (req, res) => {
    console.log(req);
    const diagnosticonew = new Esquema();
    diagnosticonew.diagnostico = req.body.diagnostico;
    diagnosticonew.odontograma = req.body.odontograma;

    await diagnosticonew.save().then((result) => {
                EsquemaOdontograma.findOne({ _id: req.body.odontograma }, (err, odontograma) => {
                    console.log(diagnosticonew.paciente)
                    if (odontograma) {
                        odontograma.diagnosticos.push(diagnosticonew);
                        odontograma.save();
                        res.json({ message: 'Diagnostico en Odontograma creado con exito' });
                    } else if (err) {
                        res.status(400).json({ message: 'Error al crear Diagnostico' })
                    }
                });
            }).catch((error) => {
                res.status(500).json({ error });
            });
};