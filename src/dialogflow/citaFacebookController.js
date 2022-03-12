'üse strict'

var EsquemaCitaFacebookModel = require('../dialogflow/citaFacebookModel.ts');

exports.createCitaFacebook = async (req, res) => {

  const citaFacebook = new EsquemaCitaFacebookModel();
  citaFacebook.nombre = req.body.nombre;
  citaFacebook.apellido = req.body.apellido;
  citaFacebook.fecha = req.body.fecha;
  citaFacebook.hora = req.body.hora;

  citaFacebook.save().then((result) => {
    if (result) {
      res.send(result);
    } else {
      res.status(400).json({ message: 'Error al crear Paciente' });
    }
  })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

