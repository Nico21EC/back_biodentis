const Receta=require('../../controllers/receta/recetaController.ts');

module.exports = (router) =>{
    router.post('/crearReceta', Receta.createReceta);
    //router.get('/citas', Cita.citas);
    //router.put('/actulizaCita/:id', Cita.cambioCita);


}