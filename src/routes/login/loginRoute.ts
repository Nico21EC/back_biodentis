const Odontologo=require('../../controllers/login/loginController.ts');

module.exports = (router) =>{
    router.post('/registro', Odontologo.createOdontolo);
    router.post('/login', Odontologo.loginOdontolo);
    router.get('/odos',Odontologo.allodontologos);
    router.put('/actulizaContrasenia/:id', Odontologo.cambioContraseñaOdontolo);
    router.put('/cambioEstado', Odontologo.cambioEstado);


}