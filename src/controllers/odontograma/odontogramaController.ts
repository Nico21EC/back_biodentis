'üse strict'
var Esquema = require('../../model/odontograma/odontogramaModel.ts');
var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts');

exports.createOdontograma = (req, res) => {
  const odontogramanew = new Esquema();
  odontogramanew.fechaOdonto = req.body.fechaOdonto;
  odontogramanew.paciente = req.body.paciente;
  console.log(req.body);
  odontogramanew.save().then((result) => {
    EsquemaPaciente.findOne({ _id: odontogramanew.paciente }, (err, pac) => {
      console.log(odontogramanew.paciente)
      if (pac) {
        pac.odontogramas.push(odontogramanew);
        pac.save();
        res.send(result);
      } else if (err) {
        res.status(400).json({ message: 'Error al crear Odontograma' })
      }
    });
  }).catch((error) => {
    res.status(500).json({ error });
    console.log("Catch 500 odontograma")
  });
};

exports.odontograma = (req, res) => {
  Esquema.findOne({ _id: req.params.id }).populate('diagnostico').exec(function (err, odontograma) {
    res.status(200).send(odontograma);
  });
};


