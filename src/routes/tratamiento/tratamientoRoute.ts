const Tratamiento=require('../../controllers/tratamiento/tratamientoController.ts');

module.exports = (router) =>{
    router.post('/crearTratamiento', Tratamiento.createTratamiento);
    router.get('/verTratamientos/:id', Tratamiento.tratamiento);
    router.get('/verSeguimiento/:id', Tratamiento.seguimiento);
    router.post('/crearSeguimiento', Tratamiento.createSeguimiento);
    router.get('/pacienteSeg/:id', Tratamiento.pacienteSeguimiento);
    router.put('/cambioDatosSeguimiento/:id', Tratamiento.cambioDatos);
    router.put('/actualizarTratamiento/:id', Tratamiento.actualSegTrat);
}
