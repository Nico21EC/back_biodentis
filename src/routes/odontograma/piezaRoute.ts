const Pieza=require('../../controllers/odontograma/piezaController.ts');

module.exports = (router) =>{
    router.post('/crearPieza', Pieza.createPieza);
   

}