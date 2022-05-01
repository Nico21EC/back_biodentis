'üse strict'

var EsquemaCitaFacebookModel = require('../dialogflow/citaFacebookModel.ts');


exports.citasFacebook = (req, res) => {
  EsquemaCitaFacebookModel.find({}).exec(function (err, pac) {
    res.status(200).send(pac);
  });
};

exports.reservaEditFacebook = (req, res) => {
  EsquemaCitaFacebookModel.findOne({})
  .where({fecha: req.params.fecha})
  .exec((err, act) => {
      if(err) {
          console.log('Hubo un error en reserva Facebook');
          return res.status(500).json({error: err.message}); //debes enviar una respuesta o llamar al manejador de errores (return next(err))
      }
      console.log(act);
      return res.status(200).json(act); // en este ejemplo se envía el resultado
  });
}