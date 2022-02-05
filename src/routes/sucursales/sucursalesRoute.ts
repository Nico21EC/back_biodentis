const Sucursales=require('../../controllers/sucursales/sucursalesController');

module.exports = (router) =>{
    router.post('/crearSucu', Sucursales.createSucursal);
    router.get('/sucursales', Sucursales.sucursales);
  
}