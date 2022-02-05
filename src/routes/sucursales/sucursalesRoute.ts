const Sucursales=require('../../controllers/sucursales/sucursalesController.ts');

module.exports = (router) =>{
    router.post('/crearSucu', Sucursales.createSucursal);
    router.get('/sucursales', Sucursales.sucursales);
  
}