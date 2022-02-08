'üse strict'

var Esquema = require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaOdontograma = require('../../model/odontograma/odontogramaModel.ts');

exports.creatediagnostico = async (req, res) => {
    console.log(req.body);
    const diagnosticonew = new Esquema();
    diagnosticonew.diagnostico = req.body.diagnostico;
    diagnosticonew.odontograma = req.body.odontograma;
    
    await diagnosticonew.save().then((result) => {
                EsquemaOdontograma.findOne({ _id:req.body.odontograma }, (err, odontograma) => {
                    if (odontograma) {
                        odontograma.diagnosticos.push(diagnosticonew);
                        odontograma.save();
                        res.send(result);
                    } else{
                        res.status(400).json({ message: 'Error al crear Diagnostico' })
                    }
                });
            }).catch((error) => {
                res.status(500).json({ error });
            });
};


  