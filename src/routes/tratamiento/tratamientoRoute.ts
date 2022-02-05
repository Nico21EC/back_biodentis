const Tratamiento=require('../../controllers/tratamiento/tratamientoController');

module.exports = (router) =>{
    router.post('/crearTratamiento', Tratamiento.createTratamiento);
    //router.get('/citas', Cita.citas);
    //router.put('/actulizaCita/:id', Cita.cambioCita);


}