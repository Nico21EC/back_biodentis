const Odontograma=require('../../controllers/odontograma/odontogramaController.ts');

module.exports = (router) =>{
    router.post('/crearOdontograma', Odontograma.createOdontograma);
    
}