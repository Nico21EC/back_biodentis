const Pieza=require('../../controllers/odontograma/piezaController');

module.exports = (router) =>{
    router.post('/crearPieza', Pieza.createPieza);
   

}