const Diagnostico=require('../../controllers/diagnostico/diagnosticoController');

module.exports = (router) =>{
    router.post('/crearDiagnostico', Diagnostico.creatediagnostico);
    //router.get('/citas', Cita.citas);
    //router.put('/actulizaCita/:id', Cita.cambioCita);


}