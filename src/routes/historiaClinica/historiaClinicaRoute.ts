const HistoriasClinica=require('../../controllers/historiaClinica/historiaClinicaController.ts');

module.exports = (router) =>{
    router.post('/crearHistoria', HistoriasClinica.createHistoria);
    router.get('/historias', HistoriasClinica.historias);
    router.get('/numhistorias',HistoriasClinica.numHistorias)
    //router.put('/actulizaCita/:id', Cita.cambioCita);
}