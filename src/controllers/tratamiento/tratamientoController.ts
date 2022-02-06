var EsquemaTratamiento=require('../../model/tratamiento/tratamientoModel.ts');
var EsquemaDiagnostico=require('../../model/diagnostico/diagnosticoModel.ts');
var EsquemaSeguimiento = require('../../model/tratamiento/seguimientoModel.ts')
var EsquemaPaciente = require('../../model/paciente/pacienteModel.ts')

 exports.createTratamiento =async (req, res) => {
    const tratamientonew= new EsquemaTratamiento();
    tratamientonew.descripcion = req.body.descripcion;
    tratamientonew.costo = req.body.costo;
    tratamientonew.sesiones = req.body.sesiones;
   
    await tratamientonew.save().then((result)=>{
        EsquemaDiagnostico.findOne({_id:req.body.diagnostico},(err,diagnostico)=>{
            if(diagnostico){
                diagnostico.tratamientos.push(tratamientonew);
                diagnostico.save();
                res.json({ message: 'Tratamiento en diagnostico creado con exito' });
            }else{
                res.status(500).json({ err });
            }
        })
    }).catch((error) => {
        res.status(500).json({ error });
      });
 };

 exports.createSeguimiento =async (req, res) => {
    const seguimientoNew= new EsquemaSeguimiento();
    seguimientoNew.fecha=Date.parse(req.body.fecha);
    seguimientoNew.total=Number(req.body.total);
    seguimientoNew.abono=Number(req.body.abono);
    seguimientoNew.saldo=Number(req.body.saldo);
    seguimientoNew.estado=req.body.estado;
    seguimientoNew.tratamientos=req.body.tratamientos;
    seguimientoNew.paciente=req.body.paciente;
   
    await seguimientoNew.save().then((result)=>{
        EsquemaPaciente.findOne({_id:req.body.paciente},(err,paciente)=>{
            if(paciente){
                paciente.seguimiento.push(seguimientoNew);
                paciente.save();
                res.json({ message: 'Seguimiento creado con exito' });
            }else{
                res.status(500).json({ err });
            }
        })
    }).catch((error) => {
        res.status(500).json({ error });
      });
 };
