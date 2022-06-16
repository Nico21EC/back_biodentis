const Facebook=require('./citaFacebookController.js');

module.exports = (router) =>{
    router.get('/citasFacebook', Facebook.citasFacebook);
    router.get('/reservaEditFacebook/:fecha/:hora', Facebook.reservaEditFacebook);
    //router.post('/messenger/webhook', Facebook.postFacebook);
}