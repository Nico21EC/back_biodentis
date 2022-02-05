const Cita=require('../../controllers/cita/citaController.ts');

module.exports = (router) =>{
    router.post('/crearCita', Cita.createCita);
    router.get('/citas', Cita.listaCitas);
    router.put('/cambioDatosCita/:id',Cita.cambioDatosCita);


}