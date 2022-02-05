const Odontograma=require('../../controllers/odontograma/odontogramaController');

module.exports = (router) =>{
    router.post('/crearOdontograma', Odontograma.createOdontograma);
   

}