const Diagnostico=require('../../controllers/diagnostico/diagnosticoController.ts');

module.exports = (router) =>{
    router.post('/crearDiagnostico', Diagnostico.creatediagnostico);
    //router.get('/citas', Cita.citas);
    //router.put('/actulizaCita/:id', Cita.cambioCita);
    router.get('/diagnosticosOdont/:id', Diagnostico.diagnosticoOdonto);

}