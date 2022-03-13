'üse strict'

var EsquemaCitaFacebookModel = require('../dialogflow/citaFacebookModel.ts');


exports.citasFacebook = (req, res) => {
  EsquemaCitaFacebookModel.find({}).exec(function (err, pac) {
    res.status(200).send(pac);
  });
};
