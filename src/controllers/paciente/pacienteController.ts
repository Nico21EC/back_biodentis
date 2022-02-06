'üse strict'

var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts');
var EsquemaHistoria = require('../../model/historiaClinica/historiaClinicaModel.ts');
var EsquemaOdontograma = require('../../model/odontograma/odontogramaModel.ts');

exports.createPaciente = async (req, res) => {

  const pacientenew = new EsquemaPaciente();
  pacientenew.nombre = req.body.nombre;
  pacientenew.apellido = req.body.apellido;
  pacientenew.numCedula = req.body.numCedula;
  pacientenew.celular = req.body.celular;
  pacientenew.direccion = req.body.direccion;
  pacientenew.sexo = req.body.sexo;
  pacientenew.edad = req.body.edad;
  pacientenew.fechaNacimiento = req.body.fechaNacimiento;
  pacientenew.correo = req.body.correo;

  pacientenew.save().then((result) => {
    if (result) {
      res.json({ message: 'Paciente creado con exito' });
    } else {
      res.status(400).json({ message: 'Error al crear Paciente' });
    }
  })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.paciente = (req, res) => {
  EsquemaPaciente.findOne({ _id: req.params.id }).exec(function (err, pac) {
    res.status(200).send(pac);
  });
};

exports.pacientes = (req, res) => {
  EsquemaPaciente.find({}).populate('citas').populate('odontogramas').exec(function (err, pac) {
    res.status(200).send(pac);
  });
};

exports.cambioDatos = (req, res) => {
  console.log(req.params.id);
  EsquemaPaciente.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, pac) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pac) {
      return res.status(404).send('Error al encontrar paciente');
    } else {
      const direccion = req.body.direccion;
      const celular = req.body.celular;
      const correo = req.body.correo;
      console.log(correo);
      console.log(celular);
      console.log(direccion);

      if (direccion || celular || correo) {
        res.status(201).json(pac);
      } else {
        res.status(409).send('Error al actualizar datos');
      }
    }
  })
};

exports.PaginacionPaciente = (req, res, next) => {
  let perPage =Number( req.params.num) ;
  console.log(req.params.num);
  let page = Number(req.params.page) || 1;

  EsquemaPaciente
    .find({}) // finding all documents
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, pac) => {
      EsquemaPaciente.countDocuments((err, count) => { // count to calculate the number of pages
        if (err){ return next(err);
        }else{
          res.json( {
            pac,
            current: page,
            pages: Math.ceil(count / perPage),
            total:count
          });
        }
        console.log(pac);
      });
    });
};

exports.buscarPaciente= (req, res, next) => {
  const name=req.body.nombre
  const cedu=req.body.numCedula
  console.log(req.body.numCedula)
  console.log(req.body.nombre)
  let perPage =Number( req.params.num) ;
  console.log(req.params.num);
  let page = Number(req.params.page) || 1;

EsquemaPaciente.find({$or: [{nombre:{ $regex: '.*' + name + '.*' }}, {numCedula:{ $regex: '.*' + cedu + '.*' }} ]}).skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, pac) => {
      EsquemaPaciente.countDocuments((err, count) => { // count to calculate the number of pages
        if (err){ return next(err);
        }else{
          res.json( {
            pac,
            current: page,
            pages: Math.ceil(count / perPage),
            total:count
          });
        }
        console.log(pac);
        
      });
    });
}

