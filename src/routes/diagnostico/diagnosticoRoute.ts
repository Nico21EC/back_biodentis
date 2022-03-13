const Diagnostico=require('../../controllers/diagnostico/diagnosticoController.ts');

module.exports = (router) =>{
    router.post('/crearDiagnostico', Diagnostico.creatediagnostico);
    router.get('/diagnosticosOdont/:id', Diagnostico.diagnosticoOdonto);
    router.get('/odontoDiagnostico/:id', Diagnostico.OdontoDiagnostico)
}
