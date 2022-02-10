'üse strict'

var Esquema = require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaOdontograma = require('../../model/odontograma/odontogramaModel.ts');

exports.creatediagnostico = async (req, res) => {
    console.log(req.body);
    const diagnosticonew = new Esquema();
    diagnosticonew.diagnostico = req.body.diagnostico;
    diagnosticonew.odontograma = req.body.odontograma;

    EsquemaOdontograma.findOne({ _id: diagnosticonew.odontograma }, (err, odonto) => {
        if (odonto) {
            diagnosticonew.odontograma = req.body.odontograma;
            odonto.save();
            console.log(diagnosticonew.paciente);
            diagnosticonew.save().then((result) => {
                console.log(result);
                if (result) {
                    res.send(result);
                } else {
                    res.status(400).json({ message: 'Error al crear Diagnostico' });
                }
            })
                .catch((error) => {
                    res.status(500).json({ error });
                });
        } else {
            res.status(400).json({ message: 'Error al encontrar odontograma' });
        }
    }
    )
};

exports.diagnosticoOdonto = (req, res) => {
    Esquema.find({odontograma:req.params.id}).exec(function (err, odonto) {
      res.status(200).send(odonto);
    });
  };